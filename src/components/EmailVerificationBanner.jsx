import React from 'react';
import { useTranslation } from 'react-i18next';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerificationBanner() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.emailVerified) return null;

  const resend = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert(t('auth.verify.resend_success'));
    } catch (e) {
      alert(t('auth.verify.resend_error'));
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-900 flex flex-wrap items-center justify-between gap-2">
      <span>{t('auth.verify.banner')}</span>
      <button
        type="button"
        onClick={resend}
        className="font-semibold text-amber-800 hover:underline"
      >
        {t('auth.verify.resend')}
      </button>
    </div>
  );
}
