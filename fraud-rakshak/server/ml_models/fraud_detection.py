import pandas as pd
import numpy as np
import warnings
import json
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, IsolationForest
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, precision_recall_curve
from sklearn.decomposition import PCA
from sklearn.neural_network import MLPRegressor
from sklearn.cluster import DBSCAN

warnings.filterwarnings("ignore")

class FraudDetectionModel:
    def __init__(self):
        self.rf = None
        self.xgb = None
        self.lgb = None
        self.gb = None
        self.iso = None
        self.pca = None
        self.autoencoder = None
        self.dbscan = None
        self.scaler = None
        self.label_encoders = {}
        self.threshold = None
        self.avg_transaction_amount = None

    def preprocess_data(self, df):
        try:
            # Clean column names
            df.columns = df.columns.str.strip().str.replace(r'\s+', ' ', regex=True).str.replace(r'[^\w\s]', '', regex=True).str.lower()
            fraud_column = 'is_fraud'

            # Process datetime and transaction burst/IP analysis
            if 'transaction_timestamp' in df.columns:
                df['transaction_timestamp'] = pd.to_datetime(df['transaction_timestamp'], errors='coerce')
                df.sort_values(by=['customer_id', 'transaction_timestamp'], inplace=True)

            # Frequent IP Address Detection
            if 'ip_address' in df.columns:
                ip_alert = df.groupby('customer_id')['ip_address'].nunique().reset_index()
                ip_alert.rename(columns={'ip_address': 'unique_ip_count'}, inplace=True)
                df = df.merge(ip_alert, on='customer_id', how='left')
                df['frequent_ip_alert'] = (df['unique_ip_count'] > 3).astype(int)
            else:
                df['frequent_ip_alert'] = 0

            # Flood Transactions Detection
            if 'transaction_timestamp' in df.columns:
                df['time_difference'] = df.groupby('customer_id')['transaction_timestamp'].diff().dt.total_seconds().fillna(99999)
                df['flood_transactions'] = (
                    df.groupby('customer_id')['time_difference']
                    .apply(lambda x: x.rolling(window=5, min_periods=1).apply(lambda y: (y < 60).sum(), raw=True))
                    .reset_index(level=0, drop=True)
                    .fillna(0).astype(int)
                )

            # Compute Average Transaction Amount per Customer
            if 'transaction_amount' in df.columns:
                df['avg_transaction_amount'] = df.groupby('customer_id')['transaction_amount'].transform('mean')
                self.avg_transaction_amount = df['avg_transaction_amount'].mean()
            else:
                df['avg_transaction_amount'] = 0
                self.avg_transaction_amount = 0

            # Encode categorical features
            categorical_cols = ['transaction_type', 'customer_gender', 'account_type',
                              'merchant_category', 'transaction_city', 'transaction_state', 'transaction_country']
            existing_categorical_cols = [col for col in categorical_cols if col in df.columns]
            for col in existing_categorical_cols:
                self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col])

            # Drop unnecessary non-numeric columns
            non_numerical_cols = df.select_dtypes(include=['object']).columns
            df.drop(non_numerical_cols, axis=1, inplace=True)

            # Normalize numeric values
            numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns
            if fraud_column in numerical_cols:
                numerical_cols = numerical_cols.drop(fraud_column)
            self.scaler = StandardScaler()
            df[numerical_cols] = self.scaler.fit_transform(df[numerical_cols])

            if 'transaction_timestamp' in df.columns:
                df = df.drop(columns=['transaction_timestamp'])

            return df
        except Exception as e:
            raise Exception(f"Error in preprocessing data: {str(e)}")

    def train(self, df):
        try:
            df = self.preprocess_data(df)
            fraud_column = 'is_fraud'

            if fraud_column not in df.columns:
                raise ValueError(f"Required column '{fraud_column}' not found in the dataset")

            # Train/Test Split
            X = df.drop([fraud_column], axis=1)
            y = df[fraud_column]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

            # Pipeline 1: RandomForest
            self.rf = RandomForestClassifier(n_estimators=300, max_depth=20, class_weight='balanced_subsample', random_state=42)
            self.rf.fit(X_train, y_train)
            rf_score = self.rf.predict_proba(X_test)[:, 1]

            # Pipeline 2: Voting - XGBoost + LGBM + GradientBoost
            self.xgb = XGBClassifier(scale_pos_weight=2, use_label_encoder=False, eval_metric='logloss', random_state=42)
            self.lgb = LGBMClassifier(class_weight='balanced', random_state=42)
            self.gb = GradientBoostingClassifier()

            self.xgb.fit(X_train, y_train)
            self.lgb.fit(X_train, y_train)
            self.gb.fit(X_train, y_train)
            vote_score = (self.xgb.predict_proba(X_test)[:, 1] + 
                         self.lgb.predict_proba(X_test)[:, 1] + 
                         self.gb.predict_proba(X_test)[:, 1]) / 3

            # Pipeline 3: Unsupervised (IsolationForest + Autoencoder + DBSCAN)
            self.iso = IsolationForest(contamination=0.5, random_state=42).fit(X_train)
            iso_scores = -self.iso.decision_function(X_test)

            self.pca = PCA(n_components=min(10, X.shape[1]))  # Ensure n_components doesn't exceed features
            X_pca = self.pca.fit_transform(X)
            self.autoencoder = MLPRegressor(hidden_layer_sizes=(64, 32, 64), max_iter=300, random_state=42)
            self.autoencoder.fit(X_pca[:len(X_train)], X_pca[:len(X_train)])
            recon = self.autoencoder.predict(X_pca[len(X_train):])
            recon_error = np.mean((X_pca[len(X_train):] - recon) ** 2, axis=1)

            self.dbscan = DBSCAN(eps=2, min_samples=10)
            dbscan_labels = self.dbscan.fit_predict(X_test)
            dbscan_score = np.array([1 if label == -1 else 0 for label in dbscan_labels])

            unsupervised_risk = (iso_scores + recon_error + dbscan_score) / 3
            unsupervised_risk = (unsupervised_risk - np.min(unsupervised_risk)) / (np.max(unsupervised_risk) - np.min(unsupervised_risk))

            # Final Ensemble Score
            final_risk = (rf_score + vote_score + unsupervised_risk) / 3

            # Find Optimal Threshold
            self.threshold = self.find_best_threshold(y_test, final_risk)

            # Evaluate
            binary_preds = (final_risk > self.threshold).astype(int)
            results = {
                "Accuracy": accuracy_score(y_test, binary_preds),
                "Precision": precision_score(y_test, binary_preds),
                "Recall": recall_score(y_test, binary_preds),
                "F1-Score": f1_score(y_test, binary_preds),
                "ROC-AUC": roc_auc_score(y_test, final_risk),
                "Confusion Matrix": confusion_matrix(y_test, binary_preds).tolist()
            }

            return results
        except Exception as e:
            raise Exception(f"Error in training model: {str(e)}")

    def predict(self, df):
        try:
            df = self.preprocess_data(df)
            X = df.drop(['is_fraud'], axis=1) if 'is_fraud' in df.columns else df

            # Get predictions from all models
            rf_score = self.rf.predict_proba(X)[:, 1]
            vote_score = (self.xgb.predict_proba(X)[:, 1] + 
                         self.lgb.predict_proba(X)[:, 1] + 
                         self.gb.predict_proba(X)[:, 1]) / 3

            # Unsupervised predictions
            iso_scores = -self.iso.decision_function(X)
            X_pca = self.pca.transform(X)
            recon = self.autoencoder.predict(X_pca)
            recon_error = np.mean((X_pca - recon) ** 2, axis=1)
            dbscan_labels = self.dbscan.predict(X)
            dbscan_score = np.array([1 if label == -1 else 0 for label in dbscan_labels])

            unsupervised_risk = (iso_scores + recon_error + dbscan_score) / 3
            unsupervised_risk = (unsupervised_risk - np.min(unsupervised_risk)) / (np.max(unsupervised_risk) - np.min(unsupervised_risk))

            # Final ensemble score
            final_risk = (rf_score + vote_score + unsupervised_risk) / 3
            binary_preds = (final_risk > self.threshold).astype(int)

            # Generate reasons
            reasons = []
            if rf_score.mean() > 0.6:
                reasons.append("Detected by RandomForest model")
            if vote_score.mean() > 0.6:
                reasons.append("Consensus from multiple models")
            if unsupervised_risk.mean() > 0.6:
                reasons.append("Unsupervised anomaly detected")
            if 'frequent_ip_alert' in X.columns and X['frequent_ip_alert'].any():
                reasons.append("Multiple IPs used")
            if 'flood_transactions' in X.columns and X['flood_transactions'].max() >= 3:
                reasons.append("Rapid transaction burst")
            if 'transaction_amount' in X.columns and X['transaction_amount'].max() > 2 * self.avg_transaction_amount:
                reasons.append("Unusually large transaction amount")
            if 'unique_ip_count' in X.columns and X['unique_ip_count'].max() > 3:
                reasons.append("Suspicious IP Address activity detected")

            reason = " | ".join(reasons) if reasons else "No obvious anomaly detected"

            return {
                "predictions": binary_preds,
                "risk_scores": final_risk,
                "reasons": reason
            }
        except Exception as e:
            raise Exception(f"Error in making predictions: {str(e)}")

    @staticmethod
    def find_best_threshold(y_true, probs):
        try:
            precisions, recalls, thresholds = precision_recall_curve(y_true, probs)
            f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-10)
            best_index = np.argmax(f1_scores)
            return thresholds[best_index]
        except Exception as e:
            raise Exception(f"Error in finding best threshold: {str(e)}")

    def save_model(self, path):
        try:
            model_data = {
                "rf": self.rf,
                "xgb": self.xgb,
                "lgb": self.lgb,
                "gb": self.gb,
                "iso": self.iso,
                "pca": self.pca,
                "autoencoder": self.autoencoder,
                "dbscan": self.dbscan,
                "scaler": self.scaler,
                "label_encoders": self.label_encoders,
                "threshold": self.threshold,
                "avg_transaction_amount": self.avg_transaction_amount
            }
            with open(path, "wb") as f:
                pickle.dump(model_data, f)
        except Exception as e:
            raise Exception(f"Error in saving model: {str(e)}")

    @classmethod
    def load_model(cls, path):
        try:
            with open(path, "rb") as f:
                model_data = pickle.load(f)
            
            model = cls()
            model.rf = model_data["rf"]
            model.xgb = model_data["xgb"]
            model.lgb = model_data["lgb"]
            model.gb = model_data["gb"]
            model.iso = model_data["iso"]
            model.pca = model_data["pca"]
            model.autoencoder = model_data["autoencoder"]
            model.dbscan = model_data["dbscan"]
            model.scaler = model_data["scaler"]
            model.label_encoders = model_data["label_encoders"]
            model.threshold = model_data["threshold"]
            model.avg_transaction_amount = model_data["avg_transaction_amount"]
            
            return model
        except Exception as e:
            raise Exception(f"Error in loading model: {str(e)}") 