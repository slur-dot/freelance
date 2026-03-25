import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  CalendarCheck,
  LifeBuoy,
  BookOpen,
  Users,
  UserPlus,
  Headphones,
  Megaphone,
  ShoppingCart,
  Ticket,
  Zap,
  User,
  Home,
  MapPin,
  Wrench,
  Monitor,
  Briefcase,
  HelpCircle,
  FileText,
  Mail,
  Store,
} from "lucide-react";
import userAvatar from "../../../assets/UserPic.jpg";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navItems = [
    {
      section: t('admin_dashboard.sidebar.home.title'),
      items: [
        { title: t('admin_dashboard.sidebar.home.dashboard'), url: "/admin/dashboard", icon: BarChart3 },
        { title: t('navbar.profile'), url: "/admin/dashboard/profile", icon: User },
      ],
    },
    {
      section: t('admin_dashboard.sidebar.listings.title'),
      items: [
        { title: t('admin_dashboard.sidebar.listings.course'), url: "/admin/dashboard/course-listing", icon: BookOpen },
        { title: t('admin_dashboard.sidebar.listings.product'), url: "/admin/dashboard/product-listing", icon: ShoppingCart },
        { title: t('admin_dashboard.sidebar.listings.tickets'), url: "/admin/dashboard/ticket-listing", icon: Ticket },
      ],
    },
    {
      section: t('admin_dashboard.sidebar.management.title', 'Management'),
      items: [
        { title: t('admin_dashboard.sidebar.management.bookings'), url: "/admin/dashboard/bookings", icon: CalendarCheck },
        { title: t('admin_dashboard.sidebar.management.training'), url: "/admin/dashboard/training-requests", icon: Headphones },
        { title: t('admin_dashboard.sidebar.management.tech'), url: "#", icon: Zap },
        { title: t('admin_dashboard.sidebar.management.ads'), url: "/admin/dashboard/advertisements", icon: Megaphone },
        { title: t('admin_dashboard.sidebar.management.users'), url: "/admin/dashboard/users", icon: Users },
        { title: t('admin_dashboard.sidebar.management.sub_admin'), url: "/admin/dashboard/sub-admin", icon: UserPlus },
        { title: t('admin_dashboard.sidebar.management.support'), url: "/admin/dashboard/support-team", icon: LifeBuoy },
      ],
    },
    {
      section: t('sidebar.main_site', 'Main Site'),
      items: [
        { title: t('navbar.home', 'Home'), url: "/", icon: Home },
        { title: t('navbar.shop', 'Shop'), url: "/shop", icon: ShoppingCart },
        { title: t('navbar.hire_freelancers', 'Hire Freelancers'), url: "/hire-freelancers", icon: Users },
        { title: t('navbar.locations', 'Locations'), url: "/locations", icon: MapPin },
        { title: t('navbar.tech_services', 'Tech Services'), url: "/tech-services", icon: Wrench },
      ],
    },
    {
      section: t('navbar.more', 'More'),
      items: [
        { title: t('navbar.device_rental', 'Device Rental'), url: "/computer-rental", icon: Monitor },
        { title: t('navbar.training_upskilling', 'Training & Upskilling'), url: "/training-modules", icon: BookOpen },
        { title: t('navbar.corporate_sales', 'Corporate Sales'), url: "/corporate-sales", icon: Briefcase },
        { title: t('navbar.faq', 'FAQ'), url: "/faq", icon: HelpCircle },
        { title: t('navbar.blog', 'Blog'), url: "/blog", icon: FileText },
        { title: t('navbar.contact_us', 'Contact Us'), url: "/contact", icon: Mail },
        { title: t('navbar.vendor_profiles', 'Vendor Profiles'), url: "/vendor-profiles", icon: Store },
      ],
    },
  ];

  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@example.com",
    avatar: userAvatar,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          setUser({
            name: userData.fullName || currentUser.displayName || "Admin User",
            email: currentUser.email || userData.email,
            avatar: userData.profileImage || currentUser.photoURL || userAvatar,
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <DashboardLayout navItems={navItems} user={user} onLogout={handleLogout} />;
}
