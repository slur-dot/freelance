import React from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../assets/Login.jpg";

export default function SuccessfulPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login/verifycode");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header
        onClick={() => navigate("/")}
        className="p-4 sm:p-6 flex items-center cursor-pointer"
      >
        <img
          src="/logo.png"
          alt="Freelance Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain"
        />
        <span className="ml-2 text-lg sm:text-xl font-bold text-gray-800">
          Freelance
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Image with Tagline */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-4">
            {/*  Tagline */}
            <p className="text-green-700 font-semibold text-lg text-center px-4">
              Ignite Your Success: Connect, Sell, Innovate with Freelance-224!
            </p>
            <img
              src={LoginImage}
              alt="Login illustration"
              className="w-[100%] max-h-100 object-contain"
            />
          </div>

          {/* Right Card */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-sm p-6 sm:p-8 text-center rounded-xl shadow-lg border border-gray-300">
              <div className="flex justify-center mb-6 mt-10 sm:mt-16">
                {/* SVG Check Icon */}
                <svg
                  width="158"
                  height="182"
                  viewBox="0 0 158 182"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 sm:h-24 sm:w-24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M117.596 57.399C119.888 60.0329 119.896 64.3119 117.613 66.9565L68.2605 124.133C65.9778 126.778 62.2695 126.786 59.9774 124.153L41.9789 103.471C39.6867 100.838 39.679 96.5585 41.9616 93.9137C44.2442 91.269 47.9528 91.2601 50.2449 93.8938L64.0935 109.807L109.313 57.4183C111.596 54.7737 115.304 54.7651 117.596 57.399Z"
                    fill="#15803D"
                  />
                  <path
                    d="M59.9774 124.153C62.2695 126.786 65.9778 126.778 68.2605 124.133L117.613 66.9565C119.896 64.3119 119.888 60.0329 117.596 57.399C115.304 54.7651 111.596 54.7737 109.313 57.4183L64.0935 109.807L50.2449 93.8938C47.9528 91.2601 44.2442 91.269 41.9616 93.9137C39.679 96.5585 39.6867 100.838 41.9789 103.471L59.9774 124.153ZM59.9774 124.153L64.1105 119.364"
                    stroke="#15803D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M79.1586 15.3627C48.1114 15.3627 22.065 40.3774 15.379 73.8879C14.2906 79.3424 13.7143 85.028 13.7143 90.8754C13.7143 132.548 43.0421 166.388 79.1586 166.388C115.275 166.388 144.603 132.548 144.603 90.8754C144.603 49.2025 115.275 15.3627 79.1586 15.3627ZM3.96331 70.8555C11.8455 31.3497 42.53 1.84619 79.1586 1.84619C121.745 1.84619 156.317 41.7376 156.317 90.8754C156.317 140.013 121.745 179.905 79.1586 179.905C36.5725 179.905 2 140.013 2 90.8754C2 83.9999 2.67796 77.2972 3.96331 70.8555Z"
                    fill="#15803D"
                    fillOpacity="0.5"
                    stroke="#15803D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                Successfully
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                Your password has been reset successfully.
              </p>

              <button
                onClick={handleContinue}
                className="mb-20 w-full sm:w-1/2 mx-auto bg-green-700 hover:bg-green-800 text-white py-2 rounded-full transition-colors cursor-pointer"
              >
                Continue Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
