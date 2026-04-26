import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImage from "../../assets/Login.jpg";
import { Mail, Lock, UserRound } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { UserService } from "../../services/userService";

import PhoneInput from "../../components/PhoneInput";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [role, setRole] = useState(""); 
  const [countryCode, setCountryCode] = useState("+224");
  const [phone, setPhone] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = e.target.username?.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const userRole = role;

    if (!agree) {
      alert(t('signup_page.alerts.accept_terms') || "Please accept the terms and conditions");
      return;
    }
    if (!userRole) {
      alert(t('signup_page.alerts.select_role') || "Please select a role.");
      return;
    }
    if (!validateEmail(email)) {
      alert(t('signup_page.alerts.invalid_email') || "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        t('signup_page.alerts.invalid_password') || "Password must be at least 8 characters long and include: uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      alert(t('signup_page.alerts.password_mismatch') || "Passwords do not match");
      return;
    }

    const nickname = e.target.nickname?.value.trim();
    const phoneDigits = phone.replace(/\D/g, '');
    
    // Country specific length validation
    const { countryData } = await import("../../utils/countryData");
    const selectedCountry = countryData.find(c => c.code === countryCode);
    
    if (!nickname) {
      alert(t('signup_page.alerts.enter_nickname') || "Please enter a nickname.");
      return;
    }
    if (!phoneDigits) {
      alert(t('signup_page.alerts.enter_phone') || "Please enter your phone number.");
      return;
    }

    if (selectedCountry && phoneDigits.length !== selectedCountry.digits) {
      alert(`${t('signup_page.alerts.invalid_phone_length') || 'Invalid phone number length for'} ${selectedCountry.name}. ${t('signup_page.alerts.expected') || 'Expected'} ${selectedCountry.digits} ${t('signup_page.alerts.digits') || 'digits'}.`);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data for Firestore - sanitize phone (keep only code and digits)
      const userData = {
        fullName,
        nickname: nickname,
        email,
        phone: `${countryCode}${phoneDigits}`,
        role: userRole,
      };

      // Save user profile to Firestore via UserService
      await UserService.createUserProfile(user.uid, userData);

      alert(t('signup_page.alerts.success') || "Sign up successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert(t('signup_page.alerts.email_in_use') || "User with this email already exists. Please log in.");
      } else {
        alert((t('signup_page.alerts.failed') || "Signup failed: ") + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
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

      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4">
        <div className="w-[80%] space-y-6 border border-gray-300 rounded-2xl p-4 bg-white">
          <p className="text-green-700 font-semibold text-lg mb-4">
            {t('signup_page.hero.tagline') || 'Ignite Your Success: Connect, Sell, Innovate with Freelance-224!'}
          </p>
          <img
            src={LoginImage}
            alt="Freelance work"
            className="w-full max-h-100 object-contain mx-auto"
          />
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-md space-y-6 border border-gray-300 rounded-2xl shadow-lg p-6 bg-white">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('signup_page.form.sign') || 'Sign'}<span className="text-green-700">{t('signup_page.form.up') || ' Up'}</span>
            </h1>
            <p className="text-gray-600 text-sm">
              {t('signup_page.hero.subtitle') || 'Join the Tech Revolution in Guinea!'}
            </p>
            <p className="text-green-700 font-semibold text-sm">
              {t('signup_page.hero.tagline') || 'Ignite Your Success: Connect, Sell, Innovate with Freelance-224!'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder={t('signup_page.form.full_name') || "Full Name"}
                className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Nickname */}
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                name="nickname"
                placeholder={t('signup_page.form.nickname') || "Nickname"}
                className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder={t('signup_page.form.email') || "Email"}
                className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Phone Number with Country Code */}
            <div className="relative" style={{ zIndex: 20 }}>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                className="rounded-full border border-green-600 focus-within:ring-2 focus-within:ring-green-500"
                selectClassName="bg-gray-50 border-none border-r border-green-300 pr-2 py-2 rounded-l-full"
                inputClassName="bg-white border-none py-2 px-2 rounded-r-full"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 pl-2">
                {t('signup_page.form.role') || "Role"}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">{t('signup_page.form.select_role') || "Select Role"}</option>
                <option value="Freelancer">{t('signup_page.form.roles.freelancer') || "Freelancer"}</option>
                <option value="Vendor">{t('signup_page.form.roles.vendor') || "Vendor"}</option>
                <option value="Company">{t('signup_page.form.roles.company') || "Company"}</option>
                <option value="Client">{t('signup_page.form.roles.client') || "Client"}</option>
                <option value="Seller">{t('signup_page.form.roles.seller') || "Seller"}</option>
              </select>
            </div>


            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('signup_page.form.password') || "Password"}
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t('signup_page.form.confirm_password') || "Confirm Password"}
                className="w-full pl-10 pr-10 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="mt-1 h-4 w-4 text-white bg-green-600 border-green-600 rounded"
              />
              <label className="text-gray-700">
                {t('signup_page.form.terms.agree') || "I agree to the "}
                <a href="/privacy" className="text-green-600 hover:underline">
                  {t('signup_page.form.terms.privacy') || "Privacy Policy"}
                </a>
                {t('signup_page.form.terms.and') || " and "}
                <a href="/terms" className="text-green-600 hover:underline">
                  {t('signup_page.form.terms.service') || "Terms of Service"}
                </a>
                {t('signup_page.form.terms.period') || "."}
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition duration-200"
              >
                {t('signup_page.form.submit') || "Sign Up"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              {t('signup_page.form.already_have_account') || "Already have an account? "}
              <a
                href="/login"
                className="text-green-600 font-medium hover:underline"
              >
                {t('signup_page.form.login') || "Login"}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}