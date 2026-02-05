import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Share2,
  MoreHorizontal,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import userAvatar from "../../../assets/UserPic.jpg";
import { useAuth } from "../../../contexts/AuthContext";
import { UserService } from "../../../services/userService";

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

export default function FreelancerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
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
      section: "HOME",
      items: [
        { title: "Dashboard", url: "/freelancer/dashboard", icon: BarChart3 },
      ],
    },
    {
      section: "COURSES",
      items: [
        {
          title: "Training Progress",
          url: "/freelancer/dashboard/training-progress",
          icon: Share2,
        },
        {
          title: "Requested Courses",
          url: "/freelancer/dashboard/requested-courses",
          icon: MoreHorizontal,
        },
      ],
    },
    {
      section: "FINANCE",
      items: [
        { title: "Earnings", url: "/freelancer/dashboard/earnings", icon: Wallet },
      ],
    },
  ];

  const userData = {
    name: profile?.name || currentUser?.displayName || "Freelancer User",
    email: profile?.email || currentUser?.email || "freelancer@example.com",
    avatar: profile?.avatar || currentUser?.photoURL || userAvatar,
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (responsive) */}
      <Sidebar
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transform transition-transform duration-200 ease-in-out
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
              <div className="flex items-center gap-3">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-semibold truncate">{userData.name}</span>
                  <span className="text-xs text-gray-500 truncate">
                    {userData.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto p-1 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
