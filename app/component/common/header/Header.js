"use client";

import {memo, useContext, useEffect, useRef, useState} from "react";
import {ecomContext} from "@/app/(client)/layout";
import {ShoppingCartIcon} from "@heroicons/react/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import axios from "axios"; // Ensure axios is imported for signup requests
import Link from "next/link";

const Header = ({isCartVisible, setCartVisible}) => {
  const [isSignup, setSignup] = useState(false);
  const {cart, setCart} = useContext(ecomContext);
  const [isSignin, setSignin] = useState(false);
  const cartRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localCart, setLocalCart] = useState([]);

  const [error, setError] = useState(null);
  // const cartRef = useRef(null);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  console.log(isCartVisible);
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const {data: session, status} = useSession();
  const router = useRouter();

  const loginSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const handleSignupToggle = () => {
    setSignup(!isSignup);
  };

  const handleSigninToggle = () => {
    setSignin(!isSignin);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setSignupData({...signupData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", signupData);
      console.log("Signup Successful:", response.data);
      setSignup(false); // Closing signup
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to sign up. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (status === "authenticated") {
      console.log("User is authenticated. Proceeding to checkout...");
      window.location.href = "/checkout";
    } else {
      alert("Please sign in to proceed to checkout.");
    }
  };

  const signoutHandler = () => {
    signOut({redirect: false}).then(() => {
      router.push("/");
    });
  };

  // Cart toggle handler
  const handleCartToggle = () => {
    setCartVisible((prev) => !prev);
    console.log(isCartVisible);
  };

  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      console.log(isCartVisible);
      setCartVisible(false);
      console.log(isCartVisible);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // return () => {
    //   document.removeEventListener("mousedown", () => setCartVisible(true));
    // };
  }, [isCartVisible]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/product");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setFilteredCategories(
        categories
          .filter((category) =>
            category.productname.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 7)
      );
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredCategories([]);
    }
  };

  const handleInputClick = () => {
    if (filteredCategories.length > 0) {
      setShowDropdown(true);
    }
  };

  const removeFromCart = (id) => {
    console.log("Removing item with id:", id);

    // Remove from local cart state
    const updatedCart = localCart.filter((item) => item._id !== id);
    setLocalCart(updatedCart);
    console.log("Updated Cart:", updatedCart);

    // Update cart context
    setCart((prev) => ({
      ...prev,
      data: prev.data.filter((item) => item._id !== id),
    }));

    // Update localStorage
    const cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData && cartData.id) {
      const index = cartData.id.indexOf(id);
      if (index > -1) {
        cartData.id.splice(index, 1); // Remove the ID
        localStorage.setItem("cart", JSON.stringify(cartData)); // Update localStorage
      }
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart && storedCart.id) {
      setLocalCart(storedCart.id);
    }
  }, []);

  console.log(categories);

  return (
    <div>
      <header className="w-full h-16 flex items-center justify-between px-6 shadow-lg bg-white sticky top-0 z-50">
        {/* Brand Name */}
        <div className="text-gray-800 text-2xl font-bold cursor-pointer transition duration-300 hover:text-blue-500">
          Glamora
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-gray-700 text-sm">
            {/* Categories */}
            <li className="relative">
              <input
                type="text"
                placeholder="Search for products"
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full p-2 pl-4 pr-8 text-gray-800 bg-white border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 search-input"
              />
              {showDropdown && (
                <div className="absolute left-0 w-[300px] mt-1 bg-white border rounded-md shadow-lg overflow-hidden pe-8">
                  <button
                    onClick={handleCloseDropdown}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    ✕
                  </button>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <Link
                        href={`product/${category._id}`}
                        className="group"
                        key={category._id}
                      >
                        <div className="p-3 cursor-pointer transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2">
                          <span
                            className="font-medium"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              style={{
                                width: "25px",
                                // height: "10%",
                              }}
                              src={category.imageurl}
                              alt={category.productname}
                            />
                            <span className="ms-3">{category.productname}</span>
                          </span>
                        </div>
                        <div className="border-t border-gray-100 mx-3"></div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </li>

            {/* Authentication Links */}
            {status !== "authenticated" ? (
              <>
                <li className="hover:text-red-600 cursor-pointer transition duration-300">
                  <button onClick={handleSignupToggle}>Sign Up</button>
                </li>
                <li className="hover:text-red-600 cursor-pointer transition duration-300">
                  <button onClick={handleSigninToggle}>Sign In</button>
                </li>
              </>
            ) : (
              <li className="hover:text-red-600 cursor-pointer transition duration-300">
                <button onClick={signoutHandler}>Sign Out</button>
              </li>
            )}

            {/* Cart Icon */}
            <li className="relative cursor-pointer transition duration-300">
              <button
                onClick={handleCartToggle} // Toggle cart visibility
                className="flex items-center relative"
              >
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                {cart && cart?.data?.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                    {cart?.data?.length}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Conditionally render the signup modal */}
      {isSignup && status !== "authenticated" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full transform transition-all duration-300">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Sign Up
            </h2>
            {error && (
              <div className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Name"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="E-mail"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              />
              <button className="w-full bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-red-600 transition duration-300">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Conditionally render the signin modal */}
      {isSignin && status !== "authenticated" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full transition-all duration-300">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Sign In
            </h2>
            <form onSubmit={loginSubmit}>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
              />
              <button className="w-full bg-gradient-to-r bg-blue-600 text-white font-semibold rounded-lg py-3 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartVisible === true && (
        <div
          ref={cartRef}
          className="fixed right-3 top-[70px] bg-white bg-opacity-95 w-80 shadow-2xl rounded-lg p-5 z-50 transition-transform transform duration-300 ease-in-out border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-4 border-b pb-3 text-gray-800">
            Your Cart
          </h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto space-y-4">
              {cart &&
                cart.data.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 border-b border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    <img
                      src={item.imageurl}
                      alt={item.productname}
                      className="w-16 h-16 object-cover rounded-md shadow-md"
                    />
                    <div className="flex-grow ml-3">
                      <span className="block text-gray-800 font-medium text-sm">
                        {item.productname}
                      </span>
                      <span className="text-gray-600 text-xs">
                        Price: ${item.addprice}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)} // Correctly pass the _id here
                      className="text-red-500 hover:text-red-700 transition-colors duration-300 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
            </ul>
          )}
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white rounded-lg mt-5 p-2 w-full font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
