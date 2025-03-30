const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const FraudTransaction = require('./models/FraudTransaction');
const AnomalyLog = require('./models/AnomalyLog');
const Alert = require('./models/Alert');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Function to process CSV and insert into MongoDB
const processCSV = async (filePath, model) => {
    const records = [];
    const parser = fs
        .createReadStream(filePath)
        .pipe(parse({
            columns: true,
            skip_empty_lines: true
        }));

    for await (const record of parser) {
        // Convert string dates to Date objects
        if (record.date_of_birth) {
            record.date_of_birth = new Date(record.date_of_birth);
        }
        if (record.transaction_date) {
            record.transaction_date = new Date(record.transaction_date);
        }
        if (record.alert_time) {
            record.alert_time = new Date(record.alert_time);
        }
        if (record.detected_at) {
            record.detected_at = new Date(record.detected_at);
        }
        if (record.created_at) {
            record.created_at = new Date(record.created_at);
        }
        if (record.resolved_at) {
            record.resolved_at = new Date(record.resolved_at);
        }

        // Convert numeric fields
        if (record.mpin) record.mpin = parseInt(record.mpin);
        if (record.balance) record.balance = parseFloat(record.balance);
        if (record.transaction_amount) record.transaction_amount = parseFloat(record.transaction_amount);
        if (record.Latitude) record.Latitude = parseFloat(record.Latitude);
        if (record.Longitude) record.Longitude = parseFloat(record.Longitude);
        if (record.transaction_frequency) record.transaction_frequency = parseInt(record.transaction_frequency);
        if (record.ip_change_frequency) record.ip_change_frequency = parseInt(record.ip_change_frequency);
        if (record.confidence_score) record.confidence_score = parseFloat(record.confidence_score);
        if (record.anomaly_score) record.anomaly_score = parseFloat(record.anomaly_score);

        // Convert boolean fields
        const booleanFields = [
            'is_trusted_device', 'known_location', 'high_amount_deviation',
            'multiple_devices_used', 'transaction_at_odd_hours', 'new_device_flag',
            'location_deviation', 'is_anomalous', 'is_resolved'
        ];
        booleanFields.forEach(field => {
            if (record[field] !== undefined) {
                record[field] = record[field].toLowerCase() === 'true';
            }
        });

        records.push(record);

        // Process in batches of 1000 for better performance
        if (records.length >= 1000) {
            await model.insertMany(records, { ordered: false });
            records.length = 0;
        }
    }

    // Insert remaining records
    if (records.length > 0) {
        await model.insertMany(records, { ordered: false });
    }
};

// Endpoint to upload CSV files
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileName = req.file.originalname.toLowerCase();

        // Determine which model to use based on filename
        let model;
        if (fileName.includes('users')) {
            model = User;
        } else if (fileName.includes('accounts')) {
            model = Account;
        } else if (fileName.includes('transactions')) {
            model = Transaction;
        } else if (fileName.includes('fraud')) {
            model = FraudTransaction;
        } else if (fileName.includes('anomaly')) {
            model = AnomalyLog;
        } else if (fileName.includes('alerts')) {
            model = Alert;
        }

        if (!model) {
            return res.status(400).json({ message: 'Invalid file type. Please name your file according to the data type (users, accounts, transactions, fraud, anomaly, alerts)' });
        }

        // Process the CSV file
        await processCSV(filePath, model);

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.json({ message: 'File processed successfully' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 