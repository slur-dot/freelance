import { Camera, Mail, MapPin, Calendar, Edit2, Shield, Layout, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileLayout = ({ user, stats, children, roleActions }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Cover Image & Header Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium">
          <Camera className="w-4 h-4" />
          {t('profile.change_cover', 'Change Cover')}
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 backdrop-blur-sm bg-white/80">
              <div className="relative -mt-20 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 shadow-2xl">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                      alt="Avatar" 
                      className="w-full h-full rounded-[1.4rem] object-cover bg-white"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Guest User'}</h2>
                  <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-1">{user?.role || 'Member'}</p>
                </div>

                <div className="w-full h-px bg-gray-100 my-6"></div>

                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3 text-gray-600 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Mail className="w-4 h-4 group-hover:text-blue-600" />
                    </div>
                    <span className="text-sm truncate">{user?.email || 'no-email@example.com'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <MapPin className="w-4 h-4 group-hover:text-blue-600" />
                    </div>
                    <span className="text-sm">{user?.location || 'Conakry, Guinea'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Calendar className="w-4 h-4 group-hover:text-blue-600" />
                    </div>
                    <span className="text-sm">{t('profile.joined', 'Joined')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {roleActions && (
                  <div className="mt-8 w-full">
                    {roleActions}
                  </div>
                )}
              </div>
            </div>

            {/* Account Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-4">{t('profile.account_actions', 'Account Actions')}</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    {t('profile.logout', 'Logout')}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats?.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className={`mt-2 text-[10px] font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-blue-500'}`}>
                    {stat.trendNote}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Tabs/Content Area */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden min-h-[400px]">
               {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
