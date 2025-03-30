



import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import math

# ✅ Load dataset
file_path = 'newdata.csv'  # Update with your file path
df = pd.read_csv(file_path)

### 1️⃣ FEATURE ENGINEERING (Enhanced)

# Convert the timestamp column to datetime format
df['Transaction_Timestamp'] = pd.to_datetime(df['Transaction_Timestamp'], errors='coerce')

# Transaction amount deviation
df['Transaction_Amount_Deviation'] = abs(df['Transaction_Amount'] - df['Avg_Transaction_Amount'])

# Bulk transactions: sort by Customer_ID and Transaction_Timestamp
df.sort_values(['Customer_ID', 'Transaction_Timestamp'], inplace=True)
df['Time_Diff'] = df.groupby('Customer_ID')['Transaction_Timestamp'].diff().dt.total_seconds().fillna(9999)
df['Bulk_Transactions'] = (df['Time_Diff'] < 60).astype(int)

# Inconsistent spending behavior
df['Inconsistent_Spending'] = ((df['Transaction_Amount'] > (1.5 * df['Avg_Transaction_Amount'])) | 
                               (df['Transaction_Amount'] < (0.5 * df['Avg_Transaction_Amount']))).astype(int)

# High-risk merchant category
high_risk_categories = ['Gambling', 'Crypto Exchange', 'Adult Services']
df['High_Risk_Merchant'] = df['Merchant_Category'].isin(high_risk_categories).astype(int)

# Frequent transaction declines (simulated)
df['Transaction_Declines'] = np.random.randint(0, 5, len(df))  # Simulated failed transaction count
df['Frequent_Declines'] = (df['Transaction_Declines'] >= 3).astype(int)

# Rapid location hopping: count unique Transaction_City per Customer_ID
df['Location_Hops'] = df.groupby('Customer_ID')['Transaction_City'].transform('nunique')
df['Rapid_Location_Hopping'] = (df['Location_Hops'] > 3).astype(int)

# Device and location mismatch features
df['IP_Change_Frequency'] = df.groupby('Customer_ID')['IP_Address_New'].transform('nunique')

# New device flag
device_usage = df.groupby(['Customer_ID', 'Device_Type']).size().reset_index(name='Device_Usage_Count')
df = df.merge(device_usage, on=['Customer_ID', 'Device_Type'], how='left')
df['New_Device_Flag'] = (df['Device_Usage_Count'] == 1).astype(int)

# Location deviation based on Transaction_City and Transaction_Country
df['Location'] = df['Transaction_City'] + ', ' + df['Transaction_Country']
location_usage = df.groupby(['Customer_ID', 'Location']).size().reset_index(name='Location_Usage_Count')
df = df.merge(location_usage, on=['Customer_ID', 'Location'], how='left')
df['Location_Deviation'] = (df['Location_Usage_Count'] == 1).astype(int)

# Compute geographic distance using latitude and longitude (Haversine formula)
def haversine(lat1, lon1, lat2, lon2):
    # convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    # haversine formula 
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371  # Radius of earth in kilometers.
    return c * r

# Assume the dataset has 'Latitude' and 'Longitude' columns for the transaction location.
df['Prev_Latitude'] = df.groupby('Customer_ID')['New_Latitude'].shift(1)
df['Prev_Longitude'] = df.groupby('Customer_ID')['New_Longitude'].shift(1)
df['Geo_Distance'] = haversine(df['Prev_Latitude'], df['Prev_Longitude'], df['New_Latitude'], df['New_Longitude'])
df['Geo_Distance'] = df['Geo_Distance'].fillna(0)  # For the first transaction per customer

# Compute speed in km/h (if time difference is available)
# Convert Time_Diff from seconds to hours; avoid division by zero
df['Speed_kmh'] = np.where(df['Time_Diff'] < 1, 0, df['Geo_Distance'] / (df['Time_Diff'] / 3600))

# Drop temporary columns
df.drop(['Device_Usage_Count', 'Location_Usage_Count'], axis=1, inplace=True)

### 2️⃣ LABEL ENCODING
from sklearn.preprocessing import LabelEncoder
categorical_cols = ['Device_Type', 'Transaction_Type', 'Transaction_City', 
                    'Transaction_Country', 'IP_Address_New', 'Merchant_Category']
le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col])

### 3️⃣ MODEL TRAINING WITH ACCURACY CHECK

# Define enhanced feature groups
behavioral_features = ['Transaction_Amount_Deviation', 'Transaction_Frequency', 
                       'High_Amount_Deviation', 'Multiple_Devices_Used', 
                       'Transaction_At_Odd_Hours', 'Bulk_Transactions', 
                       'Inconsistent_Spending', 'High_Risk_Merchant',
                       'Frequent_Declines', 'Rapid_Location_Hopping']

