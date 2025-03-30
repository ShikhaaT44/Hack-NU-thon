const mongoose = require('mongoose');

const fraudTransactionSchema = new mongoose.Schema({
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    fraud_type: { type: String, required: true },  // 'Behavioral', 'Location', or 'Both'
    detected_by: { type: String, required: true }, // 'Supervised', 'Anomaly', or 'Both'
    confidence_score: { type: Number, required: true },
    alert_time: { type: Date, default: Date.now },
    flagged_features: String,
    comments: String
});

module.exports = mongoose.model('FraudTransaction', fraudTransactionSchema); 