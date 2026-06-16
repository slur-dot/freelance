import React, { Suspense, useState, useEffect } from "react";
import {
  ChevronDown,
  Star,
  Heart,
  MessageSquareText,
  AlignJustify,
  ExternalLink,
  Loader2,
} from "lucide-react";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import FilterSidebar from "./FilterSidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { Search } from "lucide-react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";




async function fetchFreelancersFromFirebase() {
  try {
    const usersRef = collection(db, "users");
    // Try lowercase first
    let q = query(usersRef, where("role", "==", "freelancer"), limit(20));
    let snap = await getDocs(q);
    
    // If empty, try capitalized
    if (snap.empty) {
      q = query(usersRef, where("role", "==", "Freelancer"), limit(20));
      snap = await getDocs(q);
    }
    
    if (snap.empty) return null;

    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        name: d.name || d.fullName || d.displayName || "Freelancer",
        company: d.company || d.businessName || "",
        skills: d.skills || d.specializations || [],
        category: (d.skills || [])[0] || d.category || "Tech",
        rating: d.rating || 4.5,
        reviews: d.reviewCount || 0,
        hourlyRate: d.hourlyRate || "—",
        quote: d.bio || "",
        quoteAuthor: "",
        image: d.avatar || d.profileImage || d.photoURL || HireFreelanceImage,
        location: d.location || d.city || d.prefecture || "Guinea",
        experience: d.experience || "",
        availability: d.availability || "Available Now",
        portfolio: d.portfolio || "",
        isExample: false,
      };
    });
  } catch (err) {
    console.error("Error fetching freelancers:", err);
    return null;
  }
}

function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

function FreelancerCard({ freelancer }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clearCart, addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleHire = () => {
    const price = parseInt(freelancer.hourlyRate.replace(/[^0-9]/g, "")) || 150000;
    const item = {
      id: freelancer.id,
      name: `Hire ${freelancer.name} - ${freelancer.category}`,
      currentPrice: price,
      image: freelancer.image,
      vendor: freelancer.company || "Freelancer",
      isFreelance: true
    };
    clearCart();
    addToCart(item);
    navigate("/shipping-details");
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition hover:border-green-600 hover:border-2 flex flex-col h-full">
      <div className="relative">
        {/* Circular Avatar */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-md">
            {freelancer.name.charAt(0)}
          </div>
        </div>

        <img
          src={freelancer.image}
          alt={freelancer.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {freelancer.category}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {freelancer.availability}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold">{freelancer.name}</h3>
        <p className="text-gray-500 text-sm">{freelancer.company}</p>
        <p className="text-gray-600 text-sm">{freelancer.location} • {freelancer.experience}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {freelancer.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">
              {freelancer.rating}/5 ({t('freelancer.profile.actions.reviews', { count: freelancer.reviews, defaultValue: `${freelancer.reviews} reviews` })})
            </span>
          </div>
          <div className="text-sm font-semibold text-green-600">
            {freelancer.hourlyRate}/hr
          </div>
        </div>

        {/* Portfolio Link */}
        {freelancer.portfolio && (
          <div className="mt-3">
            <button
              onClick={() => window.open(freelancer.portfolio, '_blank')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {t('freelancer.profile.actions.view_portfolio')}
            </button>
          </div>
        )}

        <div className="bg-green-50 p-3 rounded-md mt-3 text-sm text-gray-700">
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="w-3 h-3 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <div className="italic text-xs">
            "{freelancer.quote}" - {freelancer.quoteAuthor}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="View Profile">
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
               className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
               title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
               onClick={(e) => {
                 e.stopPropagation();
                 setIsFavorite(!isFavorite);
               }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              title="Send Message"
              onClick={() => navigate("/hire-freelancers/info")}
            >
              <MessageSquareText className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs font-semibold text-green-600">
            {freelancer.hourlyRate}/hr
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/job-board")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-2 rounded-md transition-colors"
          >
            {t('freelancer.profile.actions.bid')}
          </button>
          <button
            onClick={handleHire}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2 py-2 rounded-md transition-colors"
            style={{ backgroundColor: '#3B82F6' }}
          >
            {t('freelancer.profile.actions.hire')}
          </button>
        </div>
      </div>
    </div>
  );
}

function FreelancerList({ freelancers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {freelancers.map((freelancer) => (
        <FreelancerCard key={freelancer.id} freelancer={freelancer} />
      ))}
    </div>
  );
}

export default function FreelancerProfile() {
  const [sortOpen, setSortOpen] = useState(false);
  const { t } = useTranslation();
  const [sortValue, setSortValue] = useState(t('freelancer.sort.options.popular'));
  const [freelancers, setFreelancers] = useState([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);

  const sortOptions = [
    t('freelancer.sort.options.popular'),
    t('freelancer.sort.options.rated_high'),
    t('freelancer.sort.options.rated_low'),
    t('freelancer.sort.options.newest')
  ];

  useEffect(() => {
    async function load() {
      setLoadingFreelancers(true);
      const firebaseData = await fetchFreelancersFromFirebase();
      setFreelancers(firebaseData && firebaseData.length > 0 ? firebaseData : []);
      setLoadingFreelancers(false);
    }
    load();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreelancers = freelancers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-3 ml-2 sm:ml-10">
          <a href="/" className="hover:underline">
            {t('freelancer.profile.breadcrumbs.home')}
          </a>
          <span className="mx-1">&gt;</span>
          <span className="text-blue-600">{t('freelancer.profile.breadcrumbs.hire')}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 md:gap-8 items-start">
            {/* Filters Sidebar */}
            <div className="w-full">
              <FilterSidebar />
            </div>

            {/* Freelancer Listings */}
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold mb-5">
                {t('freelancer.profile.breadcrumbs.hire')}
              </h1>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4 relative">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('freelancer.search_placeholder', 'Search freelancers by name or skill...')}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-end">
                  <p>{t('freelancer.sort.showing', { start: 1, end: filteredFreelancers.length, total: freelancers.length })}</p>
                  <span>{t('freelancer.sort.label')}</span>
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md bg-white hover:bg-gray-100"
                    >
                      {sortValue} <ChevronDown className="w-4 h-4" />
                    </button>
                    {sortOpen && (
                      <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                        {sortOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSortValue(option);
                              setSortOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Freelancer Cards */}
              {loadingFreelancers ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <p className="text-sm">{t('freelancer.loading', 'Loading freelancers...')}</p>
                </div>
              ) : (
                <Suspense fallback={<Loading />}>
                  <FreelancerList freelancers={filteredFreelancers} />
                </Suspense>
              )}

              {/* Pagination Dots */}
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === 0 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
