const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    alert_type: {
        type: String,
        required: true,
        enum: ['Fraud', 'Suspicious', 'Anomaly']
    },
    recipient: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
    },
    alert_message: { type: String, required: true },
    is_resolved: { type: Boolean, default: false },
    resolved_at: Date,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema); 