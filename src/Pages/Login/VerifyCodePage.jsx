import React from "react"; 
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import loginImage from "../../assets/Login.jpg";

export default function VerifyCodePage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center p-4 sm:p-5 md:p-6 lg:p-8">
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
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-6 md:gap-10 px-4 sm:px-6 lg:px-12 py-6">
        {/* Illustration (Left) */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-4">
          {/*  Tagline */}
          <p className="text-green-700 font-semibold text-lg">
            Ignite Your Success: Connect, Sell, Innovate with Freelance-224!
          </p>
          <img
            src={loginImage}
            alt="Freelance Illustration"
            className="w-[100%] max-h-100 h-auto rounded-lg object-contain"
            width="600"
            height="450"
          />
        </div>

        {/* Form (Right) */}
        <div className="flex items-center justify-center w-full">
          <div className="h-120 bg-white rounded-xl shadow-lg px-4 py-6 sm:px-6 md:px-8 lg:px-10 w-full max-w-md border border-gray-300">
            <div className="flex justify-center mb-4">
              <ShieldCheck
                className="h-14 w-14 sm:h-16 sm:w-16"
                style={{ fill: "#006400", stroke: "white" }}
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Verify Code</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Please check your email. An authentication code has been sent to your email.
            </p>

            {/* Code Input Fields */}
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            {/* Resend + Timer */}
            <div className="flex flex-wrap justify-between items-center text-sm mb-6 gap-2">
              <span className="text-gray-500 ml-10">Didn’t receive a code?</span>
              <a href="#" className="text-green-500 font-medium hover:underline">
                Resend
              </a>
              <span className="ml-auto text-green-900">00:30</span>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                className="flex justify-center w-1/2 py-3 text-lg font-semibold rounded-full bg-green-700 text-white shadow hover:bg-green-800 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
