const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    account_number: { type: String, required: true, unique: true },
    account_type: {
        type: String,
        required: true,
        enum: ['Savings', 'Checking', 'Credit']
    },
    balance: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive', 'Closed']
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema); 