from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os



MONGODB_URL = os.getenv("MONGODB_URI")

client = AsyncIOMotorClient(MONGODB_URL)
database = client.fraudrakshak

# Collections
users_collection = database.users
accounts_collection = database.accounts
transactions_collection = database.transactions
fraud_transactions_collection = database.fraud_transactions
anomaly_logs_collection = database.anomaly_logs
alerts_collection = database.alerts

async def init_db():
    try:
        # Create indexes for users collection
        await users_collection.create_index("email", unique=True)
        
        # Create indexes for accounts collection
        await accounts_collection.create_index("account_number", unique=True)
        await accounts_collection.create_index("user_id")
        
        # Create indexes for transactions collection
        await transactions_collection.create_index("account_id")
        await transactions_collection.create_index("transaction_date")
        
        # Create indexes for fraud_transactions collection
        await fraud_transactions_collection.create_index("transaction_id")
        await fraud_transactions_collection.create_index("alert_time")
        
        # Create indexes for anomaly_logs collection
        await anomaly_logs_collection.create_index("transaction_id")
        await anomaly_logs_collection.create_index("detected_at")
        
        # Create indexes for alerts collection
        await alerts_collection.create_index("transaction_id")
        await alerts_collection.create_index("created_at")
        await alerts_collection.create_index("is_resolved")
        
        print("Database initialized successfully with all required indexes")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise e 
# from motor.motor_asyncio import AsyncIOMotorClient

# MONGO_URI = "mongodb+srv://admin:admin@fraudrakshak.mymjyie.mongodb.net/?retryWrites=true&w=majority&appName=fraudRakshak"
# client = AsyncIOMotorClient(MONGO_URI)
# db = client["fraud_detection"]  # Database name
