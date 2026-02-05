import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";


import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation();
  const current = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const isActive = (path) =>
    current === path
      ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
      : "text-gray-700 hover:text-gray-900 font-medium pb-1 border-b-2 border-transparent hover:border-gray-300";

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="ml-2 text-xl font-bold text-gray-900">Freelance</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex ml-10 space-x-6 items-center">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/shop" className={isActive("/shop")}>Shop</Link>
            <Link to="/hire-freelancers" className={isActive("/hire-freelancers")}>Hire Freelancers</Link>
            <Link to="/locations" className={isActive("/locations")}>Locations</Link>
            <Link to="/tech-services" className={isActive("/tech-services")}>Tech Services</Link>

            {/* Dashboards Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium pb-1">
                Dashboards <HiChevronDown className="ml-1 text-sm text-gray-500" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 py-1">
                <Link to="/freelancer/dashboard" className="block px-4 py-2 hover:bg-gray-100">Freelancer Dashboard</Link>
                <Link to="/Clients/dashboard" className="block px-4 py-2 hover:bg-gray-100">Clients Dashboard</Link>
                <Link to="/Company/dashboard" className="block px-4 py-2 hover:bg-gray-100">Company Dashboard</Link>
                <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                <Link to="/vendor/dashboard" className="block px-4 py-2 hover:bg-gray-100">Vendor Modules</Link>
                <Link to="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100">Seller Dashboard</Link>
              </div>
            </div>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium pb-1">
                More <HiChevronDown className="ml-1 text-sm text-gray-500" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 py-1">
                <Link to="/computer-rental" className="block px-4 py-2 hover:bg-gray-100">Device Rental</Link>
                <Link to="/training-modules" className="block px-4 py-2 hover:bg-gray-100">Training & Upskilling</Link>
                <Link to="/corporate-sales" className="block px-4 py-2 hover:bg-gray-100">Corporate & NGO Sales</Link>
                <Link to="/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ</Link>
                <Link to="/blog" className="block px-4 py-2 hover:bg-gray-100">Blog</Link>
                <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact Us</Link>
                <Link to="/vendor-profiles" className="block px-4 py-2 hover:bg-gray-100">Vendor Profiles</Link>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-sm">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 rounded-2xl px-4 py-1 hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-white bg-blue-500 rounded-2xl px-4 py-1 hover:bg-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-green-700 text-white rounded-2xl px-4 py-1 hover:bg-green-800 transition"
                >
                  Sign Up
                </button>
              </>
            )}
            <span className="text-gray-700 font-medium">EN</span>
            <FaShoppingCart className="text-black text-[18px] cursor-pointer" />
          </div>

          {/* Mobile menu toggle button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link to="/" className="block text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="block text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link to="/hire-freelancers" className="block text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Hire Freelancers</Link>
          <Link to="/locations" className="block text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Locations</Link>
          <Link to="/tech-services" className="block text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Tech Services</Link>

          {/* Dashboards Dropdown (Flat) */}
          <div>
            <p className="font-semibold text-gray-700 mt-2">Dashboards</p>
            <Link to="/freelancer/dashboard" className="block text-sm text-gray-600 ml-4">Freelancer</Link>
            <Link to="/Clients/dashboard" className="block text-sm text-gray-600 ml-4">Clients</Link>
            <Link to="/Company/dashboard" className="block text-sm text-gray-600 ml-4">Company</Link>
            <Link to="/admin/dashboard" className="block text-sm text-gray-600 ml-4">Admin</Link>
            <Link to="/vendor/dashboard" className="block text-sm text-gray-600 ml-4">Vendor</Link>
            <Link to="/seller/dashboard" className="block text-sm text-gray-600 ml-4">Seller</Link>
          </div>

          {/* More Dropdown (Flat) */}
          <div>
            <p className="font-semibold text-gray-700 mt-2">More</p>
            <Link to="/computer-rental" className="block text-sm text-gray-600 ml-4">Device Rental</Link>
            <Link to="/training-modules" className="block text-sm text-gray-600 ml-4">Training & Upskilling</Link>
            <Link to="/corporate-sales" className="block text-sm text-gray-600 ml-4">Corporate & NGO Sales</Link>
            <Link to="/faq" className="block text-sm text-gray-600 ml-4">FAQ</Link>
            <Link to="/blog" className="block text-sm text-gray-600 ml-4">Blog</Link>
            <Link to="/contact" className="block text-sm text-gray-600 ml-4">Contact Us</Link>
            <Link to="/vendor-profiles" className="block text-sm text-gray-600 ml-4">Vendor Profiles</Link>
          </div>

          {/* Auth Buttons */}
          <div className="pt-4 space-y-2">
            {currentUser ? (
              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded">Logout</button>
            ) : (
              <>
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
                <button onClick={handleSignup} className="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
