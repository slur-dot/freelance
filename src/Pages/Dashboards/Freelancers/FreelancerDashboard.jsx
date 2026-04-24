import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, Upload, Loader2, Landmark, DollarSign, Lock } from "lucide-react";
import { storage, auth } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AlexandraImg from "../../../assets/Alexandra.png";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import { Link } from "react-router-dom";
import { UserService } from "../../../services/userService";
import { ProjectService } from "../../../services/projectService";
import { FreelancerService } from "../../../services/freelancerService";

// Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
    variant === "outline"
      ? "border border-gray-300 text-gray-500 bg-transparent"
      : variant === "ghost"
        ? "text-black"
        : "bg-green-600 hover:bg-green-700 text-white";
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium ${baseStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Components
function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// Avatar Components
function Avatar({ children, className = "" }) {
  return <div className={`h-10 w-10 rounded-full overflow-hidden ${className}`}>{children}</div>;
}

function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export default function FreelancerDashboard() {
  const { t } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const FREELANCER_ID = user?.uid;

  const [requestedCount, setRequestedCount] = useState(0);
  const [netEarnings, setNetEarnings] = useState(0);
  const [messages, setMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [jdApplications, setJdApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [mainStats, setMainStats] = useState({ totalEarned: 0, projectsPosted: 0, jdsApplied: 0, hires: 0 });
  const [freelancer, setFreelancer] = useState(null);
  const [plan, setPlan] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const text = {
    manageMessages: t('freelancer_dashboard.messages.manage'),
    workHistory: t('freelancer_dashboard.work_history.title'),
    getStarted: t('freelancer_dashboard.work_history.get_started'),
    earningsSoon: t('freelancer_dashboard.work_history.earnings_soon'),
    projects: t('freelancer_dashboard.projects.title'),
    activeCompleted: t('freelancer_dashboard.projects.subtitle'),
    bids: t('freelancer_dashboard.bids.title'),
    activeBids: t('freelancer_dashboard.bids.subtitle'),
    payments: t('freelancer_dashboard.payments.title'),
    escrowHeld: t('freelancer_dashboard.payments.escrow_held'),
    earnings: t('freelancer_dashboard.earnings.title'),
    notifications: t('freelancer_dashboard.notifications.title'),
    security: t('freelancer_dashboard.security.title'),
    verifiedPhone: t('freelancer_dashboard.security.verified_phone'),
    profileProgress: t('freelancer_dashboard.security.profile_progress'),
    portfolioItem: t('freelancer_dashboard.security.portfolio_item'),
    availableFunds: t('freelancer_dashboard.funds.title'),
    balanceAvailable: t('freelancer_dashboard.funds.balance_available'),
    withdraw: t('freelancer_dashboard.funds.withdraw'),
    requestedCourses: t('freelancer_dashboard.courses.title'),
    coursesUnderReview: t('freelancer_dashboard.courses.under_review'),
    viewRequested: t('freelancer_dashboard.courses.view_requested')
  };
  const [form, setForm] = useState({
    name: '', skills: '', experience: '', email: '', phone: '',
    paymentType: 'MoMo', paymentNumber: '',
    bankName: '', accountNumber: '', swiftCode: '', accountHolder: ''
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [plans, setPlans] = useState([]);

  // Trainer / Course Upload State
  const [isTrainer, setIsTrainer] = useState(false); // Mock value for now
  const [requestedTrainer, setRequestedTrainer] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', category: '', description: '', price: '', videoUrl: '' });

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
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        // 1. Fetch User Profile
        const profile = await UserService.getUserProfile(user.uid);

        if (profile) {
          // Ensure profile has _docId for legacy compat if needed, or just use user.uid
          const profileWithId = { ...profile, _docId: user.uid };
          setFreelancer(profileWithId);

          // Set form data
          setForm({
            name: profile.name || '',
            skills: (profile.skills || []).join(', '),
            experience: profile.experience || '',
            email: profile.email || '',
            phone: profile.phone || '',
            paymentType: profile.paymentMethod?.type || 'MoMo',
            paymentNumber: profile.paymentMethod?.number || '',
            bankName: profile.paymentMethod?.swift?.bankName || '',
            accountNumber: profile.paymentMethod?.swift?.accountNumber || '',
            swiftCode: profile.paymentMethod?.swift?.swiftCode || '',
            accountHolder: profile.paymentMethod?.swift?.accountHolder || ''
          });

          // Fetch other data in parallel
          const [requested, apps, notificationsData] = await Promise.all([
            FreelancerService.getRequestedCourses(user.uid),
            FreelancerService.getJDApplications(user.uid),
            FreelancerService.getNotifications(user.uid)
          ]);

          setRequestedCount(requested.length);
          setNetEarnings(profile.balance || 0); // Assuming balance is in profile
          setJdApplications(apps);
          setNotifications(notificationsData);
          setMessages([]); // TODO: ChatService.getMessages?
          setSubscription({ plan: profile.plan || 'basic' });
          setMainStats({
            totalEarned: profile.totalEarned || 0,
            projectsPosted: 0,
            jdsApplied: apps.length,
            hires: 0
          });
        } else {
          // Handle case where profile doesn't exist (shouldn't happen if logged in correctly)
          console.warn("Profile not found");
        }

        // 2. Fetch Projects (e.g., all available projects or recommended)
        const projects = await ProjectService.getProjects();
        setRecentProjects(projects.slice(0, 10));

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB');
      return;
    }
    if (!freelancer?._docId) {
      alert('Freelancer record not loaded yet');
      return;
    }
    try {
      setUploading(true);
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const fileName = `freelancer-avatars/${user.uid}/avatar-${timestamp}.${ext}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await UserService.updateUserProfile(user.uid, { avatar: downloadURL });

      setFreelancer((prev) => prev ? { ...prev, avatar: downloadURL } : prev);
      alert('Avatar updated successfully!');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const ok = confirm('Are you sure you want to delete this account? This cannot be undone.');
    if (!ok) return;
    try {
      // In a real app, you might want to call a Cloud Function to clean up Auth + Firestore
      // For now, we will just try to delete the firestore doc. Auth deletion requires re-authentication usually.
      // await UserService.deleteUserProfile(user.uid); // Assuming method exists or use deleteDoc
      alert("Please contact support to delete your account completely.");
    } catch (err) {
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Quick Management Hub - New Prominent Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold">{t('freelancer_dashboard.welcome', 'Welcome back,')} {freelancer?.name || user?.displayName}!</h2>
              <p className="text-blue-100 font-medium">{t('freelancer_dashboard.hub_desc', 'Manage your services and track global progress from your centralized work hub.')}</p>
           </div>
           <div className="flex flex-wrap justify-center gap-4">
              <Link to="/freelancer/dashboard/work-management" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95">
                 {t('freelancer_dashboard.go_to_hub', 'Manage Work & Services')}
              </Link>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Funds Card - Prominently at top */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col h-full bg-gradient-to-br from-green-50 to-white border-green-100 border-2">
            <div className="flex flex-row items-center justify-between p-5 pb-2">
              <h3 className="text-lg font-bold text-gray-800">{text.availableFunds}</h3>
              <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow p-5 pt-2">
              <p className="text-sm text-gray-500 mb-1">{text.balanceAvailable}</p>
              <div className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
                {loading ? '...' : `${(netEarnings || 0).toLocaleString()} GNF`}
              </div>
              <Button className="mt-6 w-full text-md py-3 shadow-md bg-green-600 hover:bg-green-700" onClick={() => setShowWithdrawModal(true)}>
                <DollarSign className="w-5 h-5 mr-2 inline" />
                {text.withdraw}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">{t('freelancer_dashboard.stats.total_earned')}</div>
            <div className="text-xl font-semibold mt-1">{(mainStats.totalEarned || 0).toLocaleString()} GNF</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">{t('freelancer_dashboard.stats.projects_posted')}</div>
            <div className="text-xl font-semibold mt-1">{mainStats.projectsPosted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">{t('freelancer_dashboard.stats.jds_applied')}</div>
            <div className="text-xl font-semibold mt-1">{mainStats.jdsApplied || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">{t('freelancer_dashboard.stats.hires')}</div>
            <div className="text-xl font-semibold mt-1">{mainStats.hires || 0}</div>
          </CardContent>
        </Card>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Messages Section */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">{t('freelancer_dashboard.messages.title')}</h3>
          <Card className="flex-grow h-fit">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto">
                {error && (
                  <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md m-2">
                    <div className="font-semibold">{t('freelancer_dashboard.messages.error')}</div>
                    <div className="text-sm">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      {t('freelancer_dashboard.messages.retry')}
                    </button>
                  </div>
                )}
                {loading && <div className="p-4">{t('freelancer_dashboard.messages.loading')}</div>}
                {!loading && messages.map((m, i) => (
                  <div key={m.id || i} className="flex items-center gap-3 p-4 border-b last:border-b-0">
                    <Avatar>
                      <AvatarImage src={AlexandraImg} alt="Message" />
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold md:truncate">{m.from}</p>
                      <p className="text-sm text-gray-500 md:truncate">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowChatWidget(true)}
                >
                  {text.manageMessages}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work History Section */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold my-5">{text.workHistory}</h3>
          <Card className="flex-grow h-fit">
            <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-full text-left mb-4 bg-gray-50 overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 border-b pb-2 p-4 border-gray-100 min-w-[400px]">
                  <div>{t('freelancer_dashboard.work_history.date')}</div>
                  <div>{t('freelancer_dashboard.work_history.activity')}</div>
                  <div>{t('freelancer_dashboard.work_history.order')}</div>
                  <div>{t('freelancer_dashboard.work_history.amount')}</div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-grow">
                <h4 className="text-lg sm:text-xl font-bold mb-2">{text.getStarted}</h4>
                <p className="text-gray-500">{text.earningsSoon}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        {/* Projects (swipeable list) */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">{text.projects} <span className="text-gray-500 text-sm">— {text.activeCompleted}</span></h3>
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                {recentProjects.length === 0 ? (
                  <div className="text-sm text-gray-500">{t('freelancer_dashboard.projects.no_recent')}</div>
                ) : (
                  recentProjects.map((p, i) => (
                    <div key={p.id || i} className="min-w-[200px] md:min-w-[240px] lg:min-w-[260px] snap-start bg-gray-50 rounded-md p-4 border">
                      <p className="font-semibold md:truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('freelancer_dashboard.projects.client')}: {p.client}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('freelancer_dashboard.projects.amount')}: {(p.netAmount || p.amount || 0).toLocaleString()} GNF</p>
                      <p className="text-xs text-gray-500 mt-1">{t('freelancer_dashboard.projects.status')}: {p.status}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link to="/freelancer/dashboard/work-management">
                  <Button className="bg-blue-600 hover:bg-blue-700">{t('freelancer_dashboard.projects.post_new', 'Post & Manage')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bids (swipeable) */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{text.bids} <span className="text-gray-500 text-sm">— {text.activeBids}</span></h3>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {jdApplications.length === 0 ? (
                  <div className="text-sm text-gray-500">{t('freelancer_dashboard.bids.no_applications')}</div>
                ) : (
                  jdApplications.map((b, i) => (
                    <div key={b.id || i} className="flex items-center justify-between border rounded-md p-3">
                      <div className="min-w-0">
                        <p className="font-medium md:truncate">{b.title}</p>
                        <p className="text-xs text-gray-500">{(b.budget || 0).toLocaleString()} GNF • {b.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link to="/freelancer/dashboard/work-management">
                  <Button className="bg-blue-600 hover:bg-blue-700">{t('freelancer_dashboard.bids.view_status', 'Manage Applications')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        {/* Payments & Escrow */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">{text.payments}</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-3">{text.escrowHeld} (Web ID: 1)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { method: "Orange Money", ref: "OM-2024-0912", amount: "350,000 GNF", status: "Completed" },
                  { method: "MTN Mobile Money", ref: "MTN-2024-0910", amount: "120,000 GNF", status: "Escrow" },
                ].map((p, i) => (
                  <div key={i} className="border rounded-md p-3 bg-gray-50">
                    <p className="font-medium">{p.method}</p>
                    <p className="text-xs text-gray-500">{p.ref} • {p.status}</p>
                    <p className="text-sm mt-1">{p.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart (lightweight placeholder) */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{text.earnings}</h3>
          <Card>
            <CardContent className="p-4">
              <div className="h-36 flex items-end gap-2">
                {[40, 60, 30, 70, 50, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-green-600/20 rounded-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{t('freelancer_dashboard.earnings.chart_preview')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        {/* Notifications */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">{text.notifications}</h3>
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4" id="notif-inapp" />
                  <label htmlFor="notif-inapp">{t('freelancer_dashboard.notifications.in_app')}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4" id="notif-email" />
                  <label htmlFor="notif-email">{t('freelancer_dashboard.notifications.email')}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" id="notif-phone" />
                  <label htmlFor="notif-phone">{t('freelancer_dashboard.notifications.phone')}</label>
                </div>
              </div>
              <ul className="divide-y">
                {notifications.length === 0 ? (
                  <li className="p-4 text-sm text-gray-500">{t('freelancer_dashboard.notifications.none')}</li>
                ) : (
                  notifications.map((n, i) => (
                    <li key={n.id || i} className="p-4 text-sm">
                      <span className="font-medium">{n.title}</span>: {n.message}
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security & Verification */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{text.security}</h3>
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2 text-sm">
                <li>✅ {t('freelancer_dashboard.security.verified_phone')}</li>
                <li>✅ {t('freelancer_dashboard.security.profile_progress')}</li>
                <li>✅ {t('freelancer_dashboard.security.portfolio_item')}</li>
                <li>🛡️ {t('freelancer_dashboard.security.escrow')}</li>
                <li>🚫 {t('freelancer_dashboard.security.rate_limit')}</li>
                <li>🧑‍⚖️ {t('freelancer_dashboard.security.dispute')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trainer Hub */}
      <div className="max-w-7xl mx-auto mt-6">
        <h3 className="text-lg font-semibold mb-2">{t('freelancer_dashboard.trainer.title', 'Trainer Hub')}</h3>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            {!isTrainer ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">{t('freelancer_dashboard.trainer.become', 'Become a Trainer')}</h4>
                  <p className="text-gray-600 mt-1 max-w-2xl">{t('freelancer_dashboard.trainer.desc', 'Share your expertise with the community. Apply to become a certified trainer and start uploading your courses.')}</p>
                </div>
                <Button 
                  onClick={() => {
                    setRequestedTrainer(true);
                    alert(t('freelancer_dashboard.trainer.requested', 'Trainer request submitted successfully! We will review your profile.'));
                  }} 
                  className={requestedTrainer ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  disabled={requestedTrainer}
                >
                  {requestedTrainer ? t('freelancer_dashboard.trainer.pending', 'Request Pending Review') : t('freelancer_dashboard.trainer.request_btn', 'Request Trainer Status')}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold text-blue-700">{t('freelancer_dashboard.trainer.welcome', 'Welcome, Trainer!')}</h4>
                  <p className="text-gray-600 mt-1">{t('freelancer_dashboard.trainer.upload_desc', 'You have trainer privileges. Upload and manage your courses here.')}</p>
                </div>
                <Button 
                  onClick={() => setShowCourseModal(true)} 
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {t('freelancer_dashboard.trainer.upload_btn', 'Upload New Course')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plans (from backend subscription) */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(plans && plans.length ? plans : []).map((plan) => (
            <Card key={plan.key} className={`border ${subscription?.plan === plan.key ? 'border-green-400' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.title || plan.key}</h3>
                  {subscription?.plan === plan.key && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Current</span>
                  )}
                </div>
                <div className="text-sm text-gray-700 mt-1">{plan.price}</div>
                <p className="text-sm text-gray-600 mt-2">{plan.desc}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button className="bg-green-600 hover:bg-green-700">{t('freelancer_dashboard.plans.buy_now')}</Button>
                  <Button variant="outline" className="border-green-600 text-green-700">{t('freelancer_dashboard.plans.view_benefits')}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Popup */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}

      {/* Edit Profile Modal */}
      {
        showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{t('freelancer_dashboard.modals.edit_profile.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.name')}</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.experience')}</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.skills')}</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.email')}</label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.phone')}</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+224-123-45-67-89"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.payment_type')}</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.paymentType}
                    onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  >
                    <option value="OM">OM</option>
                    <option value="MoMo">MoMo</option>
                    <option value="SWIFT">Bank Transfer (SWIFT)</option>
                  </select>
                </div>

                {form.paymentType === 'SWIFT' ? (
                  <>
                    <div className="md:col-span-2">
                      <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-2 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>{t('freelancer_dashboard.modals.edit_profile.form.secure_msg')}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.bank_name')}</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="e.g. Ecobank" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.account_holder')}</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} placeholder="Name on account" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.account_number')}</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="GN..." />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.swift_code')}</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.swiftCode} onChange={(e) => setForm({ ...form, swiftCode: e.target.value })} placeholder="ECOBGN..." />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.edit_profile.form.payment_number')}</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 mt-1"
                      value={form.paymentNumber}
                      onChange={(e) => setForm({ ...form, paymentNumber: e.target.value })}
                      placeholder="+224-123-45-67-89"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEdit(false)}>{t('freelancer_dashboard.modals.edit_profile.cancel')}</Button>
                <Button
                  disabled={saving}
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setSaving(true);

                      // Helper: Simple formatter or just basic cleanup
                      const updatedData = {
                        name: form.name,
                        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                        experience: form.experience,
                        email: form.email,
                        phone: form.phone,
                        paymentMethod: {
                          type: form.paymentType,
                          number: form.paymentType !== 'SWIFT' ? form.paymentNumber : null,
                          swift: form.paymentType === 'SWIFT' ? {
                            bankName: form.bankName,
                            accountNumber: form.accountNumber,
                            swiftCode: form.swiftCode,
                            accountHolder: form.accountHolder
                          } : null
                        }
                      };

                      await UserService.updateUserProfile(user.uid, updatedData);

                      // Update local state
                      setFreelancer(prev => ({ ...prev, ...updatedData }));
                      setShowEdit(false);
                      alert('Profile updated successfully');
                    } catch (err) {
                      console.error("Profile update error:", err);
                      alert('Failed to update profile. Please try again.');
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? t('freelancer_dashboard.modals.edit_profile.saving') : t('freelancer_dashboard.modals.edit_profile.save')}
                </Button>
              </div>
            </div>
          </div>
        )
      }
      {/* Withdrawal Modal */}
      {
        showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">{t('freelancer_dashboard.modals.withdrawal.title')}</h3>

              {freelancer?.paymentMethod?.type === 'SWIFT' ? (
                <div className="mb-4 space-y-3">
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-semibold text-gray-700">{t('freelancer_dashboard.modals.withdrawal.receiving_bank')}</p>
                    <p>{freelancer.paymentMethod.swift.bankName} ••• {freelancer.paymentMethod.swift.accountNumber.slice(-4)}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">{t('freelancer_dashboard.modals.withdrawal.amount_label')}</label>
                    <input
                      type="number"
                      className="w-full border rounded-md px-3 py-2 mt-1"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={t('freelancer_dashboard.modals.withdrawal.min_amount')}
                    />
                  </div>

                  {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="bg-green-50 p-3 rounded border border-green-100 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('freelancer_dashboard.modals.withdrawal.requested')}</span>
                        <span className="font-medium">{Number(withdrawAmount).toLocaleString()} GNF</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>{t('freelancer_dashboard.modals.withdrawal.bank_fee')}</span>
                        <span>- 150,000 GNF</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between font-bold text-gray-800">
                        <span>{t('freelancer_dashboard.modals.withdrawal.net_receipt')}</span>
                        <span>{(Math.max(0, Number(withdrawAmount) - 150000)).toLocaleString()} GNF</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {t('freelancer_dashboard.modals.withdrawal.est_usd')} {(Math.max(0, Number(withdrawAmount) - 150000) / 8600).toFixed(2)} USD
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4 text-center py-4">
                  <p className="text-gray-600 mb-4">{t('freelancer_dashboard.modals.withdrawal.setup_swift')}</p>
                  <Button variant="outline" onClick={() => { setShowWithdrawModal(false); setShowEdit(true); }}>
                    {t('freelancer_dashboard.modals.withdrawal.update_profile')}
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>{t('freelancer_dashboard.modals.withdrawal.cancel')}</Button>
                {freelancer?.paymentMethod?.type === 'SWIFT' && (
                  <Button
                    disabled={withdrawProcessing || !withdrawAmount || Number(withdrawAmount) < 500000}
                    onClick={() => {
                      setWithdrawProcessing(true);
                      setTimeout(() => {
                        setWithdrawProcessing(false);
                        setShowWithdrawModal(false);
                        alert(t('freelancer_dashboard.modals.withdrawal.success_alert'));
                        setWithdrawAmount('');
                      }, 2000);
                    }}
                  >
                    {withdrawProcessing ? t('freelancer_dashboard.modals.withdrawal.processing') : t('freelancer_dashboard.modals.withdrawal.confirm')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Course Upload Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">{t('freelancer_dashboard.trainer.upload_course_title', 'Upload New Course')}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('freelancer_dashboard.trainer.course_title', 'Course Title')}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    placeholder="e.g. Advanced React Development"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('freelancer_dashboard.trainer.category', 'Category')}</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                    >
                      <option value="">Select a category</option>
                      <option value="development">Web Development</option>
                      <option value="design">Design & UI/UX</option>
                      <option value="business">Business & Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('freelancer_dashboard.trainer.price', 'Price (GNF)')}</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                      placeholder="e.g. 500000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('freelancer_dashboard.trainer.description', 'Course Description')}</label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" 
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    placeholder="Describe what students will learn..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('freelancer_dashboard.trainer.video', 'Upload Video')}</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 500MB</p>
                    <input type="file" className="hidden" accept="video/*" id="video-upload" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowCourseModal(false)} className="px-6 border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
              <Button className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md" onClick={() => {
                alert(t('freelancer_dashboard.trainer.upload_success', 'Course uploaded successfully!'));
                setShowCourseModal(false);
                setCourseForm({ title: '', category: '', description: '', price: '', videoUrl: '' });
              }}>
                {t('freelancer_dashboard.trainer.submit_course', 'Submit Course')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}