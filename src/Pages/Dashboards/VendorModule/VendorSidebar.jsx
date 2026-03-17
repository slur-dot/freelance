import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, Menu, X, User } from "lucide-react";
import userAvatar from "../../../assets/UserPic.jpg";
import { useAuth } from "../../../contexts/AuthContext";
import { VendorService } from "../../../services/vendorService";

function Sidebar({ children, className }) {
  return <aside className={`h-screen flex flex-col ${className}`}>{children}</aside>;
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

function SidebarMenuButton({ children, isActive, to, collapsed }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
      ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100"}
      ${collapsed ? "justify-center px-2" : ""}`}
    >
      {children}
    </Link>
  );
}

export default function VendorSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser?.uid) {
        try {
          const profile = await VendorService.getVendorProfile(currentUser.uid);
          setVendorProfile(profile);
        } catch (error) {
          console.error("Failed to load vendor profile", error);
        }
      }
    }
    fetchProfile();
  }, [currentUser]);

  const navItems = [
    {
      section: t('vendor_dashboard.sidebar.home'),
      items: [
        {
          title: t('vendor_dashboard.sidebar.dashboard'),
          url: "/vendor/dashboard",
          icon: (
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 15.8389V17.8389M12 11.8389V17.8389M16 7.83887V17.8389M7.8 21.8389H16.2C17.8802 21.8389 18.7202 21.8389 19.362 21.5119C19.9265 21.2243 20.3854 20.7653 20.673 20.2008C21 19.5591 21 18.719 21 17.0389V8.63887C21 6.95871 21 6.11863 20.673 5.4769C20.3854 4.91241 19.9265 4.45347 19.362 4.16585C18.7202 3.83887 17.8802 3.83887 16.2 3.83887H7.8C6.11984 3.83887 5.27976 3.83887 4.63803 4.16585C4.07354 4.45347 3.6146 4.91241 3.32698 5.4769C3 6.11863 3 6.95871 3 8.63887V17.0389C3 18.719 3 19.5591 3.32698 20.2008C3.6146 20.7653 4.07354 21.2243 4.63803 21.5119C5.27976 21.8389 6.11984 21.8389 7.8 21.8389Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
        {
          title: t('vendor_dashboard.sidebar.listings'),
          url: "/vendor/dashboard/listings",
          icon: (
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9.83887H10V7.83887H12V9.83887ZM12 5.83887H10V0.838867H12V5.83887ZM6 17.8389C4.9 17.8389 4.01 18.7389 4.01 19.8389C4.01 20.9389 4.9 21.8389 6 21.8389C7.1 21.8389 8 20.9389 8 19.8389C8 18.7389 7.1 17.8389 6 17.8389ZM16 17.8389C14.9 17.8389 14.01 18.7389 14.01 19.8389C14.01 20.9389 14.9 21.8389 16 21.8389C17.1 21.8389 18 20.9389 18 19.8389C18 18.7389 17.1 17.8389 16 17.8389ZM7.1 12.8389H14.55C15.3 12.8389 15.96 12.4289 16.3 11.8089L20 4.79887L18.25 3.83887L14.55 10.8389H7.53L3.27 1.83887H0V3.83887H2L5.6 11.4289L4.25 13.8689C3.52 15.2089 4.48 16.8389 6 16.8389H18V14.8389H6L7.1 12.8389Z" fill="#667085" />
            </svg>
          ),
        },
        {
          title: t('vendor_dashboard.sidebar.orders'),
          url: "/vendor/dashboard/orders",
          icon: (
            <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.41676 19.6721V9.6134L3.7376 5.9214C3.68054 5.78923 3.67837 5.64948 3.7311 5.50215C3.78382 5.35482 3.87626 5.2519 4.00843 5.1934C4.1406 5.1349 4.28071 5.13201 4.42876 5.18473C4.57682 5.23745 4.67901 5.32882 4.73535 5.45882L6.5911 9.55923H19.4091L21.2648 5.4599C21.3219 5.32773 21.4241 5.23529 21.5714 5.18257C21.7195 5.12984 21.8596 5.1349 21.9918 5.19773C22.1239 5.25262 22.2164 5.35373 22.2691 5.50107C22.3218 5.6484 22.3197 5.78851 22.2626 5.9214L20.5834 9.6134V19.6721C20.5834 20.1531 20.4119 20.5648 20.0688 20.9071C19.7258 21.2495 19.3141 21.421 18.8338 21.4217H7.16635C6.68535 21.4217 6.27368 21.2502 5.93135 20.9071C5.58901 20.5641 5.41748 20.1517 5.41676 19.6721Z" fill="#667085" />
            </svg>
          ),
        },
        {
          title: t('vendor_dashboard.sidebar.payouts'),
          url: "/vendor/dashboard/payouts",
          icon: (
            <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.5833 16.0052V7.33854C20.5833 6.14688 19.6083 5.17188 18.4166 5.17188H3.24992C2.05825 5.17188 1.08325 6.14688 1.08325 7.33854V16.0052C1.08325 17.1969 2.05825 18.1719 3.24992 18.1719H18.4166C19.6083 18.1719 20.5833 17.1969 20.5833 16.0052ZM10.8333 14.9219C9.03492 14.9219 7.58325 13.4702 7.58325 11.6719C7.58325 9.87354 9.03492 8.42188 10.8333 8.42188C12.6316 8.42188 14.0833 9.87354 14.0833 11.6719C14.0833 13.4702 12.6316 14.9219 10.8333 14.9219Z" fill="#667085" />
            </svg>
          ),
        },
        {
          title: t('vendor_dashboard.sidebar.ads'),
          url: "/vendor/dashboard/ads",
          icon: (
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.4999 18.5055V15.2555H15.2499V13.0889H18.4999V9.83887H20.6666V13.0889H23.9166V15.2555H20.6666V18.5055H18.4999ZM2.24992 19.5889C1.65409 19.5889 1.1442 19.3769 0.720252 18.953C0.296308 18.529 0.0839742 18.0188 0.083252 17.4222V2.25553C0.083252 1.6597 0.295585 1.14981 0.720252 0.725867C1.14492 0.301923 1.65481 0.0895894 2.24992 0.0888672H17.4166C18.0124 0.0888672 18.5227 0.301201 18.9473 0.725867C19.372 1.15053 19.584 1.66042 19.5833 2.25553V7.6722H17.4166V5.50553H2.24992V17.4222H16.3333V19.5889H2.24992Z" fill="#667085" />
            </svg>
          ),
        },
      ],
    },
    {
      section: t('vendor_dashboard.sidebar.settings') || 'Settings',
      items: [
        {
          title: t('navbar.profile'),
          url: "/vendor/dashboard/profile",
          icon: <User className="h-5 w-5 text-gray-400" />,
        },
      ],
    },
  ];

  const userData = {
    name: vendorProfile?.businessName || vendorProfile?.name || currentUser?.displayName || "Vendor User",
    email: vendorProfile?.email || currentUser?.email || "vendor@example.com",
    avatar: vendorProfile?.avatar || currentUser?.photoURL || userAvatar,
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed top-0 left-0 right-0 z-50">
        <button onClick={toggleSidebar}>
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-bold">Freelance</span>
        <div className="w-6" /> {/* Spacer for centering title */}
      </div>

      {/* Sidebar */}
      <Sidebar
        className={`fixed top-0 left-0 z-40 h-screen border-r border-gray-200 bg-white 
          transform transition-transform duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
          ${isCollapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => window.innerWidth < 1024 && setIsCollapsed(true)}
      >
        <SidebarHeader className="p-4 flex items-center gap-3">
          <img src="/logo.png" alt="Freelance Logo" width={40} height={40} />
          {!isCollapsed && <span className="text-xl font-bold">Freelance</span>}
        </SidebarHeader>

        <SidebarContent>
          {navItems.map((section, index) => (
            <SidebarGroup key={index}>
              {!isCollapsed && (
                <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                  {section.section}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={activePath === item.url}
                        to={item.url}
                        collapsed={isCollapsed}
                      >
                        {item.icon}
                        {!isCollapsed && item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200 mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {!isCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{userData.name}</span>
                    <span className="text-xs text-gray-500">{userData.email}</span>
                  </div>
                )}
                <button onClick={handleLogout} className="ml-auto text-gray-500 hover:text-red-500">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto md:mt-0 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
