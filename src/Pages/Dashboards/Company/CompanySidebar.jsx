import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Share2,
  MoreHorizontal,
  Wallet,
  Home,
  ShoppingCart,
  Users,
  MapPin,
  Wrench,
  User,
  Monitor,
  BookOpen,
  Briefcase,
  HelpCircle,
  FileText,
  Mail,
  Store,
  Handshake,
} from "lucide-react";
import userAvatar from "../../../assets/UserPic.jpg";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { CompanyService } from "../../../services/companyService";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CompanySidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    {
      section: t('company_dashboard.sidebar_home'),
      items: [
        { title: t('company_dashboard.sidebar_dashboard'), url: "/company/dashboard", icon: BarChart3 },
      ],
    },
    {
      section: t('company_dashboard.sidebar_employees'),
      items: [
        {
          title: t('company_dashboard.sidebar_training_progress'),
          url: "/company/dashboard/training-progress",
          icon: Share2,
        },
        {
          title: t('company_dashboard.sidebar_employee_list'),
          url: "/company/dashboard/emplolyee-list",
          icon: MoreHorizontal,
        },
      ],
    },
    {
      section: t('company_dashboard.sidebar_training'),
      items: [
        {
          title: t('company_dashboard.sidebar_custom_training'),
          url: "/company/dashboard/training-quotes",
          icon: Wallet,
        },
      ],
    },
    {
      section: t('company_dashboard.sidebar_settings', 'Settings'),
      items: [
        { title: t('navbar.profile'), url: "/company/dashboard/profile", icon: User },
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
        { title: t('navbar.partnership', 'Partnership'), url: "/partnership", icon: Handshake },
      ],
    },
  ];

  const [userData, setUserData] = useState({
    name: "Company Admin",
    email: "Loading...",
    avatar: userAvatar,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await CompanyService.getCompanyProfile(user.uid);
          setUserData({
            name: profile?.name || user.displayName || "Company Admin",
            email: user.email,
            avatar: profile?.avatar || user.photoURL || userAvatar,
          });
        } catch (error) {
          console.error("Error loading sidebar profile:", error);
          setUserData({
            name: user.displayName || "Company Admin",
            email: user.email,
            avatar: user.photoURL || userAvatar,
          });
        }
      } else {
        setUserData({
          name: "Guest",
          email: "Not logged in",
          avatar: userAvatar,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return <DashboardLayout navItems={navItems} user={userData} onLogout={handleLogout} />;
}
