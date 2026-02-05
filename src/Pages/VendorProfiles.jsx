import React, { Suspense, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Heart,
} from "lucide-react";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import { useNavigate } from "react-router-dom";

/* ---------------- Dummy Vendor Data ---------------- */
const mockFreelancers = [
  {
    id: "freelancer-1",
    name: "John Doe",
    company: "Conakry",
    rating: 4.9,
    reviews: 7,
    image: HireFreelanceImage,
    category: "Mobile",
    premium: true,
  },
  {
    id: "freelancer-2",
    name: "Jane Smith",
    company: "Abidjan",
    rating: 3.8,
    reviews: 12,
    image: HireFreelanceImage,
    category: "Laptop",
    premium: false,
  },
  {
    id: "freelancer-3",
    name: "Alex Brown",
    company: "Dakar",
    rating: 5,
    reviews: 20,
    image: HireFreelanceImage,
    category: "Tablet",
    premium: true,
  },
  {
    id: "freelancer-4",
    name: "Emily Green",
    company: "Lagos",
    rating: 2.5,
    reviews: 3,
    image: HireFreelanceImage,
    category: "Smartwatch",
    premium: false,
  },
  {
    id: "freelancer-5",
    name: "Michael Johnson",
    company: "Accra",
    rating: 4.2,
    reviews: 15,
    image: HireFreelanceImage,
    category: "Mobile",
    premium: true,
  },
  {
    id: "freelancer-6",
    name: "Sophia Lee",
    company: "Nairobi",
    rating: 3.5,
    reviews: 8,
    image: HireFreelanceImage,
    category: "Laptop",
    premium: false,
  },
  {
    id: "freelancer-7",
    name: "Daniel Kim",
    company: "Cape Town",
    rating: 4.7,
    reviews: 18,
    image: HireFreelanceImage,
    category: "Tablet",
    premium: true,
  },
  {
    id: "freelancer-8",
    name: "Olivia Wilson",
    company: "Johannesburg",
    rating: 3.9,
    reviews: 10,
    image: HireFreelanceImage,
    category: "Smartwatch",
    premium: false,
  },
];


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
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
            open ? "rotate-90" : ""
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
        <h2 className="text-base sm:text-lg font-semibold">Filters</h2>
        <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>

      {/* Category */}
      <Accordion title="Category">
        <CheckboxList
          items={["Mobile", "Laptop", "Tablet", "Smartwatch"]}
          selected={filters.category}
          onChange={(value) => toggleFilter("category", value)}
        />
      </Accordion>

      {/* Premium */}
      <Accordion title="Premium">
        <CheckboxList
          items={["Premium", "Non-Premium"]}
          selected={filters.premium}
          onChange={(value) => toggleFilter("premium", value)}
        />
      </Accordion>

      {/* Ratings */}
      <Accordion title="Ratings">
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
        Apply Filters
      </button>
    </div>
  );
}

/* ---------------- Freelancer Card ---------------- */
function FreelancerCard({ freelancer }) {
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
          onClick={() => navigate("/vendor-profiles/info")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md"
        >
          View Devices →
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
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("Most Popular");
  const [filters, setFilters] = useState({
    category: [],
    premium: [],
    rating: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const sortOptions = ["Most Popular", "Highest Rated", "Lowest Rated", "Newest"];

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  // Apply filters
  const filteredFreelancers = mockFreelancers.filter((f) => {
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
    if (sortValue === "Highest Rated") return b.rating - a.rating;
    if (sortValue === "Lowest Rated") return a.rating - b.rating;
    if (sortValue === "Newest") return b.id.localeCompare(a.id);
    return b.reviews - a.reviews; // default = Most Popular
  });

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-3 ml-2">
          <a href="/" className="hover:underline">
            Home
          </a>
          <span className="mx-1">&gt;</span>
          <span className="text-blue-600">Vendor Profiles</span>
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
                Vendor Profiles
              </h1>

              {/* Sort Section */}
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-4 sm:mb-5 gap-3 sm:gap-4 relative">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <p>
                    Showing {sortedFreelancers.length} of{" "}
                    {mockFreelancers.length} Freelancers
                  </p>
                  <span>Sort by:</span>
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
              <Suspense fallback={<Loading />}>
                <FreelancerList freelancers={sortedFreelancers} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}