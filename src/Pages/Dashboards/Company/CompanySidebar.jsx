import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Share2,
  MoreHorizontal,
  Wallet,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import userAvatar from "../../../assets/UserPic.jpg";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { CompanyService } from "../../../services/companyService";
import { useTranslation } from "react-i18next";

function Sidebar({ children, className }) {
  return (
    <aside className={`h-screen flex flex-col ${className}`}>{children}</aside>
  );
}

function SidebarHeader({ children, className }) {
  return <div className={className}>{children}</div>;
}

function SidebarContent({ children }) {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
}

function SidebarFooter({ children, className }) {
  return <div className={className}>{children}</div>;
}

function SidebarGroup({ children }) {
  return <div className="mb-6">{children}</div>;
}

function SidebarGroupLabel({ children, className }) {
  return <h4 className={className}>{children}</h4>;
}

function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>;
}

function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

function SidebarMenuButton({ children, isActive, to }) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg text-sm font-medium transition ${isActive
        ? "bg-gray-100 text-gray-900"
        : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {children}
    </Link>
  );
}

export default function CompanySidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

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
      section: t('company_dashboard.sidebar_settings') || 'Settings',
      items: [
        { title: t('navbar.profile'), url: "/company/dashboard/profile", icon: User },
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
          // Fetch detailed profile for name/avatar
          const profile = await CompanyService.getCompanyProfile(user.uid);
          setUserData({
            name: profile?.name || user.displayName || "Company Admin",
            email: user.email,
            avatar: profile?.avatar || user.photoURL || userAvatar,
          });
        } catch (error) {
          console.error("Error loading sidebar profile:", error);
          // Fallback to basic auth info
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transform transition-transform duration-200 ease-in-out flex-shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        {/* Header */}
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Freelance Logo" width={40} height={40} />
            <span className="text-xl font-bold">Freelance</span>
          </div>
          {/* Close button (mobile only) */}
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          {navItems.map((section, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                {section.section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={activePath === item.url}
                        to={item.url}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-4 border-t border-gray-200 mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col text-left">
                  <span className="font-semibold">{userData.name}</span>
                  <span className="text-xs text-gray-500">
                    {userData.email}
                  </span>
                </div>
                <LogOut className="ml-auto h-5 w-5 text-gray-500" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <span className="font-bold">Freelance</span>
        </div>

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
