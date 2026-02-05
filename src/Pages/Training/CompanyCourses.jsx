import React, { useState } from "react";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SubscriptionPlan from "./SubscriptionPlan";
import coursesImg from "../../assets/Courses_image.png";

const defaultCompanyCourses = [
  {
    id: 1,
    image: coursesImg,
    title: "SAP ERP Implementation",
    description:
      "Comprehensive training on SAP ERP systems for enterprise resource planning. Learn configuration, customization, and best practices for business process optimization.",
    videos: "15 Videos",
    hours: "8 hours",
    price: "440,000 GNF",
    priceUSD: "$50",
    pricePer: "/user",
    bulkPrice: "3,520,000 GNF",
    bulkPriceUSD: "$400",
    bulkUsers: "10 users",
  },
  {
    id: 2,
    image: coursesImg,
    title: "Team Leadership Skills",
    description:
      "Develop essential leadership skills for managing teams effectively. Learn communication, motivation, conflict resolution, and strategic planning techniques.",
    videos: "10 Videos",
    hours: "5 hours",
    price: "352,000 GNF",
    priceUSD: "$40",
    pricePer: "/user",
    bulkPrice: "2,816,000 GNF",
    bulkPriceUSD: "$320",
    bulkUsers: "10 users",
  },
  {
    id: 3,
    image: coursesImg,
    title: "Cybersecurity for Businesses",
    description:
      "Essential cybersecurity training for businesses. Learn threat assessment, security protocols, data protection, and incident response strategies.",
    videos: "12 Videos",
    hours: "6 hours",
    price: "396,000 GNF",
    priceUSD: "$45",
    pricePer: "/user",
    bulkPrice: "3,168,000 GNF",
    bulkPriceUSD: "$360",
    bulkUsers: "10 users",
  },
];

export default function CompanyCourses({ courses = defaultCompanyCourses }) {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("popular");

  const handleEnroll = (course) => {
    // Navigate to team enrollment page, pass selected course id/info if needed
    navigate("/training-modules/company/enroll-team", { state: { course } });
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
      <h2 className="text-2xl font-bold mb-6">Pre Built Courses</h2>

      {/* Header Section */}
      <div className="flex justify-end items-center mb-6 gap-6">
        <p className="text-gray-600 text-sm">Showing 1-3 of 42 Courses</p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-company" className="text-gray-700 text-sm">
            Sort by:
          </label>
          <select
            id="sort-company"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="durationLow">Shortest Duration</option>
            <option value="durationHigh">Longest Duration</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-400"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {course.videos}
                </span>
                <span className="bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {course.hours}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Individual Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-green-700">
                      {course.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.priceUSD} {course.pricePer}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Enroll Team
                  </button>
                </div>
                
                {/* Bulk Pricing */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUsers className="text-blue-600 text-sm" />
                    <span className="text-sm font-medium text-blue-800">Bulk Discount Available</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-blue-700">
                      {course.bulkPrice}
                    </span>
                    <span className="text-xs text-blue-600">
                      {course.bulkPriceUSD} for {course.bulkUsers}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Training Request Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/training-modules/company/custom-request")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-base font-medium shadow-md transition-all"
        >
          Custom Training Request <FaArrowRight className="text-sm" />
        </button>
      </div>

      {/* Company Subscription Plan */}
      <SubscriptionPlan 
        planType="company" 
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
