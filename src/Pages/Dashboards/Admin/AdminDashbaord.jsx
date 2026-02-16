import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Upload } from "lucide-react";
import AlexandraImg from "../../../assets/Alexandra.png";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { db, auth, storage } from "../../../firebaseConfig";
import { collection, getCountFromServer, query, where, getDocs, limit, orderBy, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  // ... no change ...
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

// ✅ Card Components
function Card({ children, className = "", onClick, ...props }) {
  return <div className={`bg-white shadow rounded-lg ${className}`} onClick={onClick} {...props}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// ✅ Avatar Components
function Avatar({ children, className = "" }) {
  return <div className={`h-10 w-10 rounded-full overflow-hidden ${className}`}>{children}</div>;
}
function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

// ✅ Admin Profile Component
function AdminProfile() {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Load current avatar
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().profileImage) {
          setAvatar(userDoc.data().profileImage);
        } else if (user.photoURL) {
          setAvatar(user.photoURL);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) {
      alert("You must be logged in to upload.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("Please upload an image smaller than 2MB");
      return;
    }

    try {
      setLoading(true);
      const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        profileImage: downloadURL
      });

      setAvatar(downloadURL);
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center gap-6 max-w-7xl mx-auto">
      {/* Avatar Upload */}
      <div className="relative">
        <img
          src={avatar || "/default-avatar.png"}
          alt="Admin Avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <label className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer ${loading ? 'bg-gray-400' : 'bg-green-600'}`}>
          <Upload className="h-4 w-4 text-white" />
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
        </label>
      </div>

      {/* Profile Info */}
      <div>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <p className="text-green-600 font-semibold">Role: Administration</p>
        <p className="text-gray-600">User: {currentUser?.email}</p>
      </div>
    </div>
  );
}

// ✅ Tabs Component
function Tabs({ active, setActive }) {
  const tabs = ["Utilisateurs", "Modération", "Statistiques", "Notifications"];
  return (
    <div className="flex gap-4 border-b max-w-7xl mx-auto mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 font-medium ${active === tab ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ✅ Analytics Component
function Analytics() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "User Growth",
        data: [50, 80, 150, 200, 300],
        borderColor: "rgb(34,197,94)",
        fill: false,
      },
      {
        label: "Transactions",
        data: [20, 40, 90, 120, 250],
        borderColor: "rgb(59,130,246)",
        fill: false,
      },
    ],
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
      <Line data={data} />
    </Card>
  );
}

// Imports moved to top
// import { db } from "../../../firebaseConfig";
// import { collection, getCountFromServer, query, where, getDocs, limit, orderBy } from "firebase/firestore";
// import ChatService from "../../../services/chatService";

