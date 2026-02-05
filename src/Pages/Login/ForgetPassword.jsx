import React, { useState } from "react";
import LoginImage from "../../assets/Login.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    navigate("/login/successfull");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-white">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 flex items-center space-x-2 cursor-pointer"
      >
        <img
          src="/logo.png"
          alt="Freelance Logo"
          className="w-10 h-10 rounded-full object-contain"
        />
        <span className="text-xl font-semibold text-gray-900">Freelance</span>
      </div>

      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
        <div className="w-[80%] max-w-full space-y-6 border border-gray-300 rounded-2xl p-6 bg-white">
          <p className="text-green-700 font-semibold text-lg">
            Ignite Your Success: Connect, Sell, Innovate with Freelance-224!
          </p>
          <img
            src={LoginImage}
            alt="Freelance work illustration"
            className="w-full max-h-100 object-contain mx-auto"
          />
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-md h-auto lg:h-[550px] md:h-[600px] flex flex-col justify-center space-y-6 border border-gray-300 rounded-2xl p-6 bg-white">
          {/* Icon */}
          <div className="flex justify-center">{/* (same SVG as before) */}</div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Forget Password?
            </h1>
            <p className="text-sm text-gray-600">
              Please enter your email below to reset your
              <br /> password
            </p>
          </div>

          {/* Email Input */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-4 pr-4 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm">
              Remember Password?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Illustration */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-32 flex items-center justify-center opacity-10">
        <img
          src={LoginImage}
          alt="Freelance work illustration"
          className="w-auto h-full object-contain"
        />
      </div>
    </div>
  );
}
