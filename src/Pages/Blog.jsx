import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import blogCardImage from "../assets/BlogCard.png";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t } = useTranslation();
  const [selectedCat, setSelectedCat] = useState("business");
  const [showCategories, setShowCategories] = useState(true);

  const categories = [
    { id: "freelancing", name: t('blog.freelancing'), count: 10 },
    { id: "tech", name: t('blog.tech'), count: 8 },
    { id: "business", name: t('blog.business'), count: 20 },
    { id: "training", name: t('blog.training'), count: 29 },
  ];

  const blogPosts = Array(9).fill({
    image: blogCardImage,
    date: "21 Jul 2023",
    title: t('blog.post.title'),
  });

  const getDateParts = (dateStr) => {
    const [day, month, year] = dateStr.split(" ");
    return { day, month, year };
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Filter */}
            <div className="w-full lg:max-w-xs bg-white shadow-xl p-4 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setShowCategories((v) => !v)}
                className="w-full flex items-center justify-between pb-3 border-b border-gray-200 cursor-pointer"
                aria-expanded={showCategories}
                aria-controls="blog-categories-list"
              >
                <h2 className="text-lg font-semibold text-gray-900">{t('blog.categories')}</h2>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform ${showCategories ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              {showCategories && (
                <div id="blog-categories-list" className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      htmlFor={`cat-${category.id}`}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <span className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`cat-${category.id}`}
                          name="blog-category"
                          value={category.id}
                          checked={selectedCat === category.id}
                          onChange={() => setSelectedCat(category.id)}
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <span className="text-gray-700">{category.name}</span>
                      </span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-sm font-semibold uppercase text-gray-600 mb-2">{t('blog.explore_latest')}</h1>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('blog.blogs')}</h2>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row w-full mb-8">
                  <input
                    type="text"
                    placeholder={t('blog.search_placeholder')}
                    className="flex-1 h-12 bg-gray-100 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-tr-none px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button
                    type="button"
                    className="h-12 w-auto px-4 bg-[#228B22] hover:bg-[#1e7a1e] text-white rounded-b-md sm:rounded-r-md sm:rounded-bl-none flex items-center justify-center"
                  >
                    <ArrowRight className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </button>
                </div>
              </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => {
                  const { day, month, year } = getDateParts(post.date);
                  return (
                    <Link
                      to={`/blog/${index + 1}`}
                      key={index}
                      className="relative flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 h-full"
                    >
                      <img
                        src={post.image}
                        alt={`Blog post ${index + 1}`}
                        className="w-full h-48 sm:h-56 object-cover rounded-t-lg"
                      />

                      <div className="px-4 -mt-12 mb-4 z-10 flex-grow flex flex-col">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-300 rounded-md p-4 shadow-sm h-full">
                          <div className="text-left leading-tight min-w-[3.5rem] flex-shrink-0">
                            <div className="text-2xl font-bold text-gray-800">{day}</div>
                            <div className="text-xs text-gray-500 border-b border-gray-200 pb-1">
                              {month} {year}
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col h-full">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug mb-2 flex-grow">
                              {post.title}
                            </h3>
                            <span
                              className="text-green-600 group-hover:underline inline-flex items-center gap-1 text-sm font-medium mt-auto"
                            >
                              {t('blog.read_more')} <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Explore More */}
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  className="bg-[#228B22] hover:bg-[#1e7a1e] text-white px-8 py-3 rounded-full text-lg font-semibold flex items-center gap-2"
                >
                  {t('blog.explore_more')} <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <section className="relative bg-[#1e4a4a] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-lg w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#2a6060] rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2a6060] rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#2a6060] rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            {t('blog.referral_title')}
          </h2>
          <button className="bg-[#228B22] hover:bg-[#1e7a1e] text-white px-8 py-3 rounded-full text-lg font-semibold flex items-center gap-2">
            {t('blog.invite_friends')} <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </>
  );
}
