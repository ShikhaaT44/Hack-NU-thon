from fastapi import FastAPI, UploadFile, HTTPException, File
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import pandas as pd
import os
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from typing import Optional
import logging
import uuid
import time
import re
import ssl
import dns.resolver

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for MongoDB
client = None
db = None

load_dotenv()
app = FastAPI()

def hide_sensitive_info(text):
    """Hide sensitive information in logs"""
    if not text:
        return text
    # Hide MongoDB URI credentials
    return re.sub(r'mongodb(\+srv)?://[^@]+@', 'mongodb://****:****@', text)

# MongoDB connection using pymongo
def get_mongodb_client():
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set")
        
        logger.info("Attempting to connect to MongoDB...")
        
        # Add connection timeout and retry parameters
        new_client = MongoClient(
            mongodb_uri,
            serverSelectionTimeoutMS=10000,    # 10 seconds timeout
            connectTimeoutMS=10000,            # 10 seconds connection timeout
            socketTimeoutMS=10000,             # 10 seconds socket timeout
            retryWrites=True,
            ssl=True,
            tlsAllowInvalidCertificates=True,
            maxPoolSize=10,
            minPoolSize=1
        )
        
        # Test the connection
        new_client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        return new_client
    except Exception as e:
        logger.error(f"MongoDB connection error: {hide_sensitive_info(str(e))}")
        raise e

@app.on_event("startup")
def startup_db_client():
    global client, db
    max_retries = 3
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            # Initialize MongoDB client
            client = get_mongodb_client()
            db = client.fraudrakshak
            
            # Test the connection
            client.admin.command('ping')
            logger.info("Successfully connected to MongoDB!")
            logger.info(f"Using database: {db.name}")
            
            # Create collections if they don't exist
            collections = ['users', 'accounts', 'transactions', 'fraud_transactions', 'anomaly_logs', 'alerts']
            for collection in collections:
                if collection not in db.list_collection_names():
                    db.create_collection(collection)
                    logger.info(f"Created collection: {collection}")
            return
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            if attempt < max_retries - 1:
                logger.warning(f"Connection attempt {attempt + 1} failed. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error(f"Failed to connect to MongoDB after {max_retries} attempts")
                raise e
        except Exception as e:
            logger.error(f"Error during startup: {hide_sensitive_info(str(e))}")
            raise e

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_users_data(df):
    """Process and insert user data"""
    users_data = []
    for _, row in df.iterrows():
        user = {
            'user_id': str(uuid.uuid4()),
            'first_name': row.get('first_name', ''),
            'last_name': row.get('last_name', ''),
            'email': row.get('email', ''),
            'phone': row.get('phone', ''),
            'date_of_birth': row.get('date_of_birth', None),
            'address': row.get('address', ''),
            'city': row.get('city', ''),
            'country': row.get('country', ''),
            'mpin': row.get('mpin', ''),
            'created_at': datetime.now()
        }
        users_data.append(user)
    return users_data

def process_accounts_data(df, user_id):
    """Process and insert account data"""
    accounts_data = []
    for _, row in df.iterrows():
        account = {
            'account_id': str(uuid.uuid4()),
            'user_id': user_id,
            'account_number': row.get('account_number', ''),
            'account_type': row.get('account_type', 'Savings'),
            'balance': float(row.get('balance', 0)),
            'currency': row.get('currency', 'USD'),
            'status': row.get('status', 'Active'),
            'created_at': datetime.now()
        }
        accounts_data.append(account)
    return accounts_data

def process_transactions_data(df, account_id):
    """Process and insert transaction data"""
    transactions_data = []
    for _, row in df.iterrows():
        transaction = {
            'transaction_id': str(uuid.uuid4()),
            'account_id': account_id,
            'transaction_type': row.get('transaction_type', 'Transfer'),
            'transaction_amount': float(row.get('transaction_amount', 0)),
            'transaction_date': datetime.now(),
            'device_type': row.get('device_type', 'Mobile'),
            'ip_address': row.get('ip_address', ''),
            'latitude': float(row.get('latitude', 0)),
            'longitude': float(row.get('longitude', 0)),
            'location': row.get('location', ''),
            'is_trusted_device': bool(row.get('is_trusted_device', False)),
            'known_location': bool(row.get('known_location', False)),
            'transaction_frequency': int(row.get('transaction_frequency', 0)),
            'high_amount_deviation': bool(row.get('high_amount_deviation', False)),
            'multiple_devices_used': bool(row.get('multiple_devices_used', False)),
            'transaction_at_odd_hours': bool(row.get('transaction_at_odd_hours', False)),
            'new_device_flag': bool(row.get('new_device_flag', False)),
            'ip_change_frequency': int(row.get('ip_change_frequency', 0)),
            'location_deviation': bool(row.get('location_deviation', False))
        }
        transactions_data.append(transaction)
    return transactions_data

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        
        if not file.filename.endswith('.csv'):
            return JSONResponse(
                status_code=400,
                content={"error": "File must be a CSV file"}
            )
        
        # Read file content
        contents = await file.read()
        logger.info(f"File size: {len(contents)} bytes")
            
        try:
            # Try UTF-8 first
            df = pd.read_csv(pd.io.common.BytesIO(contents), encoding='utf-8')
            logger.info(f"Successfully read CSV with UTF-8 encoding")
        except UnicodeDecodeError:
            # Fall back to latin-1 if UTF-8 fails
            df = pd.read_csv(pd.io.common.BytesIO(contents), encoding='latin-1')
            logger.info(f"Successfully read CSV with latin-1 encoding")
            
        logger.info(f"CSV data shape: {df.shape}")
        logger.info(f"CSV columns: {df.columns.tolist()}")
        
        # Process and insert data into respective collections
        try:
            # Process Users
            users_data = process_users_data(df)
            logger.info(f"Processed {len(users_data)} users")
            
            if users_data:
                try:
                    users_result = db.users.insert_many(users_data)
                    logger.info(f"Successfully inserted {len(users_result.inserted_ids)} users")
                    
                    # Process Accounts for each user
                    for user in users_data:
                        accounts_data = process_accounts_data(df, user['user_id'])
                        logger.info(f"Processed {len(accounts_data)} accounts for user {user['user_id']}")
                        
                        if accounts_data:
                            try:
                                accounts_result = db.accounts.insert_many(accounts_data)
                                logger.info(f"Successfully inserted {len(accounts_result.inserted_ids)} accounts for user {user['user_id']}")
                                
                                # Process Transactions for each account
                                for account in accounts_data:
                                    transactions_data = process_transactions_data(df, account['account_id'])
                                    logger.info(f"Processed {len(transactions_data)} transactions for account {account['account_id']}")
                                    
                                    if transactions_data:
                                        try:
                                            transactions_result = db.transactions.insert_many(transactions_data)
                                            logger.info(f"Successfully inserted {len(transactions_result.inserted_ids)} transactions for account {account['account_id']}")
                                        except Exception as tx_error:
                                            logger.error(f"Error inserting transactions: {str(tx_error)}")
                            except Exception as acc_error:
                                logger.error(f"Error inserting accounts: {str(acc_error)}")
                except Exception as user_error:
                    logger.error(f"Error inserting users: {str(user_error)}")
            
            # Get final counts
            users_count = db.users.count_documents({})
            accounts_count = db.accounts.count_documents({})
            transactions_count = db.transactions.count_documents({})
            
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Successfully processed and inserted data",
                    "status": "success",
                    "users_count": users_count,
                    "accounts_count": accounts_count,
                    "transactions_count": transactions_count,
                    "details": {
                        "processed_users": len(users_data) if users_data else 0,
                        "processed_accounts": sum(len(process_accounts_data(df, user['user_id'])) for user in users_data) if users_data else 0,
                        "processed_transactions": sum(len(process_transactions_data(df, account['account_id'])) for account in accounts_data) if accounts_data else 0
                    }
                }
            )
            
        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            return JSONResponse(
                status_code=500,
                content={"error": f"Database error: {str(db_error)}"}
            )
            
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    finally:
        await file.close()

