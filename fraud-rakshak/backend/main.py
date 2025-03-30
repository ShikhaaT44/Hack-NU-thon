from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import requests
import json
from typing import Dict
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Streamlit app URL
STREAMLIT_URL = "http://localhost:8501"  # Update this with your Streamlit app URL

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)) -> Dict:
    try:
        # Verify if file is CSV
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")

        # Read the CSV file
        contents = await file.read()
        
        # Save temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, 'wb') as f:
            f.write(contents)

        # Read with pandas to verify format
        try:
            df = pd.read_csv(temp_path)
        except Exception as e:
            os.remove(temp_path)
            raise HTTPException(status_code=400, detail="Invalid CSV format")

        # Here you would send the data to your Streamlit app
        # For now, we'll simulate the ML model response
        # In production, you would make an API call to your Streamlit app
        
        # Example response structure
        response = {
            "status": "success",
            "predictions": {
                "fraud_detected": True,
                "confidence_score": 0.89,
                "suspicious_transactions": [
                    {
                        "transaction_id": "TX123",
                        "risk_score": 0.95,
                        "reason": "Unusual amount and location"
                    }
                ]
            }
        }

        # Clean up
        os.remove(temp_path)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 