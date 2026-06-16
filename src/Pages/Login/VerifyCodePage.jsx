import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Loader2 } from 'lucide-react';
import loginImage from '../../assets/Login.jpg';
import {
  applyActionCode,
  sendEmailVerification,
  onAuthStateChanged } from
'firebase/auth';
import { auth } from '../../firebaseConfig';
import { getEmailVerificationSettings } from '../../utils/emailVerification';
import { getDashboardPathForRole } from '../../utils/roleUtils';
import { UserService } from '../../services/userService';

const RESEND_COOLDOWN_SEC = 60;

export default function VerifyCodePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(auth.currentUser);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const inputRefs = useRef([]);

  const emailHint = location.state?.email || user?.email || '';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const id = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendSeconds]);

  /** Handle link from verification email (?mode=verifyEmail&oobCode=...) */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');
    if (mode === 'verifyEmail' && oobCode) {
      setProcessing(true);
      applyActionCode(auth, oobCode).
      then(async () => {
        await auth.currentUser?.reload();
        setInfo(t('auth.verify.success'));
        await redirectIfVerified();
      }).
      catch(() => setError(t('auth.verify.invalid_link'))).
      finally(() => setProcessing(false));
    }
  }, [location.search]);

  const redirectIfVerified = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) {
      navigate('/login', { replace: true });
      return;
    }
    await u.reload();
    if (!u.emailVerified) return;

    const profile = await UserService.getUserProfile(u.uid);
    const path = profile?.role ? getDashboardPathForRole(profile.role) : '/';
    navigate(path, { replace: true });
  }, [navigate]);

  const handleDigitChange = (index, value) => {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /**
   * Manual continue: reload auth user after they clicked the email link.
   * (Firebase email verification uses a link, not a typed OTP.)
   */
  const handleContinue = async () => {
    setError('');
    setProcessing(true);
    try {
      if (!auth.currentUser) {
        setError(t('auth.verify.not_signed_in'));
        navigate('/login', { state: { email: emailHint } });
        return;
      }
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        await redirectIfVerified();
        return;
      }
      setError(t('auth.verify.not_verified_yet'));
    } finally {
      setProcessing(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || !auth.currentUser) return;
    setError('');
    try {
      await sendEmailVerification(auth.currentUser, getEmailVerificationSettings());
      setInfo(t('auth.verify.resend_success'));
      setResendSeconds(RESEND_COOLDOWN_SEC);
    } catch (e) {
      setError(t('auth.verify.resend_error'));
    }
  };

  if (user?.emailVerified) {
    redirectIfVerified();
    return (
      <div className="flex justify-center min-h-screen items-center">
        <Loader2 className="animate-spin text-green-600 w-10 h-10" />
      </div>);

  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 sm:p-6">
        <Link to="/" className="flex items-center space-x-2 w-fit">
          <img src="/logo.png" alt="Freelance" className="w-10 h-10 rounded-full object-contain" />
          <span className="text-xl font-semibold text-gray-900">{t("freelance_910", "Freelance")}</span>
        </Link>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-6 px-4 sm:px-6 lg:px-12 py-6">
        <div className="hidden lg:flex flex-col items-center text-center space-y-4">
          <p className="text-green-700 font-semibold text-lg">{t('login_page.tagline')}</p>
          <img src={loginImage} alt="" className="w-full max-h-100 object-contain" />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-full max-w-md rounded-xl shadow-lg border border-gray-200 px-6 py-8">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="h-14 w-14 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">{t('auth.verify.title')}</h2>
            <p className="text-gray-500 text-sm text-center mb-2">{t('auth.verify.instructions')}</p>
            {emailHint &&
            <p className="text-center text-sm font-medium text-gray-800 mb-4">{emailHint}</p>
            }

            {info && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-4">{info}</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

            <p className="text-xs text-gray-500 text-center mb-3">{t('auth.verify.link_hint')}</p>

            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {digits.map((d, i) =>
              <input
                key={i}
                ref={(el) => {inputRefs.current[i] = el;}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-500"
                aria-label={t('auth.verify.digit_label', { n: i + 1 })} />

              )}
            </div>

            <div className="flex flex-wrap justify-between items-center text-sm mb-6 gap-2">
              <span className="text-gray-500">{t('auth.verify.no_code')}</span>
              <button
                type="button"
                disabled={resendSeconds > 0 || !user}
                onClick={handleResend}
                className="text-green-600 font-medium hover:underline disabled:opacity-50">
                
                {resendSeconds > 0 ?
                t('auth.verify.resend_in', { seconds: resendSeconds }) :
                t('auth.verify.resend')}
              </button>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handleContinue}
              className="w-full py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2">
              
              {processing && <Loader2 className="w-5 h-5 animate-spin" />}
              {t('auth.verify.continue')}
            </button>

            <p className="text-center text-sm mt-4">
              <Link to="/login" className="text-green-600 hover:underline">
                {t('auth.verify.back_login')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>);

}