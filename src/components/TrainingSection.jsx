import React from 'react';
import { Link } from 'react-router-dom';
import freelanceImage from "../assets/FreelanceImage.jpg";

const TrainingSection = () => {
  const trainingCourses = [
    {
      title: "Web Development Basics",
      description: "Learn HTML, CSS, and JavaScript fundamentals",
      duration: "4 weeks"
    },
    {
      title: "SAP ERP Implementation",
      description: "Master SAP systems for enterprise solutions",
      duration: "6 weeks"
    },
    {
      title: "Digital Marketing Strategy",
      description: "Build effective online marketing campaigns",
      duration: "3 weeks"
    }
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${freelanceImage})`,
        }}
      >
        <div className="w-full max-w-6xl mx-auto text-center text-white py-16 sm:py-20 md:py-28">
          <div className="inline-block px-4 py-2 bg-blue-600 rounded-full text-sm font-medium mb-6">
            For Freelancers & Companies
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-snug sm:leading-tight">
            Grow Your Skills or Customize Training for Your Team
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Request custom training for your company or new courses as a freelancer!
          </p>

          {/* Training Courses Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {trainingCourses.map((course, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-2 text-white">{course.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{course.description}</p>
                <span className="inline-block bg-blue-500/50 text-white text-xs px-3 py-1 rounded-full">
                  {course.duration}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-2">
            <Link to="/training-modules" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-8 text-base sm:text-lg font-semibold rounded-full transition-colors duration-300 flex items-center justify-center w-full sm:w-auto">
              Start Learning Now
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:px-8 text-base sm:text-lg rounded-full transition-colors duration-300 flex items-center justify-center w-full sm:w-auto">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingSection;
