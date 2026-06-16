import React, { Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Heart,
} from "lucide-react";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import { useNavigate } from "react-router-dom";
import { VendorService } from "../services/vendorService";


/* ---------------- Loader ---------------- */
function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

/* ---------------- Sidebar Components ---------------- */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-2 border-b border-gray-300">
      <button
        className="flex justify-between items-center w-full text-left text-sm sm:text-base font-medium"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <ChevronRight
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${open ? "rotate-90" : ""
            }`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

function CheckboxList({ items, selected, onChange }) {
  return (
    <ul className="grid gap-2 text-xs sm:text-sm mt-2">
      {items.map((item, index) => (
        <li key={index}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onChange(item)}
              className="form-checkbox accent-blue-600 w-4 h-4 sm:w-5 sm:h-5"
            />
            {item}
          </label>
        </li>
      ))}
    </ul>
  );
}

function FilterSidebar({ filters, setFilters, applyFilters }) {
  const { t } = useTranslation();
  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  return (
    <div className="p-3 sm:p-4 rounded-lg shadow-inner border border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-base sm:text-lg font-semibold">{t('vendor_profiles_page.sidebar.filters_title') || 'Filters'}</h2>
        <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>

      {/* Category */}
      <Accordion title={t('vendor_profiles_page.sidebar.category.title') || "Category"}>
        <CheckboxList
          items={["Mobile", "Laptop", "Tablet", "Smartwatch"]}
          selected={filters.category}
          onChange={(value) => toggleFilter("category", value)}
        />
      </Accordion>

      {/* Premium */}
      <Accordion title={t('vendor_profiles_page.sidebar.premium.title') || "Premium"}>
        <CheckboxList
          items={["Premium", "Non-Premium"]}
          selected={filters.premium}
          onChange={(value) => toggleFilter("premium", value)}
        />
      </Accordion>

      {/* Ratings */}
      <Accordion title={t('vendor_profiles_page.sidebar.ratings.title') || "Ratings"}>
        <CheckboxList
          items={[
            "5 Stars",
            "4 Stars & Up",
            "3 Stars & Up",
            "2 Stars & Up",
            "1 Star & Up",
          ]}
          selected={filters.rating}
          onChange={(value) => toggleFilter("rating", value)}
        />
      </Accordion>

      {/* Apply Filter Button */}
      <button
        onClick={applyFilters}
        className="w-full mt-3 sm:mt-4 bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition text-sm sm:text-base"
      >
        {t('vendor_profiles_page.sidebar.apply_btn') || 'Apply Filters'}
      </button>
    </div>
  );
}

/* ---------------- Freelancer Card ---------------- */
function FreelancerCard({ freelancer }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={freelancer.image}
          alt={freelancer.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold">{freelancer.name}</h3>
        <p className="text-gray-500 text-xs sm:text-sm">{freelancer.company}</p>

        {/* Rating only */}
        <div className="flex items-center gap-1 text-gray-600 mt-2 text-xs sm:text-sm">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
          <span>
            {freelancer.rating} ({freelancer.reviews})
          </span>
        </div>
      </div>

      {/* Footer with Heart + Hire button */}
      <div className="p-3 sm:p-4 flex justify-between items-center border-t">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <button
          onClick={() => navigate(`/vendor-profiles/info?vendorId=${freelancer.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md"
        >
          {t('vendor_profiles_page.card.view_devices') || 'View Devices →'}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Freelancer List ---------------- */
function FreelancerList({ freelancers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {freelancers.map((freelancer) => (
        <FreelancerCard key={freelancer.id} freelancer={freelancer} />
      ))}
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function VendorProfiles() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(t('vendor_profiles_page.sort.options.popular'));
  const [filters, setFilters] = useState({
    category: [],
    premium: [],
    rating: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const sortOptions = [
    t('vendor_profiles_page.sort.options.popular'),
    t('vendor_profiles_page.sort.options.highest_rated'),
    t('vendor_profiles_page.sort.options.lowest_rated'),
    t('vendor_profiles_page.sort.options.newest'),
  ];

  useEffect(() => {
    VendorService.getAllVendors()
      .then((list) => {
        const mapped = list.map((v) => ({
          id: v.id,
          name: v.businessName || v.fullName || v.name || t('vendor_profiles_page.card.unnamed', 'Vendor'),
          company: v.city || v.region || v.prefecture || "Guinea",
          rating: Number(v.status?.rating ?? v.rating ?? 0) || 0,
          reviews: Number(v.reviewCount ?? v.reviews ?? 0) || 0,
          image: v.avatar || v.profileImage || HireFreelanceImage,
          category: v.vendorCategory || v.category || "Mobile",
          premium: v.premium === true || v.verified === true,
        }));
        setVendors(mapped);
      })
      .catch(console.error)
      .finally(() => setLoadingVendors(false));
  }, [t]);

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  // Apply filters
  const filteredFreelancers = vendors.filter((f) => {
    const categoryMatch =
      appliedFilters.category.length === 0 ||
      appliedFilters.category.includes(f.category);

    const premiumMatch =
      appliedFilters.premium.length === 0 ||
      (appliedFilters.premium.includes("Premium") && f.premium) ||
      (appliedFilters.premium.includes("Non-Premium") && !f.premium);

    const ratingMatch =
      appliedFilters.rating.length === 0 ||
      (appliedFilters.rating.includes("5 Stars") && f.rating >= 5) ||
      (appliedFilters.rating.includes("4 Stars & Up") && f.rating >= 4) ||
      (appliedFilters.rating.includes("3 Stars & Up") && f.rating >= 3) ||
      (appliedFilters.rating.includes("2 Stars & Up") && f.rating >= 2) ||
      (appliedFilters.rating.includes("1 Star & Up") && f.rating >= 1);

    return categoryMatch && premiumMatch && ratingMatch;
  });

  // Apply sorting
  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    if (sortValue === t('vendor_profiles_page.sort.options.highest_rated')) return b.rating - a.rating;
    if (sortValue === t('vendor_profiles_page.sort.options.lowest_rated')) return a.rating - b.rating;
    if (sortValue === t('vendor_profiles_page.sort.options.newest')) return b.id.localeCompare(a.id);
    return b.reviews - a.reviews;
  });

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-3 ml-2">
          <a href="/" className="hover:underline">
            {t('vendor_profiles_page.breadcrumb.home') || 'Home'}
          </a>
          <span className="mx-1">&gt;</span>
          <span className="text-blue-600">{t('vendor_profiles_page.title') || 'Vendor Profiles'}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Filters Sidebar */}
            <div className="w-full">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                applyFilters={applyFilters}
              />
            </div>

            {/* Freelancer Listings */}
            <div className="flex-1 w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5">
                {t('vendor_profiles_page.title') || 'Vendor Profiles'}
              </h1>

              {/* Sort Section */}
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-4 sm:mb-5 gap-3 sm:gap-4 relative">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <p>
                    {t('vendor_profiles_page.sort.showing_x_of_y', { visible: sortedFreelancers.length, total: vendors.length })}
                  </p>
                  <span>{t('vendor_profiles_page.sort.sort_by') || 'Sort by:'}</span>
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center gap-1 border border-gray-300 px-2 sm:px-3 py-1 rounded-md bg-white hover:bg-gray-100"
                    >
                      {sortValue} <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {sortOpen && (
                      <div className="absolute mt-1 right-0 w-40 sm:w-48 max-w-[90vw] bg-white border border-gray-300 rounded-md shadow-lg z-20">
                        {sortOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSortValue(option);
                              setSortOpen(false);
                            }}
                            className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm text-gray-700"
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
              {loadingVendors ? (
                <Loading />
              ) : sortedFreelancers.length === 0 ? (
                <p className="text-gray-500 text-center py-12">{t('vendor_profiles_page.empty', 'No vendors listed yet. Vendors appear here after they complete registration.')}</p>
              ) : (
                <Suspense fallback={<Loading />}>
                  <FreelancerList freelancers={sortedFreelancers} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}