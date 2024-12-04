"use client";
export const dynamic = "force-dynamic";

import React, {useContext, useEffect, useState} from "react";
import {ecomContext} from "../layout";
import axios from "axios";
import {useSession} from "next-auth/react";

const Page = () => {
  const {cart, setCart} = useContext(ecomContext);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    address: "",
    orderData: [],
  });

  const {data: session, status} = useSession();
  console.log(session);

  useEffect(() => {
    console.log("Session data:", session);

    if (cart && cart.data && cart.data.length > 0) {
      const updatedCart = cart.data.map((item) => ({
        ...item,
        count: 1,
      }));
      setLocalCart(updatedCart);
      setFormValues((prev) => ({...prev, orderData: updatedCart}));
    }

    if (session?.user?.email) {
      setFormValues((prev) => ({...prev, email: session.user.email}));
      console.log("Email set from session:", session.user.email);
    }
  }, [cart, session]);

  const handleCountChange = (index, newValue) => {
    const updatedCart = [...localCart];
    updatedCart[index].count = newValue;
    setLocalCart(updatedCart);
    console.log(updatedCart);
  };

  const handleRemoveItem = (index, id) => {
    const updatedCart = localCart.filter((_, i) => i !== index);
    setLocalCart(updatedCart);

    setCart((prev) => ({
      ...prev,
      data: prev.data.filter((item) => item._id !== id),
    }));

    const itemid =
      localStorage.getItem("cart") &&
      localStorage.getItem("cart") !== null &&
      JSON.parse(localStorage.getItem("cart"));
    if (itemid.id.includes(id)) {
      const index = itemid.id.indexOf(id);
      if (index > -1) {
        itemid.id.splice(index, 1);
      }
      localStorage.getItem("cart") !== null &&
        localStorage.getItem("cart") &&
        localStorage.setItem("cart", JSON.stringify(itemid));
    }
  };

  const calculateGrandTotal = () => {
    return localCart.reduce((acc, item) => acc + item.count * item.addprice, 0);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/order", {
        orderDetails: [formValues, localCart],
      });
      console.log("Order Successful:", response.data);
      setShowModal(true); // Show modal on successful order
    } catch (error) {
      console.error("Order error:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex justify-between p-10 bg-gray-100 min-h-screen relative">
      {/* Modal for Success Message */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3 relative"
            onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside it
          >
            <h3 className="text-xl font-semibold text-green-600 text-center">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-700 text-center mt-2">
              You placed the order Thanks for Choosing Us!
            </p>
            <button
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Left Side: Order Form */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 border-b-2 pb-4 border-gray-200">
          Place Your Order
        </h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={formValues.fullName}
              onChange={handleInputChange}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-gray-400"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-gray-400"
              placeholder="Enter your Email"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-gray-400"
              placeholder="Enter your delivery address"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-shadow transform hover:scale-105 shadow-lg"
          >
            Place Order
          </button>
        </form>
      </div>

      {/* Right Side: Shopping Cart */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-xl ml-6 p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b-2 pb-4 border-gray-200">
          Shopping Cart
        </h2>
        {localCart.length > 0 ? (
          <div className="space-y-6">
            {localCart.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                style={{gap: "20px"}}
              >
                <div className="w-28 h-28">
                  <img
                    src={item.imageurl}
                    alt={item.productname}
                    className="w-full h-full object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h4 className="text-lg font-medium text-gray-800">
                    {item.productname}
                  </h4>
                  <p className="text-lg text-gray-500">${item.addprice}</p>
                  <div className="flex items-center mt-2">
                    <input
                      type="number"
                      min="1"
                      value={item.count}
                      onChange={(e) =>
                        handleCountChange(index, parseInt(e.target.value))
                      }
                      className="w-16 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    ${item.addprice * item.count}
                  </p>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-red-600 transition-transform transform hover:scale-105"
                    onClick={() => handleRemoveItem(index, item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-500 mt-10">
            Your cart is empty
          </div>
        )}
        <p className="text-lg font-bold text-gray-800 mt-8 border-t-2 pt-4 border-gray-200">
          Grand Total:{" "}
          <span className="text-gray-600">${calculateGrandTotal()}</span>
        </p>
      </div>
    </div>
  );
};

export default Page;
