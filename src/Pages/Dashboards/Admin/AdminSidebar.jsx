import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Ticket,
  Zap,
} from "lucide-react";
import userAvatar from "../../../assets/UserPic.jpg";

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

export default function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  const navItems = [
    {
      section: t('admin_dashboard.sidebar.home.title'),
      items: [{ title: t('admin_dashboard.sidebar.home.dashboard'), url: "/admin/dashboard", icon: BarChart3 }],
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
      section: t('admin_dashboard.sidebar.management.title'),
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
          // Fetch additional details from Firestore 'users' collection
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

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Hamburger */}
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setIsMobileOpen(true)}>
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <span className="font-bold">Freelance</span>
        <div className="w-6" /> {/* Spacer for centering title */}
      </div>

      {/* Sidebar */}
      <Sidebar
        className={`fixed top-0 left-0 z-50 h-screen border-r border-gray-200 bg-white shadow-xl
          transform transition-transform duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:shadow-none
          ${isCollapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => window.innerWidth < 1024 && setIsCollapsed(true)}
      >
        {/* Header */}
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Freelance Logo" width={40} height={40} />
            {!isCollapsed && <span className="text-xl font-bold">Freelance</span>}
          </div>
          {/* Close button (mobile only) */}
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          {navItems.map((section) => (
            <SidebarGroup key={section.section}>
              {!isCollapsed && (
                <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                  {section.section}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={`${section.section}-${item.title}`}>
                      <SidebarMenuButton
                        isActive={activePath === item.url}
                        to={item.url}
                        collapsed={isCollapsed}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && item.title}
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
              <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                {!isCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-sm truncate max-w-[120px]">{user.name}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                  </div>
                )}
                <button onClick={handleLogout} className="ml-auto text-gray-500 hover:text-red-500" title={t('admin_dashboard.sidebar.footer.logout')}>
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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto lg:mt-0 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
