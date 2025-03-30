import React, { useState } from "react";
import { uploadCSV } from "../services/api";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [mlResults, setMlResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const alerts = [
    { id: "07.0110", timestamp: "1:22:00", type: "Activity Log" },
    { id: "07.0033", timestamp: "1:02:00", type: "Activity Log" },
    { id: "07.0012", timestamp: "1:02:30", type: "Activity Log" },
  ];

  const metrics = [
    { title: "Aotpismet", start: "3.7.02", end: "5.1.81" },
    { title: "Aostk", start: "60.32", end: "34.718" },
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
      <div className="bg-white p-6 rounded-lg shadow-lg">
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

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{alert.timestamp}</span>
              <button className="text-gray-400 hover:text-gray-600">♡</button>
            </div>
            <h3 className="text-xl font-semibold mt-2">{alert.id}</h3>
            <p className="text-gray-600">{alert.type}</p>
          </div>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700">{metric.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-sm text-gray-500">Start</span>
                <p className="text-lg font-semibold">{metric.start}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">End</span>
                <p className="text-lg font-semibold">{metric.end}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Health Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">System Health</h2>
        <div className="space-y-4">
          {[
            "Uscolr Management",
            "Wlcen Health",
            "Ustoar Yeal",
            "System Management",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <h3 className="font-medium">{item}</h3>
                  <p className="text-sm text-gray-500">System Status</p>
                </div>
              </div>
              <span className="text-gray-500">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
