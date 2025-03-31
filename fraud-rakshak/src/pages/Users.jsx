import React from "react";

const Users = () => {
  const transactions = [
    {
      transactionId: "TXN-2024-001",
      accountNo: "ACC-9876543210",
      amount: 25000.0,
      type: "debit",
      dateTime: "2024-03-30 14:30:00",
      accountType: "Savings",
      status: "Healthy",
      merchant: "Amazon India",
      location: "Mumbai, India",
    },
    {
      transactionId: "TXN-2024-002",
      accountNo: "ACC-9876543210",
      amount: 150000.0,
      type: "credit",
      dateTime: "2024-03-30 15:45:00",
      accountType: "Savings",
      status: "Alert",
      merchant: "Salary Credit",
      location: "Bangalore, India",
    },
    {
      transactionId: "TXN-2024-003",
      accountNo: "ACC-9876543211",
      amount: 5000.0,
      type: "debit",
      dateTime: "2024-03-30 16:20:00",
      accountType: "Fixed Deposit",
      status: "Urgent action required",
      merchant: "International Transfer",
      location: "Singapore",
    },
    {
      transactionId: "TXN-2024-004",
      accountNo: "ACC-9876543212",
      amount: 35000.0,
      type: "credit",
      dateTime: "2024-03-30 17:10:00",
      accountType: "Loan",
      status: "Healthy",
      merchant: "Loan Disbursement",
      location: "Delhi, India",
    },
    {
      transactionId: "TXN-2024-005",
      accountNo: "ACC-9876543213",
      amount: 18000.0,
      type: "debit",
      dateTime: "2024-03-30 18:25:00",
      accountType: "Savings",
      status: "Alert",
      merchant: "Swiggy",
      location: "Chennai, India",
    },
    {
      transactionId: "TXN-2024-006",
      accountNo: "ACC-9876543214",
      amount: 75000.0,
      type: "debit",
      dateTime: "2024-03-30 19:15:00",
      accountType: "Savings",
      status: "Healthy",
      merchant: "Property Payment",
      location: "Hyderabad, India",
    },
    {
      transactionId: "TXN-2024-007",
      accountNo: "ACC-9876543215",
      amount: 12000.0,
      type: "credit",
      dateTime: "2024-03-30 20:00:00",
      accountType: "Savings",
      status: "Healthy",
      merchant: "Interest Credit",
      location: "Kolkata, India",
    },
    {
      transactionId: "TXN-2024-008",
      accountNo: "ACC-9876543216",
      amount: 45000.0,
      type: "debit",
      dateTime: "2024-03-30 21:30:00",
      accountType: "Savings",
      status: "Urgent action required",
      merchant: "Cryptocurrency Exchange",
      location: "Dubai, UAE",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Healthy":
        return "text-green-600 bg-green-50";
      case "Alert":
        return "text-yellow-600 bg-yellow-50";
      case "Urgent action required":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatAmount = (amount, type) => {
    return `${type === "debit" ? "-" : "+"}₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-indigo-400">
          Transaction Details
        </h1>
        <div className="flex space-x-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Export Data
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow mx-6 mb-6 overflow-hidden">
        <div className="h-full overflow-auto custom-scrollbar">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Transaction ID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Account No
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Amount
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Date & Time
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Account Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Merchant
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Location
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[6%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {transaction.transactionId}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900 truncate">
                      {transaction.accountNo}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div
                      className={`text-sm font-medium truncate ${
                        transaction.type === "debit"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900 truncate">
                      {formatDateTime(transaction.dateTime)}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900 truncate">
                      {transaction.accountType}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900 truncate">
                      {transaction.merchant}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm text-gray-900 truncate">
                      {transaction.location}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-normal break-words ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {transaction.status !== "Healthy" && (
                      <button className="bg-indigo-600 text-white px-2 py-0.5 rounded text-xs font-medium hover:bg-indigo-700">
                        Action
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f1f1f1;
        }

        /* Hide page scrollbar */
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Users;
