import { useState, useEffect } from "react";
import { Users, Shield, Award, TrendingUp } from "lucide-react";
import chartImage from "../assets/Chart.png";
import illustrationImage from "../assets/illustration.png";
import testimonialImage from "../assets/partnership-humanImage.jpeg";
import { db } from "../firebaseConfig";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const StatsDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: null,
    freelancers: null,
    companies: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersRef = collection(db, "users");
        const freelancersQuery = query(usersRef, where("role", "in", ["freelancer", "Freelancer"]));
        const companiesQuery = query(usersRef, where("role", "in", ["company", "Company"]));

        const [totalSnap, freelancerSnap, companySnap] = await Promise.all([
          getCountFromServer(usersRef),
          getCountFromServer(freelancersQuery),
          getCountFromServer(companiesQuery),
        ]);

        setStats({
          totalUsers: totalSnap.data().count,
          freelancers: freelancerSnap.data().count,
          companies: companySnap.data().count,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch platform stats:", error);
        setStats({ totalUsers: null, freelancers: null, companies: null, loading: false });
      }
    }
    fetchStats();
  }, []);

  const formatCount = (count) => {
    if (count === null) return "—";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Testimonial + Floating Cards */}
          <div className="relative flex justify-center lg:justify-start">
            {/* Testimonial Image */}
            <div className="relative z-20 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm sm:max-w-md w-full">
              <img
                src={testimonialImage}
                alt="Testimonial"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Illustration Floating Card */}
            <div className="absolute -top-6 -right-4 sm:-right-8 lg:-right-12 z-30 bg-white rounded-xl shadow-lg p-4 w-28 sm:w-32 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{t('home.stats.illustration')}</h4>
                <img src={illustrationImage} alt="Illustration" className="w-10 h-10 mt-1" />
                <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors mt-2">
                  {t('home.stats.view_all')}
                </button>
              </div>
            </div>

            {/* Chart Floating Card */}
            <div className="absolute -bottom-6 left-6 sm:left-12 z-30 bg-white rounded-lg shadow-lg p-1 w-20 sm:w-24 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <img src={chartImage} alt="Chart" className="w-full h-auto" />
            </div>
          </div>

          {/* Right Side - Statistics */}
          <div className="space-y-8 lg:space-y-12 w-full text-center lg:text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Users className="w-8 h-8 text-white/80 mr-2" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stats.loading ? (
                    <span className="inline-block w-32 h-10 bg-white/20 rounded-lg animate-pulse" />
                  ) : (
                    <>{formatCount(stats.totalUsers)}<span className="text-2xl">+</span></>
                  )}
                </div>
                <p className="text-white/80 text-sm lg:text-base">{t('home.stats.daily_users')}</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Shield className="w-8 h-8 text-white/80 mr-2" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stats.loading ? (
                    <span className="inline-block w-24 h-10 bg-white/20 rounded-lg animate-pulse" />
                  ) : (
                    <>{formatCount(stats.companies)}<span className="text-2xl">+</span></>
                  )}
                </div>
                <p className="text-white/80 text-sm lg:text-base">
                  {t('home.stats.trusted_by')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <TrendingUp className="w-8 h-8 text-white/80 mr-2" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stats.loading ? (
                    <span className="inline-block w-24 h-10 bg-white/20 rounded-lg animate-pulse" />
                  ) : (
                    <>{formatCount(stats.freelancers)}<span className="text-2xl">+</span></>
                  )}
                </div>
                <p className="text-white/80 text-sm lg:text-base">{t('home.stats.freelancers_count')}</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Shield className="w-8 h-8 text-white/80 mr-2" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {t('home.stats.powered_by')}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white">TLS 1.3</div>
                <p className="text-white/80 text-xs lg:text-sm mt-1">{t('home.stats.security_badge')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
