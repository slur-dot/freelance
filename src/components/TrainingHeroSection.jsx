import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import TrainingHeroBg from "../assets/Training_hero.png";
import TrainingHeroIcon from "../assets/Traiining_heroIcon.png";

export default function TrainingHeroSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image */}
      <img
        src={TrainingHeroBg}
        alt="Training Modules Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

      {/* Decorative Icons */}
      <div className="absolute top-8 left-12 z-10">
        <div className="absolute top-40 left-40 z-10">
          <img
            src={TrainingHeroIcon}
            alt="Decorative Wavy Icon"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>
        <div className="bg-green-500 p-2 ml-70 mt-25 rounded-md flex items-center justify-center shadow-lg">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <div className="mr-40 mt-40 bg-blue-600 p-2 rounded-md rotate-45 flex items-center justify-center shadow-lg">
          <Zap className="h-8 w-8 text-white -rotate-45" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Tailored Training for Companies & Freelancers
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-snug">
            Customized Learning Solutions for Your Business Needs or <br />
            <span className="block">Request Courses to Upskill!</span>
          </p>
          <Link
            to="#"
            className="inline-flex items-center justify-center px-6 py-3 mt-6 text-base font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            Explore Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
