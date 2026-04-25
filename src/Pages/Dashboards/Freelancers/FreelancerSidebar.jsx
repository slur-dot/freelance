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
  GraduationCap,
} from "lucide-react";
import userAvatar from "../../../assets/UserPic.jpg";
import { useAuth } from "../../../contexts/AuthContext";
import { UserService } from "../../../services/userService";
import DashboardLayout from "../../../components/DashboardLayout";

export default function FreelancerSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser?.uid) {
        try {
          const data = await UserService.getUserProfile(currentUser.uid);
          setProfile(data);
        } catch (error) {
          console.error("Failed to load freelancer profile", error);
        }
      }
    }
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const navItems = [
    {
      section: t('sidebar.home'),
      items: [
        { title: t('sidebar.dashboard'), url: "/freelancer/dashboard", icon: BarChart3 },
      ],
    },
    {
      section: t('sidebar.courses'),
      items: [
        {
          title: t('sidebar.training_progress'),
          url: "/freelancer/dashboard/training-progress",
          icon: Share2,
        },
        {
          title: t('sidebar.requested_courses'),
          url: "/freelancer/dashboard/requested-courses",
          icon: MoreHorizontal,
        },
      ],
    },
    {
      section: t('sidebar.work_management', 'Work Management'),
      items: [
        { title: t('sidebar.my_jobs', 'My Projects / Services'), url: "/freelancer/dashboard/work-management", icon: Briefcase },
        { title: t('sidebar.earnings', 'Earnings'), url: "/freelancer/dashboard/earnings", icon: Wallet },
      ],
    },
    {
      section: t('sidebar.training', 'Training'),
      items: [
        { title: t('sidebar.trainer_hub', 'Become a Trainer'), url: "/freelancer/dashboard", icon: GraduationCap },
      ],
    },
    {
      section: t('sidebar.settings', 'Settings'),
      items: [
        { title: t('navbar.profile'), url: "/freelancer/dashboard/profile", icon: User },
        { title: t('sidebar.referral', 'Referral Program'), url: "/freelancer/dashboard/referrals", icon: Share2 },
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

  const userData = {
    name: profile?.name || currentUser?.displayName || "Freelancer User",
    email: profile?.email || currentUser?.email || "freelancer@example.com",
    avatar: profile?.avatar || currentUser?.photoURL || userAvatar,
  };

  return <DashboardLayout navItems={navItems} user={userData} onLogout={handleLogout} />;
}
