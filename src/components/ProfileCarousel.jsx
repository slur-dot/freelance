
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import profileImage from "../assets/profile-image.jpg"; 

const ProfileCarousel = ({ profiles }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const updateVisibleCards = useCallback(() => {
    const width = window.innerWidth;
    if (width < 480) setVisibleCards(1);
    else if (width < 768) setVisibleCards(2);
    else if (width < 1024) setVisibleCards(3);
    else if (width < 1280) setVisibleCards(4);
    else setVisibleCards(5);
  }, []);

  useEffect(() => {
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [updateVisibleCards]);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % profiles.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, profiles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % profiles.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + profiles.length) % profiles.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const maxSlide = Math.max(0, profiles.length - visibleCards);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${Math.min(currentSlide, maxSlide) * (100 / visibleCards)}%)`,
            width: `${(profiles.length * 100) / visibleCards}%`,
          }}
        >
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="px-2 flex-shrink-0"
              style={{ width: `${100 / profiles.length}%` }}
            >
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center text-black shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                  {profile.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight">{profile.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white/10 hover:bg-white/20 rounded-full p-2 hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white/10 hover:bg-white/20 rounded-full p-2 hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
        {profiles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-blue-600" : "bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileCarousel;
