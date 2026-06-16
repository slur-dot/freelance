/** Firebase email verification redirect — must be allowlisted in Firebase Console → Auth → Settings → Authorized domains */
export function getEmailVerificationSettings() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return {
    url: `${origin}/login/verifycode`,
    handleCodeInApp: true,
  };
}
