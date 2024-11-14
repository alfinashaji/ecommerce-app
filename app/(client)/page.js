"use client";

import {useEffect, useState, useRef, useContext} from "react";
import Link from "next/link";
import axios from "axios";
import {ecomContext} from "./layout";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ReactPaginate from "react-paginate";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import {GridLoader, RingLoader} from "react-spinners";

export default function Home() {
  const {cart, setCart, setGetData, isCartVisible, setCartVisible} =
    useContext(ecomContext);
  const [productData, setProductData] = useState([]);
  const [cartDatas, setCartdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const cartRef = useRef(null);
  const {data: session, status} = useSession();
  const [pageNumber, setPageNumber] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  let [color, setColor] = useState("#ffffff");

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const handlePageChange = (selectedPage) => {
    setPageNumber(selectedPage.selected);
  };
  // const router = useRouter();

  if (localStorage.getItem("cart") === null) {
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify({id: []}));
    }, []);
  }
  // Fetch products and categories data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProductData(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      }
    };

    const fetchTrending = async () => {
      try {
        const response = await axios.get("/api/trending");
        setTrendingProducts(response.data.data); // Set trending products here
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrending();
    fetchProducts();
    fetchCategories();
  }, []);

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

  const handleCheckout = () => {
    if (status === "authenticated") {
      console.log("User is authenticated. Proceeding to checkout...");
      window.location.href = "/checkout";
    } else {
      alert("Please sign in to proceed to checkout.");
    }
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

  if (loading) {
    return (
      <div className="text-center text-lg">
        <RingLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  const carouselItems = [
    {
      src: "https://marketplace.canva.com/EAFWt8Wq208/1/0/1600w/canva-grey-minimalist-special-offer-banner-landscape-tVz4E4KVLgk.jpg",
      alt: "Banner 2",
      // title: "Shop the Latest Trends",
      // description: "Find your style with our new arrivals!",
    },
    {
      src: "https://marketplace.canva.com/EAFw2F62lZw/1/0/1600w/canva-simple-modern-photo-collage-autumn-fashion-sale-banner-hZQHBJfu4c4.jpg",
      alt: "Banner 2",
      // title: "Shop the Latest Trends",
      // description: "Find your style with our new arrivals!",
    },
    {
      src: "https://marketplace.canva.com/EAF8MON676w/1/0/1600w/canva-Byo9bdJo8LM.jpg",
      alt: "Banner 3",
      // title: "Shop the Latest Trends",
      // description: "Find your style with our new arrivals!",
    },

    // Add more items as needed
  ];

  const latestProducts = productData
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest date
    .slice(0, 5); // Limit to the top 5 latest products

  return (
    <div className="bg-gray-100 flex">
      <div className="flex-grow">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={900}
          className="w-full"
        >
          {carouselItems.map((item, index) => (
            <div key={index} className="relative w-full h-[400px]">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-0 flex items-center justify-center">
                <div className="text-center text-white z-10">
                  {/* <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
                  <p className="mt-2 text-lg">{item.description}</p> */}
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="ps-20 pe-20 bg-gray-50 px-5 py-5">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 mt-3">
            <span className="relative">New Arrivals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {latestProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col"
              >
                <img
                  src={product.imageurl}
                  alt={product.productname}
                  className="w-full h-60 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                />
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <Link href={`product/${product._id}`} className="group">
                    <h3 className="font-semibold text-lg text-gray-800 transition duration-300 group-hover:text-blue-600">
                      {product.productname}
                    </h3>
                  </Link>
                  <p className="font-semibold text-xl text-gray-900 mt-2">
                    ₹{product.addprice}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-xl py-2 shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Tabs className="mt-8 bg-gradient-to-r from-blue-50 via-gray-50 to-blue-50 shadow-xl rounded-3xl overflow-hidden px-16 py-8">
          <TabList className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className="px-6 py-3 text-gray-800 font-medium border-b-2 border-transparent cursor-pointer transition duration-300 hover:border-blue-400 hover:text-blue-600 focus:outline-none"
                selectedClassName="border-blue-600 text-blue-700 bg-blue-100 shadow-md rounded-t-xl"
              >
                {category.categoriename}
              </Tab>
            ))}
          </TabList>

          {categories.map((category) => {
            const filteredProducts = productData.filter(
              (product) => product.category === category.categoriename
            );

            const productsPerPage = 5;
            const offset = pageNumber * productsPerPage;
            const currentProducts = filteredProducts.slice(
              offset,
              offset + productsPerPage
            );

            return (
              <TabPanel key={category.id}>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="border border-gray-100 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                      >
                        <img
                          src={product.imageurl}
                          alt={product.productname}
                          className="w-full h-60 object-cover transition-transform transform hover:scale-105 duration-300 rounded-t-xl"
                        />
                        <div className="p-6">
                          <Link
                            href={`product/${product._id}`}
                            className="group"
                          >
                            <h3 className="font-semibold text-lg text-gray-900 transition duration-300 group-hover:text-blue-600">
                              {product.productname}
                            </h3>
                          </Link>
                          <button
                            onClick={() => addToCart(product)}
                            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl py-2 shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-300"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic">
                    No products available in this category.
                  </p>
                )}

                <ReactPaginate
                  previousLabel={<FiChevronLeft size={20} />}
                  nextLabel={<FiChevronRight size={20} />}
                  breakLabel={"..."}
                  pageCount={Math.ceil(
                    filteredProducts.length / productsPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={0}
                  onPageChange={handlePageChange}
                  containerClassName="flex justify-center items-center mt-8 space-x-2"
                  previousClassName="px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-200 hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                  nextClassName="px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-200 hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                  activeClassName="bg-blue-600 text-white rounded-lg shadow-lg px-3 py-2"
                  disabledClassName="cursor-not-allowed opacity-50"
                />
              </TabPanel>
            );
          })}
        </Tabs>

        <div className="ps-20 pe-20 bg-gray-50 px-5 py-5">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 mt-3">
            <span className="relative">Trending Products</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col"
              >
                <img
                  src={product.imageurl}
                  alt={product.productname}
                  className="w-full h-60 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                />
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <Link href={`product/${product._id}`} className="group">
                    <h3 className="font-semibold text-lg text-gray-800 transition duration-300 group-hover:text-blue-600">
                      {product.productname}
                    </h3>
                  </Link>
                  <p className="font-semibold text-xl text-gray-900 mt-2">
                    ₹{product.addprice}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-xl py-2 shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
