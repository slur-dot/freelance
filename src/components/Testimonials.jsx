import React, { useState, useEffect } from "react";
import clientImage from "../assets/client_image.png";
import { useTranslation } from "react-i18next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const fetchedTestimonials = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) {
    return null; // Hide the section entirely if no real data is available
  }

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-5 sm:mb-8">
          <div className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-medium bg-blue-500 text-white">
            {t('home.testimonials.badge')}
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t('home.testimonials.title')}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {t('home.testimonials.subtitle')}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col items-center text-center px-4 sm:px-6 py-6 sm:py-8 bg-white shadow-md rounded-xl transition hover:shadow-lg max-w-full sm:max-w-md mx-auto"
            >
              <div className={`text-4xl sm:text-5xl font-bold mb-4 ${testimonial.quoteColor}`}>
                &ldquo;
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-900 mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <img
                src={testimonial.avatar}
                alt={`${testimonial.company} representative`}
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-4 border-white shadow object-cover mb-3"
              />
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  {testimonial.company}
                </h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${index === 0
                  ? "bg-blue-500 scale-110"
                  : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
