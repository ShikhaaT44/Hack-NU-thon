from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class AccountType(str, Enum):
    SAVINGS = "Savings"
    CHECKING = "Checking"
    CREDIT = "Credit"

class AccountStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    CLOSED = "Closed"

class TransactionType(str, Enum):
    TRANSFER = "Transfer"
    WITHDRAWAL = "Withdrawal"
    DEPOSIT = "Deposit"
    PURCHASE = "Purchase"

class DeviceType(str, Enum):
    MOBILE = "Mobile"
    LAPTOP = "Laptop"
    TABLET = "Tablet"

class AlertType(str, Enum):
    FRAUD = "Fraud"
    SUSPICIOUS = "Suspicious"
    ANOMALY = "Anomaly"

class RecipientType(str, Enum):
    ADMIN = "Admin"
    USER = "User"

class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    mpin: int
    created_at: datetime = Field(default_factory=datetime.now)

class Account(BaseModel):
    user_id: str
    account_number: str
    account_type: AccountType
    balance: float
    currency: str = "USD"
    status: AccountStatus = AccountStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.now)

class Transaction(BaseModel):
    account_id: str
    transaction_type: TransactionType
    transaction_amount: float
    transaction_date: datetime = Field(default_factory=datetime.now)
    device_type: DeviceType
    ip_address: Optional[str] = None
    Latitude: float
    Longitude: float
    location: Optional[str] = None
    is_trusted_device: Optional[bool] = None
    known_location: Optional[bool] = None
    transaction_frequency: Optional[int] = None
    high_amount_deviation: Optional[bool] = None
    multiple_devices_used: Optional[bool] = None
    transaction_at_odd_hours: Optional[bool] = None
    new_device_flag: Optional[bool] = None
    ip_change_frequency: Optional[int] = None
    location_deviation: Optional[bool] = None

class FraudTransaction(BaseModel):
    transaction_id: str
    fraud_type: str
    detected_by: str
    confidence_score: float
    alert_time: datetime = Field(default_factory=datetime.now)
    flagged_features: Optional[str] = None
    comments: Optional[str] = None

class AnomalyLog(BaseModel):
    transaction_id: str
    anomaly_score: float
    is_anomalous: bool
    anomaly_features: Optional[str] = None
    detected_at: datetime = Field(default_factory=datetime.now)

class Alert(BaseModel):
    transaction_id: str
    alert_type: AlertType
    recipient: RecipientType
    alert_message: str
    is_resolved: bool = False
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now) 