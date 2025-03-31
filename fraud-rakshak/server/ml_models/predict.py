import pandas as pd
from fraud_detection import FraudDetectionModel

def predict_transactions(transactions_df):
    """
    Make predictions on a DataFrame of transactions.
    
    Args:
        transactions_df (pd.DataFrame): DataFrame containing transaction data
        
    Returns:
        dict: Dictionary containing predictions, risk scores, and reasons
    """
    # Load the trained model
    model = FraudDetectionModel.load_model('multi_agent_fraud_model.pkl')
    
    # Make predictions
    results = model.predict(transactions_df)
    
    return results

def main():
    # Example usage
    # Load some transaction data
    transactions = pd.read_csv('test_transactions.csv')
    
    # Make predictions
    results = predict_transactions(transactions)
    
    # Print results
    print("\nPrediction Results:")
    print(f"Number of transactions: {len(results['predictions'])}")
    print(f"Number of fraud predictions: {sum(results['predictions'])}")
    print(f"Average risk score: {results['risk_scores'].mean():.4f}")
    print(f"Reason: {results['reasons']}")

if __name__ == "__main__":
    main() 