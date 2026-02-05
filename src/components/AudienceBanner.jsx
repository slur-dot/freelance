import React from "react";
import { FaUsers, FaBuilding, FaHandsHelping, FaGlobe, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AudienceBanner() {
  const audienceCards = [
    {
      icon: <FaUsers className="text-2xl text-blue-600" />,
      title: "Guinean Locals",
      description: "Shop smartphones, rent devices, find freelance work, and access training in your prefecture",
      features: ["Local smartphone sales", "Device rentals", "Freelance opportunities", "Skills training"],
      link: "/shop",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <FaGlobe className="text-2xl text-green-600" />,
      title: "Foreigners & Expats",
      description: "Get tech solutions, device rentals, and connect with local freelancers for your needs",
      features: ["Expat-friendly services", "Local freelancer network", "Device rentals", "Tech support"],
      link: "/hire-freelancers",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <FaBuilding className="text-2xl text-purple-600" />,
      title: "Companies",
      description: "Enterprise tech solutions, ERP/SAP implementation, IT support, and device procurement",
      features: ["ERP/SAP solutions", "IT support", "Device procurement", "Team training"],
      link: "/tech-services",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <FaHandsHelping className="text-2xl text-orange-600" />,
      title: "NGOs",
      description: "Specialized tech support, device rentals, and training programs for development organizations",
      features: ["NGO tech support", "Bulk device rentals", "Staff training", "Development solutions"],
      link: "/corporate-sales",
      color: "bg-orange-50 border-orange-200"
    },
    {
      icon: <FaUserTie className="text-2xl text-red-600" />,
      title: "Freelancers",
      description: "Find jobs, access training, showcase skills, and grow your career across Guinea's prefectures",
      features: ["Job opportunities", "Skills training", "Career growth", "Local networking"],
      link: "/freelancer/dashboard",
      color: "bg-red-50 border-red-200"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Serving All of Guinea's Communities
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From Conakry to Kankan, Labé to Nzérékoré - we provide comprehensive tech solutions for every community across Guinea's prefectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {audienceCards.map((audience, index) => (
            <div
              key={index}
              className={`${audience.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4">{audience.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{audience.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{audience.description}</p>
                
                <div className="space-y-2 mb-6 w-full">
                  {audience.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-700 bg-white/50 rounded-full px-3 py-1">
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  to={audience.link}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Whether you're a local resident, expat, company, NGO, or freelancer - we have the tech solutions you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us Today
              </Link>
              <Link
                to="/faq"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
