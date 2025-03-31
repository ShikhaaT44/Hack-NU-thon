import pandas as pd
from fraud_detection import FraudDetectionModel

def main():
    # Load the dataset
    print("Loading dataset...")
    df = pd.read_csv('fraud_dataset_100k_70_30.csv')
    
    # Initialize and train the model
    print("Initializing model...")
    model = FraudDetectionModel()
    
    print("Training model...")
    results = model.train(df)
    
    # Print results
    print("\nTraining Results:")
    for metric, value in results.items():
        print(f"{metric}: {value}")
    
    # Save the trained model
    print("\nSaving model...")
    model.save_model('multi_agent_fraud_model.pkl')
    print("Model saved successfully!")

if __name__ == "__main__":
    main() 