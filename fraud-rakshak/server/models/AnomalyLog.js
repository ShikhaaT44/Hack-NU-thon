const mongoose = require('mongoose');

const anomalyLogSchema = new mongoose.Schema({
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    anomaly_score: { type: Number, required: true },
    is_anomalous: { type: Boolean, required: true },
    anomaly_features: String,
    detected_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnomalyLog', anomalyLogSchema); 