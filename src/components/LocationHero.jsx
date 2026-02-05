import React from "react";
import heroImage from "../assets/FreelancerlocationHero.jpg";

export default function LocationHero() {
  return (
    <section
      className="relative w-full py-20 md:py-32 lg:py-48 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative container px-4 md:px-6 text-center text-white z-10">
        <div className="mx-auto space-y-6">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="block">Freelancers Across Guinea's</span>
            <span className="block mt-2">Prefectures</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl">
            Find Local Talent in Conakry, Kankan, Labé, Nzérékoré, Kindia, Boké & All Prefectures – Perfect for Companies, NGOs, and Expats!
          </p>
        </div>
      </div>
    </section>
  );
}
