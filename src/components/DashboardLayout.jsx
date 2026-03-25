import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout({ navItems, user, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;
  const { userRole } = useAuth();

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 w-full z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileOpen(true)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
          <img src="/logo.png" alt="Freelance" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-lg text-gray-800">Freelance</span>
        </div>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-[#0B1120] text-slate-300 z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static 
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className="flex flex-col h-full bg-gradient-to-b from-[#111827] to-[#0B1120]">
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Freelance" className="w-8 h-8 rounded-full shadow-lg" />
              {!isCollapsed && <span className="text-xl font-bold tracking-tight text-white">Freelance</span>}
            </div>
            
            {/* Desktop Collapse Toggle */}
            <button 
              className="hidden lg:flex text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            
            {/* Mobile Close Toggle */}
            <button 
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Card (Top) */}
          <div className={`px-4 pt-6 pb-2 border-b border-slate-800/80 transition-all ${isCollapsed ? 'px-2' : ''}`}>
            <div className={`flex flex-col ${isCollapsed ? 'items-center gap-0' : 'items-start gap-4'} bg-[#1E293B]/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-lg relative overflow-hidden group`}>
               {/* Aesthetic background glow */}
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20"></div>
               
               <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                 <img 
                  src={user?.avatar || '/default-avatar.png'} 
                  alt={user?.name} 
                  className={`rounded-full object-cover shadow-[0_0_15px_rgba(59,130,246,0.2)] border-2 border-blue-500/30 transition-all ${isCollapsed ? 'w-10 h-10 mb-2' : 'w-12 h-12'}`}
                 />
                 {!isCollapsed && (
                   <div className="flex-1 min-w-0 z-10">
                     <h3 className="text-[13px] font-bold text-slate-100 truncate">{user?.name}</h3>
                     <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-blue-500/20 text-blue-400 border border-blue-500/20">
                       {userRole || 'User'}
                     </span>
                   </div>
                 )}
               </div>

               {!isCollapsed && (
                 <button 
                  onClick={onLogout}
                  className="mt-1 z-10 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-red-500/90 transition-all border border-slate-700 hover:border-red-500 bg-slate-800 shadow-sm"
                 >
                   <LogOut className="w-3.5 h-3.5" />
                   Logout
                 </button>
               )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 styled-scrollbar">
            {navItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                {!isCollapsed && (
                  <h4 className="px-6 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {section.section}
                  </h4>
                )}
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = activePath === item.url || (item.url !== '/' && activePath.startsWith(item.url) && item.url.split('/').length > 2);
                    // Simplify active check:
                    const isExactActive = activePath === item.url;
                    
                    return (
                      <li key={i} className="px-3">
                        <Link
                          to={item.url}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                            ${isExactActive 
                              ? 'bg-blue-600/10 text-blue-400' 
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                          `}
                        >
                          <div className={`relative flex items-center justify-center ${isExactActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'} transition-colors`}>
                            {React.isValidElement(item.icon) ? item.icon : <item.icon className="w-5 h-5" />}
                            {isExactActive && !isCollapsed && (
                              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-md"></div>
                            )}
                          </div>
                          
                          {!isCollapsed && (
                            <span className={`font-medium text-sm ${isExactActive ? 'text-white font-semibold' : ''}`}>
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mt-0 mt-16 overflow-x-hidden">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
