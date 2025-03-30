import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_test_data():
    # Generate Users
    users_df = pd.DataFrame({
        'first_name': ['John', 'Jane', 'Mike'],
        'last_name': ['Doe', 'Smith', 'Johnson'],
        'email': ['john@example.com', 'jane@example.com', 'mike@example.com'],
        'phone': ['1234567890', '2345678901', '3456789012'],
        'date_of_birth': ['1990-01-01', '1992-02-02', '1988-03-03'],
        'address': ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
        'city': ['New York', 'Los Angeles', 'Chicago'],
        'country': ['USA', 'USA', 'USA'],
        'mpin': [1234, 5678, 9012]
    })
    users_df.to_csv('test_users.csv', index=False)

    # Generate Accounts
    accounts_df = pd.DataFrame({
        'user_id': ['1', '2', '3'],
        'account_number': ['ACC001', 'ACC002', 'ACC003'],
        'account_type': ['Savings', 'Checking', 'Credit'],
        'balance': [5000.00, 3000.00, 1000.00],
        'currency': ['USD', 'USD', 'USD'],
        'status': ['Active', 'Active', 'Active']
    })
    accounts_df.to_csv('test_accounts.csv', index=False)

    # Generate Transactions
    transactions_df = pd.DataFrame({
        'account_id': ['1', '2', '3'],
        'transaction_type': ['Transfer', 'Withdrawal', 'Deposit'],
        'transaction_amount': [100.00, 200.00, 300.00],
        'device_type': ['Mobile', 'Laptop', 'Tablet'],
        'ip_address': ['192.168.1.1', '192.168.1.2', '192.168.1.3'],
        'Latitude': [40.7128, 34.0522, 41.8781],
        'Longitude': [-74.0060, -118.2437, -87.6298],
        'location': ['New York', 'Los Angeles', 'Chicago'],
        'is_trusted_device': [True, True, False],
        'known_location': [True, True, False],
        'transaction_frequency': [5, 3, 1],
        'high_amount_deviation': [False, False, True],
        'multiple_devices_used': [False, True, True],
        'transaction_at_odd_hours': [False, False, True],
        'new_device_flag': [False, True, True],
        'ip_change_frequency': [1, 2, 3],
        'location_deviation': [False, False, True]
    })
    transactions_df.to_csv('test_transactions.csv', index=False)

    print("Test CSV files generated successfully!")

if __name__ == "__main__":
    generate_test_data()