# For location-based features, include our new geographic features
location_features = ['New_Device_Flag', 'IP_Change_Frequency', 
                     'Location_Deviation', 'Is_Trusted_Device', 'Known_Location',
                     'Geo_Distance', 'Speed_kmh']

# ✅ Function to train supervised models
def train_and_evaluate(features, model_type='random_forest', target='Is_Fraud'):
    """Train and evaluate the model with accuracy metrics."""
    X = df[features]
    y = df[target]

    # Split into train/test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model selection
    if model_type == 'random_forest':
        model = RandomForestClassifier(n_estimators=100, random_state=42)
    elif model_type == 'knn':
        model = KNeighborsClassifier(n_neighbors=5)
    else:
        raise ValueError("Unsupported model type. Use 'random_forest' or 'knn'.")

    # Fit model
    model.fit(X_train, y_train)

    # Predictions
    y_pred = model.predict(X_test)
    # For KNN, predict_proba is available if using a classifier
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
        roc_auc = roc_auc_score(y_test, y_proba)
    else:
        roc_auc = 0

    # Accuracy Metrics
    accuracy = accuracy_score(y_test, y_pred)
    class_report = classification_report(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Display Metrics
    print(f"\n🔍 {model_type.upper()} Model Accuracy for features: {features}")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"ROC-AUC: {roc_auc:.4f}")
    print(class_report)

    # Plotting Confusion Matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Legit', 'Fraud'], yticklabels=['Legit', 'Fraud'])
    plt.title(f"{model_type.upper()} Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

    return model

# ✅ Train & Evaluate Behavioral Anomalies Model using Random Forest
behavioral_model = train_and_evaluate(behavioral_features, model_type='random_forest')

# ✅ Train & Evaluate Device & Location Mismatch Model using KNN
location_model = train_and_evaluate(location_features, model_type='knn')

# ✅ Anomaly Detection Model (Isolation Forest)
X_anomaly = df[behavioral_features + location_features]
anomaly_model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
anomaly_model.fit(X_anomaly)

# ✅ Save Models
joblib.dump(behavioral_model, 'behavioral_model.pkl')
joblib.dump(location_model, 'location_model.pkl')
joblib.dump(anomaly_model, 'anomaly_model.pkl')
print("✅ Models saved successfully!")

#### 4️⃣ ENHANCED ALERT SYSTEM
def trigger_detailed_alerts(agent_model, anomaly_model, agent_features, full_features, agent_name):
    alerts = []
    
    # Supervised model predictions
    predictions = agent_model.predict(df[agent_features])
    
    # Anomaly model predictions
    anomaly_preds = anomaly_model.predict(df[full_features])

    for i, pred in enumerate(predictions):
        risk_factors = []

        # Check various risk factors
        if df['Bulk_Transactions'].iloc[i]:
            risk_factors.append("Bulk transactions in short time")
        if df['Inconsistent_Spending'].iloc[i]:
            risk_factors.append("Inconsistent spending behavior")
        if df['High_Risk_Merchant'].iloc[i]:
            risk_factors.append("High-risk merchant")
        if df['Frequent_Declines'].iloc[i]:
            risk_factors.append("Frequent transaction declines")
        if df['Rapid_Location_Hopping'].iloc[i]:
            risk_factors.append("Rapid location hopping")
        # Check geographic movement: if speed is high (e.g., > 100 km/h) flag rapid location change
        if df['Speed_kmh'].iloc[i] > 100:
            risk_factors.append("Rapid location change detected")

        # Trigger alerts if the supervised model flagged fraud (pred==1) or the anomaly model flagged anomaly (anomaly_preds == -1)
        if pred == 1 or anomaly_preds[i] == -1:
            alert_msg = (
                f"🚨 ALERT [{agent_name}] - Suspicious transaction detected\n"
                f"Customer ID: {df['Customer_ID'].iloc[i]}\n"
                f"Amount: ${df['Transaction_Amount'].iloc[i]}\n"
                f"Location: {df['Location'].iloc[i]} (Distance: {df['Geo_Distance'].iloc[i]:.2f} km, Speed: {df['Speed_kmh'].iloc[i]:.2f} km/h)\n"
                f"Device: {df['Device_Type'].iloc[i]}\n"
                f"Risk Factors: {', '.join(risk_factors) if risk_factors else 'None'}\n"
                f"Anomaly Score: {'High' if anomaly_preds[i] == -1 else 'Low'}\n"
            )
            alerts.append(alert_msg)

    print("\n🔔 Detailed Alerts:")
    print('\n\n'.join(alerts[:5]) if alerts else 'No alerts triggered.')

# Define full features set (combining both groups)
full_features = behavioral_features + location_features

# Trigger alerts for both models
trigger_detailed_alerts(behavioral_model, anomaly_model, behavioral_features, full_features, 'Behavioral Anomalies Agent')
trigger_detailed_alerts(location_model, anomaly_model, location_features, full_features, 'Device & Location Mismatch Agent')
