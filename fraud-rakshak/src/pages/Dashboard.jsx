import React from "react";

const Dashboard = () => {
  const alerts = [
    { id: "07.0110", timestamp: "1:22:00", type: "Activity Log" },
    { id: "07.0033", timestamp: "1:02:00", type: "Activity Log" },
    { id: "07.0012", timestamp: "1:02:30", type: "Activity Log" },
  ];

  const metrics = [
    { title: "Aotpismet", start: "3.7.02", end: "5.1.81" },
    { title: "Aostk", start: "60.32", end: "34.718" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fraud Detection Dashboard</h1>
        <div className="flex space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Recent Alerts
          </button>
          <button className="text-gray-600 px-4 py-2 rounded-md">
            Recent alerts Log
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-4 rounded-lg shadow">
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
