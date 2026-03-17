import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation();
  const current = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems || [];
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
        <div className="flex justify-between items-center h-16 gap-4 xl:gap-8 w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="ml-2 text-xl font-bold text-gray-900">Freelance</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center space-x-2 xl:space-x-8 items-center whitespace-nowrap text-sm xl:text-base">
            <Link to="/" className={isActive("/")}>{t('navbar.home')}</Link>
            <Link to="/shop" className={isActive("/shop")}>{t('navbar.shop')}</Link>
            <Link to="/hire-freelancers" className={isActive("/hire-freelancers")}>{t('navbar.hire_freelancers')}</Link>
            <Link to="/locations" className={isActive("/locations")}>{t('navbar.locations')}</Link>
            <Link to="/tech-services" className={isActive("/tech-services")}>{t('navbar.tech_services')}</Link>


            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium pb-1">
                {t('navbar.more')} <HiChevronDown className="ml-1 text-sm text-gray-500" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity z-[100] py-1">
                <Link to="/computer-rental" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.device_rental')}</Link>
                <Link to="/training-modules" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.training_upskilling')}</Link>
                <Link to="/corporate-sales" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.corporate_sales')}</Link>
                <Link to="/faq" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.faq')}</Link>
                <Link to="/blog" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.blog')}</Link>
                <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.contact_us')}</Link>
                <Link to="/vendor-profiles" className="block px-4 py-2 hover:bg-gray-100">{t('navbar.vendor_profiles')}</Link>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center space-x-2 xl:space-x-4">
                <span className="text-gray-700 font-medium text-xs xl:text-sm">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 rounded-2xl px-3 xl:px-4 py-1 text-sm hover:bg-red-600 transition whitespace-nowrap"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-white bg-blue-500 rounded-2xl px-3 xl:px-4 py-1 text-sm hover:bg-blue-600 transition whitespace-nowrap"
                >
                  {t('navbar.login')}
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-green-700 text-white rounded-2xl px-3 xl:px-4 py-1 text-sm hover:bg-green-800 transition whitespace-nowrap"
                >
                  {t('navbar.signup')}
                </button>
              </>
            )}
            <div className="flex space-x-1 xl:space-x-2 ml-2">
              <button onClick={() => changeLanguage('en')} className={`text-xs xl:text-sm font-medium ${i18n.language === 'en' ? 'text-blue-600' : 'text-gray-700'}`}>EN</button>
              <span className="text-gray-400 text-xs xl:text-sm">|</span>
              <button onClick={() => changeLanguage('fr')} className={`text-xs xl:text-sm font-medium ${i18n.language === 'fr' ? 'text-blue-600' : 'text-gray-700'}`}>FR</button>
            </div>
            <Link to="/shop/cart" className="relative ml-2 xl:ml-3 flex items-center">
              <FaShoppingCart className="text-black text-[18px] cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-700 hover:text-black"
            >
              <FaBars size={22} />
            </button>
          </div>
          {/* Mobile menu toggle button */}
          {/* Mobile Drawer */}
          <div
            className={`fixed inset-0 z-50 md:hidden transition-opacity ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div
              className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div className="flex flex-col h-full">

                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                  <div className="flex items-center space-x-2">
                    <img src="/logo.png" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-gray-800 text-lg">Freelance</span>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

                  {/* Main Links */}
                  <div className="space-y-4 text-gray-700 font-medium">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600">
                      {t("navbar.home")}
                    </Link>

                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600">
                      {t("navbar.shop")}
                    </Link>

                    <Link to="/hire-freelancers" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600">
                      {t("navbar.hire_freelancers")}
                    </Link>

                    <Link to="/locations" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600">
                      {t("navbar.locations")}
                    </Link>

                    <Link to="/tech-services" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-blue-600">
                      {t("navbar.tech_services")}
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* More Section */}
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase mb-3">
                      {t("navbar.more")}
                    </p>

                    <div className="space-y-3 text-gray-600 text-sm">
                      <Link to="/computer-rental" className="block hover:text-blue-600">
                        {t("navbar.device_rental")}
                      </Link>

                      <Link to="/training-modules" className="block hover:text-blue-600">
                        {t("navbar.training_upskilling")}
                      </Link>

                      <Link to="/corporate-sales" className="block hover:text-blue-600">
                        {t("navbar.corporate_sales")}
                      </Link>

                      <Link to="/faq" className="block hover:text-blue-600">
                        {t("navbar.faq")}
                      </Link>

                      <Link to="/blog" className="block hover:text-blue-600">
                        {t("navbar.blog")}
                      </Link>

                      <Link to="/contact" className="block hover:text-blue-600">
                        {t("navbar.contact_us")}
                      </Link>

                      <Link to="/vendor-profiles" className="block hover:text-blue-600">
                        {t("navbar.vendor_profiles")}
                      </Link>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Language Switch */}
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase mb-3">
                      Language
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => changeLanguage("en")}
                        className={`px-4 py-1 rounded-full text-sm border ${i18n.language === "en"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700"
                          }`}
                      >
                        EN
                      </button>

                      <button
                        onClick={() => changeLanguage("fr")}
                        className={`px-4 py-1 rounded-full text-sm border ${i18n.language === "fr"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700"
                          }`}
                      >
                        FR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Auth Section */}
                <div className="border-t p-5 space-y-3">

                  {currentUser ? (
                    <>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>

                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                      >
                        {t("navbar.logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                      >
                        {t("navbar.login")}
                      </button>

                      <button
                        onClick={handleSignup}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                      >
                        {t("navbar.signup")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </nav>
  );
}
