
import pandas as pd
from typing import List, Dict

def process_csv(file_path: str) -> Dict[str, List[Dict]]:
    df = pd.read_csv(file_path)

    # Extracting Users
    users = df[['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address', 'city', 'country', 'mpin']].drop_duplicates().to_dict(orient="records")

    # Extracting Accounts
    accounts = df[['user_id', 'account_number', 'account_type', 'balance', 'currency', 'status']].drop_duplicates().to_dict(orient="records")

    # Extracting Transactions
    transactions = df[['account_id', 'transaction_type', 'transaction_amount', 'device_type', 'ip_address', 'latitude', 'longitude', 'location', 
                       'is_trusted_device', 'known_location', 'transaction_frequency', 'high_amount_deviation', 'multiple_devices_used', 
                       'transaction_at_odd_hours', 'new_device_flag', 'ip_change_frequency', 'location_deviation']].drop_duplicates().to_dict(orient="records")

    # Extracting Fraud Transactions
    fraud_transactions = df[['transaction_id', 'fraud_type', 'detected_by', 'confidence_score', 'flagged_features', 'comments']].dropna().to_dict(orient="records")

    # Extracting Anomaly Logs
    anomaly_logs = df[['transaction_id', 'anomaly_score', 'is_anomalous', 'anomaly_features']].dropna().to_dict(orient="records")

    # Extracting Alerts
    alerts = df[['transaction_id', 'alert_type', 'recipient', 'alert_message', 'is_resolved', 'resolved_at']].dropna().to_dict(orient="records")

    return {
        "users": users,
        "accounts": accounts,
        "transactions": transactions,
        "fraud_transactions": fraud_transactions,
        "anomaly_logs": anomaly_logs,
        "alerts": alerts
    }
