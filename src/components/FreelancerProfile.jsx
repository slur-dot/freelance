import React, { Suspense, useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  Star,
  Heart,
  MessageSquareText,
  AlignJustify,
  ExternalLink,
} from "lucide-react";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import FilterSidebar from "./FilterSidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Enhanced freelancer data with specialized skills
const mockFreelancers = [
  {
    id: "freelancer-1",
    name: "Fatima Diallo",
    company: "Tech Solutions Guinea",
    skills: ["SAP Consultant", "IT Support Specialist", "Business Applications"],
    category: "Business Applications",
    rating: 4.9,
    reviews: 15,
    hourlyRate: "150,000 GNF",
    quote: "Excellent SAP implementation skills, delivered our ERP project ahead of schedule!",
    quoteAuthor: "Moussa Camara",
    image: HireFreelanceImage,
    location: "Conakry (Kaloum)",
    experience: "5+ years",
    availability: "Available Now",
    portfolio: "https://portfolio.fatima-diallo.com"
  },
  {
    id: "freelancer-2",
    name: "Ibrahim Bah",
    company: "CloudTech Africa",
    skills: ["AWS", "Azure", "Cloud Infrastructure", "DevOps"],
    category: "Cloud & Infrastructure",
    rating: 4.8,
    reviews: 22,
    hourlyRate: "180,000 GNF",
    quote: "Outstanding cloud migration expertise. Highly recommended for infrastructure projects.",
    quoteAuthor: "Fatoumata Barry",
    image: HireFreelanceImage,
    location: "Kindia (Prefecture)",
    experience: "7+ years",
    availability: "Available Now",
    portfolio: "https://portfolio.ibrahim-bah.com"
  },
  {
    id: "freelancer-3",
    name: "Mariama Keita",
    company: "CyberSec Pro",
    skills: ["Penetration Testing", "Security Audits", "Network Security"],
    category: "Cyber Security",
    rating: 4.9,
    reviews: 18,
    hourlyRate: "200,000 GNF",
    quote: "Top-notch security expert. Helped us identify and fix critical vulnerabilities.",
    quoteAuthor: "Alpha Diallo",
    image: HireFreelanceImage,
    location: "Conakry (Dixinn)",
    experience: "6+ years",
    availability: "Available Now",
    portfolio: "https://portfolio.mariama-keita.com"
  },
  {
    id: "freelancer-4",
    name: "Sekou Traore",
    company: "Data Insights Guinea",
    skills: ["Python", "Machine Learning", "Data Visualization", "SQL"],
    category: "Data & Analytics",
    rating: 4.7,
    reviews: 25,
    hourlyRate: "160,000 GNF",
    quote: "Brilliant data analyst. Transformed our business intelligence capabilities.",
    quoteAuthor: "Aissatou Diallo",
    image: HireFreelanceImage,
    location: "Kankan (Prefecture)",
    experience: "4+ years",
    availability: "Available Now",
    portfolio: "https://portfolio.sekou-traore.com"
  },
  {
    id: "freelancer-5",
    name: "Fatou Camara",
    company: "SAP Solutions West Africa",
    skills: ["SAP FICO", "SAP MM", "SAP SD", "SAP HANA"],
    category: "SAP",
    rating: 4.9,
    reviews: 30,
    hourlyRate: "220,000 GNF",
    quote: "Exceptional SAP consultant. Deep expertise in multiple SAP modules.",
    quoteAuthor: "Mohamed Bah",
    image: HireFreelanceImage,
    location: "Conakry",
    experience: "8+ years",
    availability: "Available Now"
  },
  {
    id: "freelancer-6",
    name: "Boubacar Diallo",
    company: "CodeCraft Guinea",
    skills: ["React", "Node.js", "Python", "Mobile Development"],
    category: "Software Development",
    rating: 4.8,
    reviews: 20,
    hourlyRate: "140,000 GNF",
    quote: "Excellent developer. Clean code and great communication throughout the project.",
    quoteAuthor: "Kadiatou Barry",
    image: HireFreelanceImage,
    location: "Conakry",
    experience: "5+ years",
    availability: "Available Now"
  },
  {
    id: "freelancer-7",
    name: "Aicha Sow",
    company: "BusinessTech Solutions",
    skills: ["Oracle ERP", "Business Process", "System Integration"],
    category: "Business Applications",
    rating: 4.6,
    reviews: 12,
    hourlyRate: "170,000 GNF",
    quote: "Professional business application expert. Great attention to detail.",
    quoteAuthor: "Ibrahima Keita",
    image: HireFreelanceImage,
    location: "Conakry",
    experience: "6+ years",
    availability: "Available Now"
  },
  {
    id: "freelancer-8",
    name: "Mamadou Barry",
    company: "CloudFirst Africa",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS"],
    category: "Cloud & Infrastructure",
    rating: 4.7,
    reviews: 16,
    hourlyRate: "190,000 GNF",
    quote: "Outstanding DevOps engineer. Automated our entire deployment pipeline.",
    quoteAuthor: "Mariama Diallo",
    image: HireFreelanceImage,
    location: "Conakry",
    experience: "5+ years",
    availability: "Available Now"
  }
];

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
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="Save to Favorites">
              <Heart className="w-4 h-4" />
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
            onClick={() => navigate("/hire-freelancers/info/job-post")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-2 rounded-md transition-colors"
          >
            {t('freelancer.profile.actions.bid')}
          </button>
          <button
            onClick={() => navigate("/hire-freelancers/info")}
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

  const sortOptions = [
    t('freelancer.sort.options.popular'),
    t('freelancer.sort.options.rated_high'),
    t('freelancer.sort.options.rated_low'),
    t('freelancer.sort.options.newest')
  ];

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

              {/* Sort Section */}
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-5 gap-4 relative">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <p>{t('freelancer.sort.showing', { start: 1, end: 100, total: 100 })}</p>
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
              <Suspense fallback={<Loading />}>
                <FreelancerList freelancers={mockFreelancers} />
              </Suspense>

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
