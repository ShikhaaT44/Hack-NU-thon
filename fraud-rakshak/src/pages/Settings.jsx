import React, { useState } from "react";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dashboardNotifications: true,
    criticalAlertsOnly: false,
  });

  const [thresholds, setThresholds] = useState({
    transactionAmount: 10000,
    suspiciousLoginAttempts: 3,
    highRiskCountries: ["US", "CN", "RU"],
  });

  const [apiKeys, setApiKeys] = useState({
    currentKey: "sk_test_•••••••••••••••••",
    environment: "production",
  });

  const handleNotificationChange = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleThresholdChange = (e) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save settings to backend
    console.log("Settings saved:", {
      notificationSettings,
      thresholds,
      apiKeys,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-400">Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Email Alerts</h3>
              <p className="text-sm text-gray-500">
                Receive fraud alerts via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailAlerts}
                onChange={() => handleNotificationChange("emailAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">SMS Alerts</h3>
              <p className="text-sm text-gray-500">
                Receive fraud alerts via SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsAlerts}
                onChange={() => handleNotificationChange("smsAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Dashboard Notifications
              </h3>
              <p className="text-sm text-gray-500">Show alerts in dashboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.dashboardNotifications}
                onChange={() =>
                  handleNotificationChange("dashboardNotifications")
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Critical Alerts Only
              </h3>
              <p className="text-sm text-gray-500">
                Only receive high-priority alerts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.criticalAlertsOnly}
                onChange={() => handleNotificationChange("criticalAlertsOnly")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Alert Thresholds
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Suspicious Transaction Amount (₹)
            </label>
            <input
              type="number"
              name="transactionAmount"
              value={thresholds.transactionAmount}
              onChange={handleThresholdChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Transactions above this amount will trigger alerts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Failed Login Attempts
            </label>
            <input
              type="number"
              name="suspiciousLoginAttempts"
              value={thresholds.suspiciousLoginAttempts}
              onChange={handleThresholdChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of failed attempts before account lockout
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          API Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={apiKeys.currentKey}
                readOnly
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 sm:text-sm"
              />
              <button className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 text-sm">
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Environment
            </label>
            <select
              value={apiKeys.environment}
              onChange={(e) =>
                setApiKeys((prev) => ({
                  ...prev,
                  environment: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
