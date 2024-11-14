import React from "react";

const page = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Search for the users</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="User Name"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
              disabled
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="E-mail"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
              disabled
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white font-semibold rounded p-2 hover:bg-blue-700 transition duration-300"
            disabled
          >
            Search
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Order List</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Profile</th>
              <th className="py-2 px-4 border-b">User Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row */}
            <tr className="hover:bg-gray-50" style={{textAlign: "center"}}>
              <td className="py-2 px-4 border-b">12345</td>
              <td className="py-2 px-4 border-b">John Doe</td>
              <td className="py-2 px-4 border-b">Sample Product</td>

              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white font-semibold rounded p-2 mr-2 hover:bg-green-600 transition duration-300">
                  View orders
                </button>
                <button className="bg-green-500 text-white font-semibold rounded p-2 mr-2 hover:bg-green-600 transition duration-300">
                  Add
                </button>
                <button className="bg-red-500 text-white font-semibold rounded p-2 hover:bg-red-600 transition duration-300">
                  Delete
                </button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default page;
