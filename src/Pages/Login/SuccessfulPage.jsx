import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginImage from "../../assets/Login.jpg";

export default function SuccessfulPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetEmail = location.state?.resetEmail;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header
        onClick={() => navigate("/")}
        className="p-4 sm:p-6 flex items-center cursor-pointer">
        
        <img
          src="/logo.png"
          alt="Freelance Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain" />
        
        <span className="ml-2 text-lg sm:text-xl font-bold text-gray-800">
          {t("freelance_938", "Freelance")}
        </span>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex flex-col items-center justify-center space-y-4">
            <p className="text-green-700 font-semibold text-lg text-center px-4">
              {t("ignite_your_success_connect_sell_innovate_with__241", "Ignite Your Success: Connect, Sell, Innovate with Freelance-224!")}
            </p>
            <img
              src={LoginImage}
              alt="Login illustration"
              className="w-[100%] max-h-100 object-contain" />
            
          </div>

          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-sm p-6 sm:p-8 text-center rounded-xl shadow-lg border border-gray-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                {isResetEmail ? t('password_reset.success_title') : t('common.success', 'Success')}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                {isResetEmail ? t('password_reset.success_body') : t('common.done', 'Done.')}
              </p>

              <Link
                to="/login"
                className="mb-8 inline-block w-full sm:w-1/2 mx-auto bg-green-700 hover:bg-green-800 text-white py-2 rounded-full transition-colors text-center">
                
                {t('password_reset.login')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>);

}