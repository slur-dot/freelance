import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Mail, Lock } from "lucide-react";
import LoginImage from "../../assets/Login.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { UserService } from "../../services/userService";
import { useTranslation, Trans } from "react-i18next"; // Added useTranslation and Trans

export default function UserLogin() {
  const { t } = useTranslation(); // Initialize translation hook
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore via UserService
      const userData = await UserService.getUserProfile(user.uid);

      if (userData) {
        const role = userData.role;

        // Navigate based on role
        if (role === "Freelancer") {
          navigate("/freelancer/dashboard");
        } else if (role === "Company") {
          navigate("/company/dashboard");
        } else if (role === "Vendor") {
          navigate("/vendor/dashboard");
        } else if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (role === "Client") {
          navigate("/Clients/dashboard");
        } else if (role === "Seller") {
          navigate("/seller/dashboard");
        } else {
          // Default fallback
          navigate("/company/dashboard");
        }
      } else {
        console.error("User document not found in Firestore");
        // Fallback if no role found
        navigate("/company/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password.");
    }
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

      {/* Left Image with Tagline */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4">
        <div className="w-[80%] space-y-6 border border-gray-300 rounded-2xl p-4 bg-white text-center">
          {/* Tagline placed above image */}
          <p className="text-green-700 font-semibold text-lg mb-4">
            {t('login_page.tagline')}
          </p>

          <img
            src={LoginImage}
            alt={t('login_page.img_alt')}
            className="w-full max-h-100 object-contain mx-auto"
          />
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md space-y-6 border border-gray-300 rounded-2xl shadow-lg p-6 bg-white">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              <Trans i18nKey="login_page.title" components={{ span: <span className="text-green-700" /> }} />
            </h1>
            <p className="text-gray-600">{t('login_page.welcome')}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder={t('login_page.email_placeholder')}
                className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('login_page.password_placeholder')}
                className="w-full pl-10 pr-10 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                {t('login_page.forgot_password')}
              </a>
            </div>

            {/* Login Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition duration-200 cursor-pointer"
              >
                {t('login_page.login_btn')}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              {t('login_page.no_account')}{" "}
              <a
                href="/signup"
                className="text-green-600 font-medium hover:underline"
              >
                {t('login_page.signup_link')}
              </a>
            </div>

            {/* OR Divider */}
            <div className="relative text-center text-sm text-gray-500">
              <span className="bg-white px-2">{t('login_page.or')}</span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full border border-green-600 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors flex items-center justify-center space-x-2 bg-white"
            >
              <FcGoogle className="w-5 h-5" />
              <span>{t('login_page.google_signin')}</span>
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              {t('login_page.terms_agreement')}{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                {t('login_page.terms_of_service')}
              </a>{" "}
              {t('login_page.and')}{" "}
              <a href="/privacy" className="text-blue-500 hover:underline">
                {t('login_page.privacy_policy')}
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
