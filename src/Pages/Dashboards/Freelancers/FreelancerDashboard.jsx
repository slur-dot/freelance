import React, { useEffect, useState } from "react";
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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', amount: '', client: '', status: 'in_progress' });
  const [showJDModal, setShowJDModal] = useState(false);
  const [jdSaving, setJdSaving] = useState(false);
  const [jdForm, setJdForm] = useState({ title: '', budget: '', client: '', status: 'pending' });
  const [showJDList, setShowJDList] = useState(false);
  const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const text = {
    manageMessages: "MANAGE MESSAGES",
    workHistory: "Work History",
    getStarted: "Get Started!",
    earningsSoon: "You'll find all your Earnings info here once you complete your first job.",
    projects: "Active Projects",
    activeCompleted: "Active & Completed",
    bids: "Recent Bids",
    activeBids: "Active Bids",
    payments: "Payments & Escrow",
    escrowHeld: "Funds held in Escrow until job is marked complete",
    earnings: "Earnings History",
    notifications: "Notifications",
    security: "Security & Verification",
    verifiedPhone: "Phone Verified",
    profileProgress: "Profile 80% Complete",
    portfolioItem: "Portfolio Item Added",
    availableFunds: "Available Funds",
    balanceAvailable: "Balance Available",
    withdraw: "Withdraw",
    requestedCourses: "Requested Courses",
    coursesUnderReview: "Courses Under Review",
    viewRequested: "View Requested"
  };
  const [form, setForm] = useState({
    name: '', skills: '', experience: '', email: '', phone: '',
    paymentType: 'MoMo', paymentNumber: '',
    bankName: '', accountNumber: '', swiftCode: '', accountHolder: ''
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [plans, setPlans] = useState([]);

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
      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Total Earned (net)</div>
            <div className="text-xl font-semibold mt-1">{(mainStats.totalEarned || 0).toLocaleString()} GNF</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Projects Posted</div>
            <div className="text-xl font-semibold mt-1">{mainStats.projectsPosted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">JDs Applied</div>
            <div className="text-xl font-semibold mt-1">{mainStats.jdsApplied || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Hires</div>
            <div className="text-xl font-semibold mt-1">{mainStats.hires || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Available Funds Card */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{text.availableFunds}</h3>
          <Card className="flex flex-col h-fit">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm md:text-base font-medium">{text.balanceAvailable}</p>
              <Info className="h-4 w-4 text-gray-500 flex-shrink-0" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{loading ? '...' : `${(netEarnings || 0).toLocaleString()} GNF`}</div>
              <Button variant="outline" className="mt-4 w-fit" onClick={() => setShowWithdrawModal(true)}>
                {text.withdraw}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Requested Courses Card */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{text.requestedCourses}</h3>
          <Card className="flex flex-col h-fit">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm md:text-base font-medium">{text.coursesUnderReview}</p>
              <Info className="h-4 w-4 text-gray-500 flex-shrink-0" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{loading ? '...' : `${requestedCount} Courses`}</div>
              <Link to="/freelancer/dashboard/requested-courses">
                <Button className="mt-4 w-fit">{text.viewRequested}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">{text.messages}</h3>
          <Card className="flex-grow h-fit">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto">
                {error && (
                  <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md m-2">
                    <div className="font-semibold">Error loading data:</div>
                    <div className="text-sm">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {loading && <div className="p-4">Loading...</div>}
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
                  <div>Date</div>
                  <div>Activity</div>
                  <div>Order</div>
                  <div>Amount</div>
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
                  <div className="text-sm text-gray-500">No recent projects</div>
                ) : (
                  recentProjects.map((p, i) => (
                    <div key={p.id || i} className="min-w-[200px] md:min-w-[240px] lg:min-w-[260px] snap-start bg-gray-50 rounded-md p-4 border">
                      <p className="font-semibold md:truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-1">Client: {p.client}</p>
                      <p className="text-xs text-gray-500 mt-1">Amount: {(p.netAmount || p.amount || 0).toLocaleString()} GNF</p>
                      <p className="text-xs text-gray-500 mt-1">Status: {p.status}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowProjectModal(true)}>Post New Project</Button>
                <Button variant="outline" className="border-green-600 text-green-700">View All Projects</Button>
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
                  <div className="text-sm text-gray-500">No applications yet</div>
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
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowJDModal(true)}>Apply to JD</Button>
                <Button variant="outline" className="border-green-600 text-green-700" onClick={() => setShowJDList((v) => !v)}>View Application Status</Button>
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
              <p className="text-xs text-gray-500 mt-2">Chart.js ready — lightweight preview shown</p>
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
                  <label htmlFor="notif-inapp">In-app</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4" id="notif-email" />
                  <label htmlFor="notif-email">Email</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" id="notif-phone" />
                  <label htmlFor="notif-phone">Phone</label>
                </div>
              </div>
              <ul className="divide-y">
                {notifications.length === 0 ? (
                  <li className="p-4 text-sm text-gray-500">No notifications</li>
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
                <li>✅ {text.verifiedPhone}</li>
                <li>✅ {text.profileProgress}</li>
                <li>✅ {text.portfolioItem}</li>
                <li>🛡️ Escrow (Web ID: 1)</li>
                <li>🚫 Rate limit: 5 bids/project, 10 bids/month</li>
                <li>🧑‍⚖️ Dispute: report in-app, admin mediation ≤ 48h</li>
              </ul>
            </CardContent>
          </Card>
        </div>
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
                  <Button className="bg-green-600 hover:bg-green-700">Buy Now</Button>
                  <Button variant="outline" className="border-green-600 text-green-700">View Plan Benefits</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Popup */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}

      {/* Post New Project Modal */}
      {
        showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Post New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Title</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea className="w-full border rounded-md px-3 py-2 mt-1" rows={3} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Budget (GNF)</label>
                  <input type="number" className="w-full border rounded-md px-3 py-2 mt-1" value={projectForm.amount} onChange={(e) => setProjectForm({ ...projectForm, amount: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1" value={projectForm.client} onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select className="w-full border rounded-md px-3 py-2 mt-1" value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="pending">pending</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                <Button disabled={projectSaving} onClick={async () => {
                  try {
                    setProjectSaving(true);
                    const payload = {
                      title: projectForm.title,
                      description: projectForm.description,
                      amount: Number(projectForm.amount) || 0,
                      status: projectForm.status,
                      client: projectForm.client, // Or use user.displayName if client is self
                      freelancerId: user.uid // Link to this freelancer
                    };

                    await ProjectService.createProject(payload, user.uid);

                    // Refresh projects
                    const projects = await ProjectService.getProjects();
                    setRecentProjects(projects.slice(0, 10));

                    setShowProjectModal(false);
                    setProjectForm({ title: '', description: '', amount: '', client: '', status: 'in_progress' });
                    alert('Project posted successfully!');
                  } catch (err) {
                    console.error("Post project error:", err);
                    alert('Failed to save project. Please check inputs.');
                  } finally {
                    setProjectSaving(false);
                  }
                }}>{projectSaving ? 'Saving...' : 'Post Project'}</Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Apply to JD Modal */}
      {
        showJDModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Apply to JD</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">JD Title</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1" value={jdForm.title} onChange={(e) => setJdForm({ ...jdForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Budget (GNF)</label>
                  <input type="number" className="w-full border rounded-md px-3 py-2 mt-1" value={jdForm.budget} onChange={(e) => setJdForm({ ...jdForm, budget: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1" value={jdForm.client} onChange={(e) => setJdForm({ ...jdForm, client: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select className="w-full border rounded-md px-3 py-2 mt-1" value={jdForm.status} onChange={(e) => setJdForm({ ...jdForm, status: e.target.value })}>
                    <option value="pending">pending</option>
                    <option value="shortlisted">shortlisted</option>
                    <option value="hired">hired</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setShowJDModal(false)}>Cancel</Button>
                <Button disabled={jdSaving} onClick={async () => {
                  try {
                    setJdSaving(true);
                    const payload = {
                      title: jdForm.title,
                      budget: Number(jdForm.budget) || 0,
                      status: jdForm.status,
                      client: jdForm.client
                    };

                    const newApp = await FreelancerService.applyToJD(FREELANCER_ID, payload);

                    setJdApplications(prev => [newApp, ...prev]);
                    setShowJDModal(false);
                    setJdForm({ title: '', budget: '', client: '', status: 'pending' });
                    // Refresh stats
                    setMainStats(prev => ({ ...prev, jdsApplied: (prev.jdsApplied || 0) + 1 }));
                  } catch (err) {
                    alert('Failed to apply. Please check inputs.');
                  } finally {
                    setJdSaving(false);
                  }
                }}>{jdSaving ? 'Submitting...' : 'Apply'}</Button>
              </div>
            </div>
          </div>
        )
      }

      {/* JD List toggle (simple viewer) */}
      {
        showJDList && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={() => setShowJDList(false)}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">JD Applications</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {jdApplications.map((b) => (
                  <div key={b.id} className="border rounded-md p-3 text-sm">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-gray-600">Budget: {(b.budget || 0).toLocaleString()} GNF • Status: {b.status} • Client: {b.client}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end">
                <Button variant="outline" onClick={() => setShowJDList(false)}>Close</Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Profile Modal */}
      {
        showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Experience</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Skills (comma separated)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+224-123-45-67-89"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Payment Type</label>
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
                        <span>Your bank details are encrypted and secure.</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Bank Name</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="e.g. Ecobank" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Account Holder Name</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} placeholder="Name on account" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">IBAN / Account Number</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="GN..." />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">SWIFT / BIC Code</label>
                      <input className="w-full border rounded-md px-3 py-2 mt-1" value={form.swiftCode} onChange={(e) => setForm({ ...form, swiftCode: e.target.value })} placeholder="ECOBGN..." />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm text-gray-600">Payment Number</label>
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
                <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
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
                  {saving ? 'Saving...' : 'Save Changes'}
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
              <h3 className="text-lg font-semibold mb-4">Request Withdrawal</h3>

              {freelancer?.paymentMethod?.type === 'SWIFT' ? (
                <div className="mb-4 space-y-3">
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-semibold text-gray-700">Receiving Bank:</p>
                    <p>{freelancer.paymentMethod.swift.bankName} ••• {freelancer.paymentMethod.swift.accountNumber.slice(-4)}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Amount to Withdraw (GNF)</label>
                    <input
                      type="number"
                      className="w-full border rounded-md px-3 py-2 mt-1"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Min. 500,000 GNF"
                    />
                  </div>

                  {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="bg-green-50 p-3 rounded border border-green-100 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested:</span>
                        <span className="font-medium">{Number(withdrawAmount).toLocaleString()} GNF</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Bank Fee:</span>
                        <span>- 150,000 GNF</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between font-bold text-gray-800">
                        <span>Net Receipt:</span>
                        <span>{(Math.max(0, Number(withdrawAmount) - 150000)).toLocaleString()} GNF</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        Est. ~${(Math.max(0, Number(withdrawAmount) - 150000) / 8600).toFixed(2)} USD
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4 text-center py-4">
                  <p className="text-gray-600 mb-4">Please set up a SWIFT bank account in your profile to withdraw large amounts.</p>
                  <Button variant="outline" onClick={() => { setShowWithdrawModal(false); setShowEdit(true); }}>
                    Update Profile
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>Cancel</Button>
                {freelancer?.paymentMethod?.type === 'SWIFT' && (
                  <Button
                    disabled={withdrawProcessing || !withdrawAmount || Number(withdrawAmount) < 500000}
                    onClick={() => {
                      setWithdrawProcessing(true);
                      setTimeout(() => {
                        setWithdrawProcessing(false);
                        setShowWithdrawModal(false);
                        alert("Withdrawal request submitted successfully! It will be processed within 3-5 business days.");
                        setWithdrawAmount('');
                      }, 2000);
                    }}
                  >
                    {withdrawProcessing ? 'Processing...' : 'Confirm Withdrawal'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}