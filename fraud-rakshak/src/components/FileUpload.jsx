import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const validateFileName = (filename) => {
    const validTypes = ['users', 'accounts', 'transactions', 'fraud', 'anomaly', 'alerts'];
    return validTypes.some(type => filename.toLowerCase().includes(type));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setMessage("Error: Please select a CSV file");
        setFile(null);
        return;
      }
      if (!validateFileName(selectedFile.name)) {
        setMessage("Error: File name must include one of: users, accounts, transactions, fraud, anomaly, alerts");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("Uploading...");

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! ${data.message}`);
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage(`Error: ${data.detail || 'Upload failed'}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error: Server connection failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Data File</h2>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-2">
            File name must include one of: users, accounts, transactions, fraud, anomaly, alerts
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={uploading}
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`w-full py-2 px-4 rounded text-white transition-colors
              ${uploading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {message && (
            <div
              className={`p-3 rounded ${
                message.includes("Error")
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
