"use client";

import axios from "axios";
import React, {useEffect, useState} from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    fullname: "",
    email: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null); // State for toggling dropdown

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/order");
        const fullData = response.data.fulldata; // Use fulldata here
        console.log(response.data.fulldata);
        setData(fullData);
        setFilteredData(fullData); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete("/api/order", {data: {id}});
        setFilteredData((prev) => prev.filter((order) => order._id !== id));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((order) => {
      const matchesFullname = search.fullname
        ? order.fullname.toLowerCase().includes(search.fullname.toLowerCase())
        : true;

      return matchesFullname;
    });
    setFilteredData(filtered);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id); // Toggle the dropdown for the selected order
  };

  return (
    <>
      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">
          Search Ordered Product
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Full Name"
            value={search.fullname}
            onChange={(e) => setSearch({...search, fullname: e.target.value})}
            className="border border-gray-700 bg-gray-800 text-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-200 mb-4">Order List</h2>
        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : (
          <table className="min-w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="py-3 px-4 border-b border-gray-600">Order ID</th>
                <th className="py-3 px-4 border-b border-gray-600">
                  Customer Name
                </th>

                <th className="py-3 px-4 border-b border-gray-600">Address</th>
                <th className="py-3 px-4 border-b border-gray-600">Email</th>
                <th className="py-3 px-4 border-b border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredData.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-700 text-center transition-colors duration-200"
                  >
                    <td className="py-3 px-4 border-b border-gray-600">
                      {order._id}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-600">
                      {order.orderDetails[0].fullName}
                    </td>

                    <td className="py-3 px-4 border-b border-gray-600">
                      {order.orderDetails[0].address}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-600">
                      {order.orderDetails[0].email}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-600">
                      <button
                        onClick={() => toggleDropdown(order._id)}
                        className="bg-blue-500 text-white font-semibold rounded px-3 py-1 mr-2 hover:bg-blue-600 transition duration-300"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white font-semibold rounded px-3 py-1 hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Dropdown for order details */}
      {openDropdown && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-200 mb-6 border-b pb-2 border-gray-600">
              Order Details
            </h3>
            {filteredData
              .filter((order) => order._id === openDropdown)
              .map((order) => (
                <div key={order._id}>
                  <p className="font-semibold text-gray-300">
                    <span className="text-gray-400">Full Name:</span>{" "}
                    {order.orderDetails[0].fullName}
                  </p>
                  <p className="font-semibold text-gray-300">
                    <span className="text-gray-400">Address:</span>{" "}
                    {order.orderDetails[0].address}
                  </p>
                  <p className="font-semibold text-gray-300">
                    <span className="text-gray-400">Email:</span>{" "}
                    {order.orderDetails[0].email}
                  </p>
                  <p className="font-semibold text-gray-300">
                    <span className="text-gray-400">Product Name:</span>{" "}
                    {order.productname}
                  </p>

                  {order.orderDetails[0].orderData &&
                    order.orderDetails[0].orderData.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-400 mb-2">
                          Order Data:
                        </h4>
                        <ul className="space-y-2">
                          {order.orderDetails[0].orderData.map(
                            (dataItem, index) => (
                              <li key={index} className="ml-4 text-gray-300">
                                <p>
                                  <span className="text-gray-400">
                                    Item Name:
                                  </span>{" "}
                                  {dataItem.productname}
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    Quantity:
                                  </span>{" "}
                                  {dataItem.count}
                                </p>
                                <p>
                                  <span className="text-gray-400">Price:</span>{" "}
                                  ${dataItem.addprice}
                                </p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="mt-6 w-full bg-red-600 text-white font-semibold rounded-md py-2 hover:bg-red-700 transition-transform transform hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
