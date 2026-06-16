import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Mail, Lock } from "lucide-react";
import LoginImage from "../../assets/Login.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { UserService } from "../../services/userService";
import { getDashboardPathForRole } from "../../utils/roleUtils";
import { useTranslation } from "react-i18next";

export default function UserLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        navigate('/login/verifycode', { state: { email: user.email, from: location.state?.from } });
        return;
      }

      const userData = await UserService.getUserProfile(user.uid);

      if (!userData) {
        alert(t('auth.login.profile_missing'));
        return;
      }

      if (userData.isBanned === true || userData.status === 'inactive') {
        alert(t('auth.login.banned'));
        return;
      }

      navigate(getDashboardPathForRole(userData.role));
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert(t('auth.login.invalid_credentials'));
      } else if (error.code === 'auth/too-many-requests') {
        alert(t('auth.login.too_many_requests'));
      } else {
        alert(t('auth.login.failed'));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-white">
      <div
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 flex items-center space-x-2 cursor-pointer">
        
        <img src="/logo.png" alt="Freelance Logo" className="w-10 h-10 rounded-full object-contain" />
        <span className="text-xl font-semibold text-gray-900">{t("freelance_504", "Freelance")}</span>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4">
        <div className="w-[80%] space-y-6 border border-gray-300 rounded-2xl p-4 bg-white text-center">
          <p className="text-green-700 font-semibold text-lg mb-4">{t('login_page.tagline')}</p>
          <img src={LoginImage} alt={t('login_page.img_alt')} className="w-full max-h-100 object-contain" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 border border-gray-300 rounded-2xl p-6 bg-white">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: t('login_page.title') }} />
            <p className="text-sm text-gray-600">{t('login_page.welcome')}</p>
          </div>

          {location.state?.verifyEmail &&
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">{t('auth.verify.login_blocked')}</p>
          }

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder={t('login_page.email_placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('login_page.password_placeholder')}
                className="w-full pl-10 pr-10 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={t('auth.toggle_password')}>
                
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                {t('login_page.forgot_password')}
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors">
              
              {t('login_page.login_btn')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t('login_page.no_account')}{' '}
            <Link to="/signup" className="text-green-600 font-medium hover:underline">
              {t('login_page.signup_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>);

}