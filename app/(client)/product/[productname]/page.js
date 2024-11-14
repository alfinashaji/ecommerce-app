"use client";

import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {FaStar} from "react-icons/fa";
import {FaUserCircle} from "react-icons/fa"; // For user avatar
import {ShoppingCartIcon} from "@heroicons/react/outline";
import {ecomContext} from "../../layout";
import {useSession} from "next-auth/react";

const Page = ({params}) => {
  const {cart, setCart, setGetData, isCartVisible, setCartVisible} =
    useContext(ecomContext);
  // const [cart, setCart] = useState([]);
  // const [isCartVisible, setCartVisible] = useState(false);
  const cartRef = useRef(null);
  const [productData, setProductData] = useState({});
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const {productname} = params;
  const {data: session, status} = useSession();

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(storedCart);

    if (storedCart !== null || !storedCart.id.includes(product.id)) {
      localStorage.setItem(
        "cart",
        JSON.stringify({id: [...storedCart?.id, ...[product._id]]})
      );
      setGetData((prev) => !prev);
    }
    setCartVisible(!isCartVisible);
  };

  // Remove product ID from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((id) => id !== productId);
    setCart(updatedCart);
  };

  const addComment = async () => {
    // if (newComment.trim() === "") return;

    try {
      const response = await axios.post("/api/comment", {
        productId: productname,
        userId: session?.user?.email, // Use session user ID
        comment: newComment,
      });

      console.log(productname, session?.user?.email);

      setComments((prevComments) => [...prevComments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  console.log();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productResponse = await axios.get("/api/singleproduct", {
          params: {id: productname},
        });
        setProductData(productResponse.data.data);

        // Fetch comments for the product
        const commentsResponse = await axios.get("/api/comment", {
          params: {productId: productname},
        });

        // Set comments if response is valid
        if (commentsResponse.data.comments) {
          setComments(commentsResponse.data.comments);
        }
      } catch (error) {
        console.error("Error fetching product or comments:", error);
      }
    };

    fetchProductData();
  }, [productname]);

  return (
    <>
      <div className="flex flex-col items-center p-6 space-y-6 bg-gray-50 min-h-screen">
        <div
          className="max-w-5xl w-full flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:shadow-2xl"
          style={{height: "470px"}}
        >
          {/* Image Section */}
          <div className="md:w-1/2 overflow-hidden relative">
            <img
              src={productData.imageurl}
              alt={productData.productname}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Product Details Section */}
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
                {productData.productname}
              </h2>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <FaStar key={index} className="w-5 h-5" />
                    ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">(120 Reviews)</p>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed text-base">
                {productData.description || "No description available."}
              </p>
              <p className="text-5xl font-semibold text-gray-700 mb-6">
                ₹ {productData.addprice}
              </p>
              <p className="text-lg text-green-600 font-medium mb-6">
                Special Offer: Get extra 10% off on your first order!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => addToCart(productData)}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl py-2 shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-300"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="w-full max-w-5xl mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Comments
          </h3>

          {/* Comment Input Box */}
          <div className="flex items-start space-x-4 mb-6">
            <FaUserCircle className="text-gray-400 w-10 h-10" />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write a comment..."
              rows={4}
            />
            <button
              onClick={addComment}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Post
            </button>
          </div>

          {/* Display Comments */}
          <div>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start space-x-4 mb-4"
              >
                <FaUserCircle className="text-gray-400 w-10 h-10" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {comment.user || "Unknown User"}
                  </p>
                  <p className="text-gray-600">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
