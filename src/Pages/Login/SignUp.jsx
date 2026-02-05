import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImage from "../../assets/Login.jpg";
import { Mail, Lock, UserRound } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { UserService } from "../../services/userService";


export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [role, setRole] = useState(""); // role state
  const [countryCode, setCountryCode] = useState("+224"); // default Guinea
  const [countryFlag, setCountryFlag] = useState("🇬🇳"); // Guinea flag

  const countries = [
    { code: "+224", flag: "🇬🇳", name: "Guinea" },
    { code: "+221", flag: "🇸🇳", name: "Senegal" },
    { code: "+225", flag: "🇨🇮", name: "Ivory Coast" },
    { code: "+233", flag: "🇬🇭", name: "Ghana" },
  ];

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
      alert("Please accept the terms and conditions");
      return;
    }
    if (!userRole) {
      alert("Please select a role.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        "Password must be at least 8 characters long and include: uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (userRole === "Freelancer") {
      const username = e.target.freelancerUsername?.value.trim();
      const phone = e.target.phone?.value.trim();
      if (!username) {
        alert("Please enter a username.");
        return;
      }
      if (!phone) {
        alert("Please enter your phone number.");
        return;
      }
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data for Firestore
      const userData = {
        fullName,
        email,
        role: userRole,
        ...(userRole === "Freelancer" && {
          username: e.target.freelancerUsername.value.trim(),
          phone: `${countryCode} ${e.target.phone.value.trim()}`,
        }),
      };

      // Save user profile to Firestore via UserService
      await UserService.createUserProfile(user.uid, userData);

      alert("Sign up successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("User with this email already exists. Please log in.");
      } else {
        alert("Signup failed: " + error.message);
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
            Ignite Your Success: Connect, Sell, Innovate with Freelance-224!
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
              Sign<span className="text-green-700"> Up</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Join the Tech Revolution in Guinea!
            </p>
            <p className="text-green-700 font-semibold text-sm">
              Ignite Your Success: Connect, Sell, Innovate with Freelance-224!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Full Name"
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
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Role</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Vendor">Vendor</option>
                <option value="Company">Company</option>
                <option value="Client">Client</option>
                <option value="Admin">Admin</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            {/* Freelancer fields */}
            {role === "Freelancer" && (
              <>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                  <input
                    type="text"
                    name="freelancerUsername"
                    placeholder="Username"
                    className="w-full pl-10 pr-3 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex items-center border border-green-600 rounded-full px-3">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      const selected = countries.find(
                        (c) => c.code === e.target.value
                      );
                      setCountryCode(selected.code);
                      setCountryFlag(selected.flag);
                    }}
                    className="bg-transparent focus:outline-none pr-2"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="flex-1 py-2 px-2 focus:outline-none rounded-r-full"
                    required
                  />
                </div>
              </>
            )}


            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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
                placeholder="Confirm Password"
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
                I agree to the{" "}
                <a href="/privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                  Terms of Service
                </a>
                .
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition duration-200"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}