@app.get("/api/verify/{collection}")
def verify_collection(collection: str):
    try:
        count = db[collection].count_documents({})
        sample = db[collection].find_one()
        
        if sample and '_id' in sample:
            sample['_id'] = str(sample['_id'])
        
        logger.info(f"Collection {collection} verification: {count} documents found")
        
        return {
            "collection": collection,
            "count": count,
            "sample_document": sample,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/database-status")
def check_database():
    try:
        # First check if we have a valid client
        if not client:
            logger.error("MongoDB client is not initialized")
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "error": "MongoDB client is not initialized",
                    "details": "Please restart the server to reinitialize the connection"
                }
            )

        # Test the connection
        try:
            client.admin.command('ping')
            logger.info("Successfully pinged MongoDB server")
        except Exception as ping_error:
            logger.error(f"Failed to ping MongoDB server: {str(ping_error)}")
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "error": "Failed to connect to MongoDB",
                    "details": str(ping_error)
                }
            )
        
        # Check if we have a valid database
        if not db:
            logger.error("Database is not initialized")
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "error": "Database is not initialized",
                    "details": "Please restart the server to reinitialize the database connection"
                }
            )
        
        # Get database name
        db_name = db.name
        logger.info(f"Connected to database: {db_name}")
        
        # Get collections
        try:
            collections = db.list_collection_names()
            logger.info(f"Found collections: {collections}")
        except Exception as collections_error:
            logger.error(f"Failed to get collections: {str(collections_error)}")
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "error": "Failed to get collections",
                    "details": str(collections_error)
                }
            )
        
        # Get stats for each collection
        stats = {}
        for collection in collections:
            try:
                count = db[collection].count_documents({})
                sample = db[collection].find_one()
                if sample and '_id' in sample:
                    sample['_id'] = str(sample['_id'])
                stats[collection] = {
                    "count": count,
                    "sample": sample
                }
                logger.info(f"Collection {collection}: {count} documents")
            except Exception as e:
                logger.error(f"Error getting stats for {collection}: {e}")
                stats[collection] = {
                    "error": str(e)
                }
        
        response_data = {
            "status": "connected",
            "database": db_name,
            "collections": stats,
            "connection_info": {
                "host": client.address[0],
                "port": client.address[1],
                "database": db_name
            }
        }
        
        return JSONResponse(content=jsonable_encoder(response_data))
        
    except Exception as e:
        logger.error(f"Database status check error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e),
                "details": "An unexpected error occurred while checking database status"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="debug"
    )