// ✅ Main Dashboard
export default function AdminDashboard() {
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [activeTab, setActiveTab] = useState("Utilisateurs");
  const [dashboardData, setDashboardData] = useState({
    totalCompanies: 0,
    totalCourses: 0,
    totalProducts: 0,
    totalTickets: 0,
    totalBookings: 0,
    totalTrainingRequests: 0,
    totalAdvertisements: 0,
    totalSellers: 0,
    totalFreelancers: 0,
    totalRevenue: 0
  });
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch Counts using Firestore Aggregation
      // 1. Total Companies (Role: Company)
      const companiesQuery = query(collection(db, "users"), where("role", "in", ["Company", "company"]));
      const companiesSnap = await getCountFromServer(companiesQuery);

      const productsSnap = await getCountFromServer(collection(db, "products"));
      const ordersSnap = await getCountFromServer(collection(db, "orders"));

      // 2. Active Freelancers
      const freelancersQuery = query(collection(db, "users"), where("role", "in", ["freelancer", "Freelancer"]));
      const freelancersSnap = await getCountFromServer(freelancersQuery);

      // 3. Active Sellers
      const sellersQuery = query(collection(db, "users"), where("role", "in", ["seller", "Seller"]));
      const sellersSnap = await getCountFromServer(sellersQuery);

      // Fetch Total Revenue from Orders (sum of totalAmount)
      const ordersQuery = query(collection(db, "orders"));
      const ordersDocsSnap = await getDocs(ordersQuery);
      const totalRev = ordersDocsSnap.docs.reduce((acc, doc) => acc + (parseFloat(doc.data().totalAmount) || 0), 0);

      // Fetch recent messages/chats
      const chatQuery = query(collection(db, "chatSessions"), orderBy("lastMessageAt", "desc"), limit(5));
      const chatSnap = await getDocs(chatQuery);
      const chats = chatSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setDashboardData({
        totalCompanies: companiesSnap.data().count,
        totalProducts: productsSnap.data().count,
        totalBookings: ordersSnap.data().count,
        totalFreelancers: freelancersSnap.data().count,
        totalSellers: sellersSnap.data().count,
        totalRevenue: totalRev,
        totalCourses: 0,
        totalTickets: 0,
        totalTrainingRequests: 0,
        totalAdvertisements: 0
      });

      setRecentChats(chats);

    } catch (e) {
      console.error("Dashboard data fetch error:", e);
      setError("Failed to load real data from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        navigate('/login');
      } else {
        // User is authenticated, we can optionally fetch data here if it depends on user
        // But fetchDashboardData currently doesn't depend on 'user' variable, it uses global db
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Profile */}
      <AdminProfile />

      {/* Tabs */}
      <Tabs active={activeTab} setActive={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "Utilisateurs" && (
        <>
          <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              className="text-sm"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </div>

          {/* Real-time Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto mb-8">
            <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Companies</p>
                  <p className="text-2xl font-bold">{dashboardData.totalCompanies}</p>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Freelancers</p>
                  <p className="text-2xl font-bold">{dashboardData.totalFreelancers}</p>
                </div>
                <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Active Sellers</p>
                  <p className="text-2xl font-bold">{dashboardData.totalSellers}</p>
                </div>
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">{dashboardData.totalRevenue?.toLocaleString()} GNF</p>
                </div>
                <div className="w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Management Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            {/* Manage Companies Card */}
            <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200" onClick={() => {
              console.log("Navigating to company dashboard...");
              try {
                navigate("/company/dashboard");
              } catch (error) {
                console.error("Navigation error:", error);
                window.location.href = "/company/dashboard";
              }
            }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Manage Companies</h3>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Verify RCCM/NIF, manage profiles, reset passwords, view spending reports</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">RCCM Verification</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Profile Management</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Spending Analytics</span>
              </div>
            </Card>

            {/* Manage Freelancers Card */}
            <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-200" onClick={() => {
              console.log("Navigating to freelancer dashboard...");
              try {
                navigate("/freelancer/dashboard");
              } catch (error) {
                console.error("Navigation error:", error);
                window.location.href = "/freelancer/dashboard";
              }
            }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Manage Freelancers</h3>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Verify profiles, manage OTP, edit payment methods, view earnings</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Profile Verification</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">OTP Management</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Earnings Tracking</span>
              </div>
            </Card>

            {/* Manage Sellers Card */}
            <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-orange-200" onClick={() => {
              console.log("Navigating to seller dashboard...");
              try {
                navigate("/seller/dashboard");
              } catch (error) {
                console.error("Navigation error:", error);
                window.location.href = "/seller/dashboard";
              }
            }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Manage Sellers</h3>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Verify business licenses, manage OTP, edit payment methods, view sales</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">License Verification</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">OTP Management</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sales Analytics</span>
              </div>
            </Card>

            {/* Manage Leasing Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/dashboard/bookings")}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Manage Leasing</h3>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Approve lease requests, track equipment status, manage delivery</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Lease Approval</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Equipment Tracking</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Delivery Management</span>
              </div>
            </Card>


            {/* Monitor Chats Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Monitor Chats</h3>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Filter chats by user type, enforce message limits, flag inappropriate content</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">User Filtering</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Message Limits</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Content Moderation</span>
              </div>
            </Card>

            {/* Sponsorships Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Sponsorships</h3>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Approve/reject sponsor applications, manage homepage carousel</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Sponsor Approval</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Carousel Management</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Revenue Tracking</span>
              </div>
            </Card>

            {/* Transactions Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Transactions</h3>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">View all transactions, track commissions, export reports</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">Transaction History</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Commission Tracking</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Export Reports</span>
              </div>
            </Card>

            {/* Gamification Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Gamification</h3>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Monitor training progress, sales analytics, gamification stats</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Training Progress</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Sales Analytics</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Badges & Rewards</span>
              </div>
            </Card>

            {/* Portfolio & Ads Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Portfolio & Ads</h3>
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Approve portfolios, manage ads, content moderation</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-rose-100 text-rose-800 text-xs rounded-full">Portfolio Approval</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Ad Management</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Content Moderation</span>
              </div>
            </Card>

            {/* Deleted Accounts Card */}
            <Card className="p-6 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Deleted Accounts</h3>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">View deleted accounts, audit logs, security monitoring</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">Deleted Accounts</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Audit Logs</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Security Alerts</span>
              </div>
            </Card>
          </div>
          {error && (
            <div className="mb-4 max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchDashboardData(true)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading && <div className="mb-4 text-gray-500 text-sm max-w-7xl mx-auto">Loading dashboard data...</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Orders Card */}
            <div className="md:col-span-1">
              <h3 className="text-base md:text-lg font-semibold mb-2">Total Training Requests</h3>
              <Card className="h-auto md:h-[180px] flex flex-col">
                <div className="flex flex-row items-center justify-between p-4">
                  <p className="text-sm font-medium text-gray-500">Current number of Requests</p>
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
                <CardContent className="flex flex-col justify-between flex-grow">
                  <div className="text-3xl md:text-4xl font-bold">{dashboardData.totalTrainingRequests} Requests</div>
                  <Button className="mt-4 w-fit" onClick={() => navigate("/admin/dashboard/training-requests")}>
                    View Training Requests
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Listings Card */}
            <div className="md:col-span-1">
              <h3 className="text-base md:text-lg font-semibold mb-2">Total Tickets</h3>
              <Card className="h-auto md:h-[180px] flex flex-col">
                <div className="flex flex-row items-center justify-between p-4">
                  <p className="text-sm font-medium text-gray-500">Current number of Tickets</p>
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
                <CardContent className="flex flex-col justify-between flex-grow">
                  <div className="text-3xl md:text-4xl font-bold">{dashboardData.totalTickets} Tickets</div>
                  <Button className="mt-4 w-fit" onClick={() => navigate("/admin/dashboard/ticket-listing")}>
                    View Tickets
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Reviews Section */}
            <div className="md:col-span-1 md:row-span-2 flex flex-col">
              <h3 className="text-base md:text-lg font-semibold mb-2">Messages</h3>
              <Card className="flex-grow">
                <CardContent className="flex flex-col h-full p-0">
                  <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                    {recentChats.length > 0 ? (
                      recentChats.map((chat) => (
                        <div key={chat.id} className="flex items-center gap-3 p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50">
                          <Avatar>
                            <span className="flex items-center justify-center h-full w-full bg-blue-100 text-blue-600 font-bold">
                              {chat.userInfo?.name?.[0] || "U"}
                            </span>
                          </Avatar>
                          <div className="flex-grow">
                            <p className="font-semibold">{chat.userInfo?.name || "Unknown User"}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {chat.status === 'active' ? "Active Session" : "Closed"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {chat.lastMessageAt?.toDate ? chat.lastMessageAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No active chats</div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowChatWidget(true)}
                    >
                      OPEN SUPPORT CHAT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Section */}
            <div className="md:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base md:text-lg font-semibold">Current Bookings List</h3>
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => navigate("/admin/dashboard/bookings")}
                >
                  View All Bookings
                </Button>
              </div>
              <Card className="h-auto md:h-[520px]">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <div className="w-full text-left mb-4 bg-gray-50 overflow-x-auto">
                    <div className="grid grid-cols-5 min-w-[500px] gap-4 font-semibold text-sm text-gray-600 border-b border-gray-100 p-4">
                      <div>Name</div>
                      <div>Device</div>
                      <div>Duration</div>
                      <div>Amount</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-grow">
                    <h4 className="text-lg md:text-xl font-bold mb-2">
                      Get Started with your company!
                    </h4>
                    <p className="text-gray-500 w-full">
                      You'll find all your employees info here once you complete your first order.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {activeTab === "Statistiques" && (
        <div className="max-w-7xl mx-auto">
          <Analytics />
        </div>
      )}

      {activeTab === "Modération" && (
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Modération Panel</h3>
            <p className="text-gray-600">Here you will review reported content, disputes, and rentals.</p>
          </Card>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Suspicious Activity: Low bid detected for laptop purchase!</li>
              <li>Dispute Reported: Client reported issue: Laptop not delivered.</li>
              <li>Marketplace Alert: 50 new laptop purchases today.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* LiveChatWidget */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}
    </div>
  );
}
