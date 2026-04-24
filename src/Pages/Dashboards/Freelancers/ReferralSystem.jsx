import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Share2, Users, Gift, CheckCircle2, TrendingUp } from 'lucide-react';
import { ReferralService } from '../../../services/referralService';
import { auth } from '../../../firebaseConfig';

export default function ReferralSystem() {
  const { t } = useTranslation();
  const [user, setUser] = useState(auth.currentUser);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const refData = await ReferralService.getReferralData(user.uid);
        setData(refData);
      } catch (err) {
        console.error("Failed to load referral data:", err);
        setError("Failed to load referral data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCopy = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && data?.referralLink) {
      try {
        await navigator.share({
          title: 'Join Freelance2414',
          text: 'Use my invite link to join Freelance2414 and start earning!',
          url: data.referralLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Referral Program</h1>
        <p className="text-gray-600 mt-1">Invite friends and earn rewards when they complete their first project.</p>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share Link Card */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Earn 50,000 GNF
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Invite Link</h2>
          <p className="text-sm text-gray-600 mb-6">Share this unique link to get credit for new users who sign up and complete a project.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                readOnly 
                value={data.referralLink} 
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl py-3 px-4 outline-none focus:border-green-400 font-mono text-sm"
              />
            </div>
            <button 
              onClick={handleCopy}
              className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={handleShare}
              className="px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center justify-center sm:hidden"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border text-center border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{data.totalReferrals}</span>
            <span className="text-sm text-gray-500 font-medium">Friends Invited</span>
          </div>
          <div className="bg-white border text-center border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-green-600">{data.totalEarned.toLocaleString()}</span>
            <span className="text-sm text-gray-500 font-medium">Earned ({data.currency})</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-gray-100 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-50 border-2 border-white shadow-sm text-gray-600 rounded-full flex items-center justify-center text-lg font-bold mb-3">1</div>
            <h4 className="font-semibold text-gray-800 mb-1">Send Invitation</h4>
            <p className="text-sm text-gray-500 max-w-xs">Send your referral link to friends, colleagues, or clients.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-50 border-2 border-white shadow-sm text-gray-600 rounded-full flex items-center justify-center text-lg font-bold mb-3">2</div>
            <h4 className="font-semibold text-gray-800 mb-1">Registration</h4>
            <p className="text-sm text-gray-500 max-w-xs">Your friend creates a verified account using your unique link.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 border-2 border-white shadow-sm text-green-600 rounded-full flex items-center justify-center text-lg font-bold mb-3">3</div>
            <h4 className="font-semibold text-gray-800 mb-1">Get Rewarded</h4>
            <p className="text-sm text-gray-500 max-w-xs">Once they complete their first gig or purchase, you both get a bonus.</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white border border-gray-200 rounded-2xl p-0 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Referral History
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No referrals yet. Share your link to get started!
                  </td>
                </tr>
              ) : (
                data.history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.user}</td>
                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {item.status === 'completed' ? `+${item.reward.toLocaleString()} ${data.currency}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
