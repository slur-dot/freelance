
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   
import SubscriptionPlan from "./SubscriptionPlan";
import coursesImg from "../../assets/Courses_image.png";

const defaultFreelanceCourses = [
  {
    id: 1,
    image: coursesImg,
    title: "Web Development Basics",
    description:
      "Master the foundational skills of web development. Learn HTML, CSS, and JavaScript from scratch with hands-on projects and real-world applications.",
    videos: "10 Videos",
    hours: "5 hours",
    price: "176,000 GNF",
    priceUSD: "$20",
  },
  {
    id: 2,
    image: coursesImg,
    title: "Graphic Design for Beginners",
    description:
      "Learn the fundamentals of graphic design, including typography, color theory, and layout principles using industry-standard tools.",
    videos: "8 Videos",
    hours: "4 hours",
    price: "132,000 GNF",
    priceUSD: "$15",
  },
  {
    id: 3,
    image: coursesImg,
    title: "Social Media Marketing",
    description:
      "Master social media marketing strategies, content creation, and analytics to grow your personal brand or business online.",
    videos: "12 Videos",
    hours: "6 hours",
    price: "220,000 GNF",
    priceUSD: "$25",
  },
];

export default function FreelanceCourses({ courses = defaultFreelanceCourses }) {
  const [sortOption, setSortOption] = useState("popular");
  const navigate = useNavigate();

  const goToCourse = (course) => {
    navigate(`/training-modules/course/${course.id}`, {
      state: { course },                                 // ✅ pass data
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
      <h2 className="text-2xl font-bold mb-6">Courses</h2>

      {/* Header Section */}
      <div className="flex justify-end items-center mb-6 gap-6">
        <p className="text-gray-600 text-sm">Showing 1-3 of 100 Courses</p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700 text-sm">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
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
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>

              {/* Info */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {course.videos}
                </span>
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {course.hours}
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
                  Enroll Now
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
