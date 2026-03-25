import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Wallet,
  Megaphone,
  Bell,
  Settings,
  User,
  Home,
  Users,
  MapPin,
  Wrench,
  Monitor,
  BookOpen,
  Briefcase,
  HelpCircle,
  FileText,
  Mail,
  Store,
  Handshake,
} from "lucide-react";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { UserService } from "../../../services/userService";
import userAvatar from "../../../assets/UserPic.jpg";
import DashboardLayout from "../../../components/DashboardLayout";

export default function SellerSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    avatar: userAvatar,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
          setUser({
            name: profile?.name || currentUser.displayName || "Seller",
            email: currentUser.email,
            avatar: profile?.avatar || currentUser.photoURL || userAvatar,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            name: currentUser.displayName || "Seller",
            email: currentUser.email,
            avatar: currentUser.photoURL || userAvatar,
          });
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    {
      section: t('sidebar.home'),
      items: [
        { title: t('sidebar.dashboard'), url: "/seller/dashboard", icon: BarChart3 },
      ],
    },
    {
      section: t('sidebar.selling'),
      items: [
        {
          title: t('sidebar.listings'),
          url: "/seller/dashboard/listings",
          icon: Package,
        },
        {
          title: t('sidebar.orders'),
          url: "/seller/dashboard/orders",
          icon: ShoppingCart,
        },
        {
          title: t('sidebar.payouts'),
          url: "/seller/dashboard/payouts",
          icon: Wallet,
        },
      ],
    },
    {
      section: t('sidebar.marketing'),
      items: [
        { title: t('sidebar.ads'), url: "/seller/dashboard/ads", icon: Megaphone },
        { title: t('sidebar.notifications'), url: "/seller/dashboard/notifications", icon: Bell },
      ],
    },
    {
      section: t('sidebar.account', 'Account'),
      items: [
        { title: t('sidebar.settings'), url: "/seller/dashboard/settings", icon: Settings },
        { title: t('navbar.profile'), url: "/seller/dashboard/profile", icon: User },
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

  return <DashboardLayout navItems={navItems} user={user} onLogout={handleLogout} />;
}