import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 text-gray-700">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-primary-600 text-2xl font-bold">SockCo</h2>
            <p className="text-lg">Premium socks for the modern lifestyle.</p>
            <div className="flex space-x-4">
              <Facebook className="text-primary-600 hover:text-primary-800 h-6 w-6 cursor-pointer" />
              <Instagram className="text-primary-600 hover:text-primary-800 h-6 w-6 cursor-pointer" />
              <Twitter className="text-primary-600 hover:text-primary-800 h-6 w-6 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-primary-600 text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-primary-600 text-lg font-semibold">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-primary-600 mt-0.5 h-5 w-5" />
                <p>123 Sock Street, Socksville, SO 12345</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary-600 h-5 w-5" />
                <a
                  href="mailto:info@sockco.com"
                  className="hover:text-primary-600"
                >
                  info@sockco.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary-600 h-5 w-5" />
                <a href="tel:+1234567890" className="hover:text-primary-600">
                  (123) 456-7890
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-primary-600 text-lg font-semibold">
              Stay Updated
            </h3>
            <p>
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="focus:border-primary-500 w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SockCo. All rights reserved. |
            <a href="#" className="hover:text-primary-600 ml-2">
              Privacy Policy
            </a>{" "}
            |
            <a href="#" className="hover:text-primary-600 ml-2">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
