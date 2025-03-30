from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pandas as pd
import os
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# MongoDB connection using pymongo
try:
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client.fraudrakshak
    print(f"MongoDB URI: {os.getenv('MONGODB_URI')}")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    raise e

@app.on_event("startup")
def startup_db_client():
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        print(f"Using database: {db.name}")
        # Create collections if they don't exist
        collections = ['users', 'transactions', 'accounts']
        for collection in collections:
            if collection not in db.list_collection_names():
                db.create_collection(collection)
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_risk_score(transaction_data):
    risk_factors = {
        'high_amount_deviation': 0.3,
        'multiple_devices_used': 0.2,
        'transaction_at_odd_hours': 0.15,
        'new_device_flag': 0.15,
        'location_deviation': 0.2
    }
    
    risk_score = 0
    for factor, weight in risk_factors.items():
        if factor in transaction_data and transaction_data[factor]:
            risk_score += weight
    
    # Normalize score to 0-100 range
    return min(risk_score * 100, 100)

def process_csv_data(df, collection_name):
    try:
        records = df.to_dict('records')
        print(f"Processing {len(records)} records for {collection_name}")
        
        collection = db[collection_name]
        
        try:
            result = collection.insert_many(records)
            print(f"Successfully inserted {len(result.inserted_ids)} documents into {collection_name}")
            return len(result.inserted_ids)
        except Exception as e:
            print(f"MongoDB insertion error: {e}")
            raise e
            
    except Exception as e:
        print(f"Data processing error: {e}")
        raise e

@app.get("/api/verify/{collection}")
def verify_collection(collection: str):
    try:
        count = db[collection].count_documents({})
        sample = db[collection].find_one()
        
        return {
            "collection": collection,
            "count": count,
            "sample_document": sample,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
def upload_file(file: UploadFile):
    try:
        print(f"Received file: {file.filename}")
        
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read file content in chunks
        contents = b''
        while chunk := file.file.read(8192):
            contents += chunk
            
        try:
            # Try UTF-8 first
            df = pd.read_csv(pd.io.common.BytesIO(contents), encoding='utf-8')
        except UnicodeDecodeError:
            # Fall back to latin-1 if UTF-8 fails
            df = pd.read_csv(pd.io.common.BytesIO(contents), encoding='latin-1')
            
        print(f"CSV data shape: {df.shape}")
        
        # Determine collection name
        filename = file.filename.lower()
        collection_name = next(
            (name for name in ['users', 'accounts', 'transactions', 'fraud_transactions', 'anomaly_logs', 'alerts']
             if name in filename),
            None
        )
        
        if not collection_name:
            raise HTTPException(
                status_code=400,
                detail="Invalid filename. Must contain: users, accounts, transactions, fraud, anomaly, or alerts"
            )
            
        print(f"Selected collection: {collection_name}")
        
        # Process and insert data
        try:
            collection = db[collection_name]
            records = df.to_dict('records')
            
            if not records:
                raise HTTPException(status_code=400, detail="No data found in CSV file")
                
            print(f"Inserting {len(records)} records into {collection_name}")
            result = collection.insert_many(records)
            
            inserted_count = len(result.inserted_ids)
            print(f"Successfully inserted {inserted_count} records")
            
            return JSONResponse(content={
                "message": f"Successfully inserted {inserted_count} records",
                "collection": collection_name,
                "count": inserted_count
            })
            
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
            
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        file.file.close()

@app.get("/api/database-status")
def check_database():
    try:
        client.admin.command('ping')
        
        collections = db.list_collection_names()
        print(f"Found collections: {collections}")
        
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
                print(f"Collection {collection}: {count} documents")
            except Exception as e:
                print(f"Error getting stats for {collection}: {e}")
                stats[collection] = {
                    "error": str(e)
                }
        
        response_data = {
            "status": "connected",
            "database": db.name,
            "collections": stats,
            "mongodb_uri": "mongodb+srv://[hidden]@fraudrakshak..."
        }
        
        return JSONResponse(content=jsonable_encoder(response_data))
        
    except Exception as e:
        print(f"Database status check error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
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
