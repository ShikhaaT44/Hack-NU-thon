import React, { useState } from "react";
import { uploadCSV } from "../services/api";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [mlResults, setMlResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const alerts = [
    {
      id: "ALERT-2024-001",
      timestamp: "2:30 PM",
      type: "Suspicious Transaction",
      description: "Multiple high-value transactions from new device",
      severity: "High",
    },
    {
      id: "ALERT-2024-002",
      timestamp: "1:45 PM",
      type: "Location Anomaly",
      description: "Transaction from new location with high risk score",
      severity: "Medium",
    },
    {
      id: "ALERT-2024-003",
      timestamp: "12:15 PM",
      type: "Device Change",
      description: "Account accessed from multiple devices in short time",
      severity: "Medium",
    },
  ];

  const metrics = [
    {
      title: "Total Transactions",
      start: "1,234",
      end: "1,567",
      change: "+27%",
      trend: "up",
    },
    {
      title: "Fraud Detection Rate",
      start: "98.5%",
      end: "99.2%",
      change: "+0.7%",
      trend: "up",
    },
    {
      title: "Average Response Time",
      start: "2.3s",
      end: "1.8s",
      change: "-21.7%",
      trend: "down",
    },
    {
      title: "Active Alerts",
      start: "12",
      end: "8",
      change: "-33.3%",
      trend: "down",
    },
  ];

  const systemHealth = [
    {
      name: "Transaction Monitoring",
      status: "Active",
      uptime: "99.99%",
      lastCheck: "2 minutes ago",
    },
    {
      name: "ML Model Performance",
      status: "Active",
      accuracy: "99.2%",
      lastCheck: "5 minutes ago",
    },
    {
      name: "Database Health",
      status: "Active",
      connections: "245",
      lastCheck: "1 minute ago",
    },
    {
      name: "API Gateway",
      status: "Active",
      requests: "1.2k/min",
      lastCheck: "30 seconds ago",
    },
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a valid CSV file");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const results = await uploadCSV(selectedFile);
      setMlResults(results);
      setUploadStatus("success");
    } catch (err) {
      setError(err.message || "Failed to process file");
      setUploadStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    setMlResults(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-400">
          Fraud Detection Dashboard
        </h1>
        <div className="flex space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Recent Alerts
          </button>
        </div>
      </div>

      {/* CSV Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Import Transaction Data
          </h2>
          <p className="mt-1 text-sm text-gray-500">CSV Format Only</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleRemoveFile}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className={`px-4 py-1 text-sm text-white rounded-md whitespace-nowrap ${
                    isLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "Processing..." : "Upload & Process"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ML Results Section */}
      {mlResults && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Analysis Results
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Fraud Detection Status
                </p>
                <p className="text-sm text-gray-500">
                  Confidence Score:{" "}
                  {(mlResults.predictions.confidence_score * 100).toFixed(1)}%
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mlResults.predictions.fraud_detected
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {mlResults.predictions.fraud_detected
                  ? "Fraud Detected"
                  : "No Fraud Detected"}
              </span>
            </div>

            {mlResults.predictions.suspicious_transactions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Suspicious Transactions
                </h3>
                <div className="space-y-2">
                  {mlResults.predictions.suspicious_transactions.map(
                    (transaction, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              Transaction ID: {transaction.transaction_id}
                            </p>
                            <p className="text-sm text-gray-600">
                              Risk Score:{" "}
                              {(transaction.risk_score * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Reason: {transaction.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-700">{metric.title}</h3>
            <div className="mt-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-gray-500">Current</span>
                  <p className="text-2xl font-semibold mt-1">{metric.end}</p>
                </div>
                <div
                  className={`text-sm ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-500">{alert.timestamp}</span>
                <h3 className="text-lg font-semibold mt-1">{alert.id}</h3>
                <p className="text-gray-600 mt-1">{alert.type}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {alert.description}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                    alert.severity === "High"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {alert.severity} Priority
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* System Health Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">System Health</h2>
        <div className="space-y-4">
          {systemHealth.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.status === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last checked: {item.lastCheck}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {item.uptime ||
                    item.accuracy ||
                    item.connections ||
                    item.requests}
                </p>
                <p className="text-xs text-gray-500">
                  {item.uptime
                    ? "Uptime"
                    : item.accuracy
                    ? "Accuracy"
                    : item.connections
                    ? "Active Connections"
                    : "Requests/Min"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
