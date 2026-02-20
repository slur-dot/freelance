
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubscriptionPlan from "./SubscriptionPlan";
import coursesImg from "../../assets/Courses_image.png";

const defaultFreelanceCourses = [
  {
    id: 1,
    image: coursesImg,
    videos: "10",
    hours: "5",
    price: "176,000 GNF",
    priceUSD: "$20",
  },
  {
    id: 2,
    image: coursesImg,
    videos: "8",
    hours: "4",
    price: "132,000 GNF",
    priceUSD: "$15",
  },
  {
    id: 3,
    image: coursesImg,
    videos: "12",
    hours: "6",
    price: "220,000 GNF",
    priceUSD: "$25",
  },
];

export default function FreelanceCourses({ courses = defaultFreelanceCourses }) {
  const [sortOption, setSortOption] = useState("popular");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToCourse = (course) => {
    navigate(`/training-modules/course/${course.id}`, {
      state: { course: { ...course, title: t(`training.courses.freelance.course_${course.id}.title`) } },                                 // ✅ pass data
    });
  };

  const handleEnroll = (course) => {
    goToCourse(course);                                  // just reuse navigation
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    console.log("Sort by:", e.target.value);
  };

  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result);
    // You can add any additional logic here if needed
  };

  return (
    <section className="w-full py-10">
      <h2 className="text-2xl font-bold mb-6">{t('training.modules.title_freelance')}</h2>

      {/* Header Section */}
      <div className="flex justify-end items-center mb-6 gap-6">
        <p className="text-gray-600 text-sm">
          {t('training.modules.showing', { start: 1, end: 3, total: 100 })}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700 text-sm">
            {t('training.modules.sort.label')}
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">{t('training.modules.sort.popular')}</option>
            <option value="newest">{t('training.modules.sort.newest')}</option>
            <option value="priceLow">{t('training.modules.sort.price_low')}</option>
            <option value="priceHigh">{t('training.modules.sort.price_high')}</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-400 cursor-pointer"
            onClick={() => goToCourse(course)}                 // ✅ click anywhere on card
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goToCourse(course)}
          >
            {/* Image */}
            <img
              src={course.image}
              alt={t(`training.courses.freelance.course_${course.id}.title`)}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t(`training.courses.freelance.course_${course.id}.title`)}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t(`training.courses.freelance.course_${course.id}.description`)}
              </p>

              {/* Info */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {t('training.modules.card.videos', { count: course.videos })}
                </span>
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {t('training.modules.card.hours', { count: course.hours })}
                </span>
              </div>

              {/* Price & Button */}
              <div
                className="flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-green-700">
                    {course.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.priceUSD}
                  </span>
                </div>
                <button
                  onClick={() => handleEnroll(course)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-2xl -ml-2"
                >
                  {t('training.modules.card.enroll_now')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Plan */}
      <SubscriptionPlan
        planType="freelancer"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
