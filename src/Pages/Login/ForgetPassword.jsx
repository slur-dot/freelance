import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LoginImage from "../../assets/Login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function ForgetPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('password_reset.email_required'));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      navigate("/login/successfull", { state: { resetEmail: true } });
    } catch (err) {
      console.error("Password reset error:", err);
      setError(t('password_reset.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-white">
      <div onClick={() => navigate("/")} className="absolute top-4 left-4 z-10 flex items-center space-x-2 cursor-pointer">
        <img src="/logo.png" alt="Freelance Logo" className="w-10 h-10 rounded-full object-contain" />
        <span className="text-xl font-semibold text-gray-900">{t("freelance_535", "Freelance")}</span>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
        <div className="w-[80%] max-w-full space-y-6 border border-gray-300 rounded-2xl p-6 bg-white">
          <p className="text-green-700 font-semibold text-lg">{t('login_page.tagline')}</p>
          <img src={LoginImage} alt="" className="w-full max-h-100 object-contain mx-auto" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-md flex flex-col justify-center space-y-6 border border-gray-300 rounded-2xl p-6 bg-white">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{t('password_reset.title')}</h1>
            <p className="text-sm text-gray-600">{t('password_reset.subtitle')}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('password_reset.email_placeholder')}
              className="w-full pl-4 pr-4 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              required />
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors disabled:opacity-50">
                
                {loading ? t('password_reset.sending') : t('password_reset.submit')}
              </button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('password_reset.remember')}{' '}
              <Link to="/login" className="text-green-600 hover:underline font-medium">
                {t('password_reset.login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>);

}