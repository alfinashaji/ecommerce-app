"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import OrdersChart from "@/app/component/common/chart/Orderchart";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data.data);
      } catch (error) {
        setError("Failed to fetch products.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        setError("Failed to fetch categories.");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order");
        setOrders(response.data.data);
      } catch (error) {
        setError("Failed to fetch orders.");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories(), fetchOrders()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300">
      <header className="bg-gray-800 shadow-lg p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
      </header>

      <div className="flex flex-1 p-8 flex-col space-y-8">
        <h2 className="text-4xl font-semibold text-white mb-4">Overview</h2>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-white">Total Products</h3>
            <span className="text-5xl font-bold text-white">
              {products.length}
            </span>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-white">
              Total Categories
            </h3>
            <span className="text-5xl font-bold text-white">
              {categories.length}
            </span>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-white">Total Orders</h3>
            <span className="text-5xl font-bold text-white">
              {orders.length}
            </span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Product Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-2xl font-semibold text-white mb-4">Products</h3>
            <table className="w-full text-left text-gray-300 border-separate border-spacing-0.5">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 border-b border-gray-600">Name</th>
                  <th className="p-3 border-b border-gray-600">Category</th>
                  <th className="p-3 border-b border-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-700 transition-all duration-200"
                  >
                    <td className="p-3 border-b border-gray-600">
                      {product.productname}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {product.category}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      ${product.addprice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentProducts.length < itemsPerPage}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <OrdersChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
