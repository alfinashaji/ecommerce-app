"use client";

import localFont from "next/font/local";
import "../globals.css";
import {Provider} from "../provider/provider";
import {createContext, useEffect, useState} from "react";
import {SessionProvider} from "next-auth/react";
import Header from "../component/common/header/Header";
import axios from "axios";
import Home from "./page";
import Footer from "../component/common/footer/Footer";
export const ecomContext = createContext(null);

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({children}) {
  const [cart, setCart] = useState([]);
  const [getData, setGetData] = useState(true);
  const [isCartVisible, setCartVisible] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };
  const cartData = [];
  if (typeof window !== "undefined") {
    const cartData =
      localStorage.getItem("cart") !== null && localStorage.getItem("cart");
  }
  console.log("Raw cart data from localStorage:", cartData);
  useEffect(() => {
    // Check if the data exists
    axios
      .post("/api/cart", {
        data:
          localStorage.getItem("cart") !== null &&
          JSON.parse(localStorage.getItem("cart")),
      })
      .then(function (response) {
        setCart(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [getData]);

  return (
    <html lang="en">
      <ecomContext.Provider
        value={{
          cart: cart,
          setCart: setCart,
          setGetData: setGetData,
          isCartVisible: isCartVisible,
          setCartVisible: setCartVisible,
        }}
      >
        <Provider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased `}
          >
            <Header
              isCartVisible={isCartVisible}
              setCartVisible={setCartVisible}
            />

            {children}
            <Footer />
          </body>
        </Provider>
      </ecomContext.Provider>
    </html>
  );
}
