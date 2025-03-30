const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    transaction_type: {
        type: String,
        required: true,
        enum: ['Transfer', 'Withdrawal', 'Deposit', 'Purchase']
    },
    transaction_amount: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    device_type: {
        type: String,
        required: true,
        enum: ['Mobile', 'Laptop', 'Tablet']
    },
    ip_address: String,
    Latitude: { type: Number, required: true },
    Longitude: { type: Number, required: true },
    location: String,
    is_trusted_device: Boolean,
    known_location: Boolean,
    transaction_frequency: Number,
    high_amount_deviation: Boolean,
    multiple_devices_used: Boolean,
    transaction_at_odd_hours: Boolean,
    new_device_flag: Boolean,
    ip_change_frequency: Number,
    location_deviation: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema); 