import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white-900 text-black h-[130px]">
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-center">
          <div style={{textAlign: "center"}}>
            <h5 className="text-lg font-semibold">Glamoura</h5>
            <p className="text-sm">
              Find Your Perfect Fit, Style Your Every Moment.
            </p>
          </div>
          {/* <div>
            <h5 className="text-lg font-semibold">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-gray-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-400">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-gray-400">
                  Contact
                </a>
              </li>
            </ul>
          </div> */}
          {/* <div>
            <h5 className="text-lg font-semibold">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-400">
                Facebook
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                Instagram
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                Twitter
              </a>
            </div>
          </div> */}
        </div>
        <div className="text-center text-sm mt-6 border-t pt-4">
          <p>
            &copy; {new Date().getFullYear()} Glamoura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
