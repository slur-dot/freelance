import React, { useState, useEffect } from "react";
import { Star, Trophy, Users, Languages } from "lucide-react";
import banner from "../assets/TechServicesHero.jpg"; 

// i18n content
const content = {
  en: {
    headline: "Our Journey: Youth, Innovation, Security",
    subheadline:
      "Freelance-224, founded by Guinean IT experts with global experience, empowers local talent through secure solutions, connecting SMEs, NGOs, institutions, and global users.",
    founding: `In 2024, Guinean youth and diaspora, with decades of IT expertise from freelancing for global firms, founded Freelance-224 to address unemployment in Conakry. Our secure, mobile-first platform delivers Cybersecurity, AI, Data Science, and IT services, alongside device purchases and rentals, prioritizing encrypted transactions for local SMEs, NGOs, and global clients. Example: “Launched with 18 secure alpha users in Conakry.”`,
    milestones: [
      "2024: Launched platform with secure alpha testing (18 users, encrypted data).",
      "2025: Secured partnerships with Orange Guinea and CCC; showcased secure platform at GFW 2025 (August 2025).",
      "2026: Target 1,500 users, 150M GNF revenue, expanded Cybersecurity/AI services.",
    ],
    partnerships: `Trusted by Orange Guinea and CCC, our platform, built by Guinean IT experts, delivers secure solutions for local SMEs, NGOs, institutions, and global users, fostering jobs and trust.`,
    cta: "Join Our Secure Mission",
    copyright:
      "© 2025 Freelance-224. Securing Guinean Talent, Connecting the World.",
  },
  fr: {
    headline: "Notre Parcours : Jeunesse, Innovation, Sécurité",
    subheadline:
      "Freelance-224, fondé par des experts informatiques guinéens avec une expérience internationale, valorise les talents locaux via des solutions sécurisées, reliant PME, ONG, institutions et utilisateurs mondiaux.",
    founding: `En 2024, des jeunes guinéens et de la diaspora, forts de décennies d’expertise IT acquises en freelance pour des entreprises mondiales, ont fondé Freelance-224 pour lutter contre le chômage à Conakry. Notre plateforme mobile-first et sécurisée propose la cybersécurité, l’IA, la Data Science et des services IT, ainsi que l’achat et la location d’appareils, avec transactions chiffrées pour PME, ONG et clients mondiaux. Exemple : “18 utilisateurs alpha sécurisés à Conakry.”`,
    milestones: [
      "2024 : Lancement de la plateforme avec tests alpha sécurisés (18 utilisateurs, données chiffrées).",
      "2025 : Partenariats avec Orange Guinée et CCC ; présentation sécurisée à GFW 2025 (août 2025).",
      "2026 : Objectif de 1 500 utilisateurs, 150M GNF de revenus, extension Cybersécurité/IA.",
    ],
    partnerships: `De confiance auprès d’Orange Guinée et de la CCC, notre plateforme, développée par des experts guinéens, propose des solutions sécurisées aux PME, ONG, institutions et utilisateurs mondiaux, renforçant emploi et confiance.`,
    cta: "Rejoignez Notre Mission Sécurisée",
    copyright:
      "© 2025 Freelance-224. Sécuriser les talents guinéens, connecter le monde.",
  },
};

export default function CompanyHistory() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "fr" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = content[lang];

  return (
    <main className="bg-white text-gray-800">
      {/* Banner */}
      <section className="relative">
        <img
          src={banner}
          alt="Guinean youth & diaspora experts at Conakry tech event"
          loading="lazy"
          className="w-full h-64 md:h-96 object-cover"
        />
        <button
          onClick={toggleLang}
          className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded shadow hover:bg-gray-100 flex items-center gap-1"
          aria-label="Switch Language"
        >
          <Languages className="w-4 h-4" />
          {lang === "en" ? "FR" : "EN"}
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {t.headline}
          </h1>
          <p className="text-gray-200 max-w-3xl">{t.subheadline}</p>
        </div>
      </section>

      {/* Founding */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-start gap-4">
          <Star
            className="w-6 h-6 text-yellow-500 flex-shrink-0"
            aria-label="Secure Founding"
          />
          <p className="text-gray-700 text-base leading-relaxed">{t.founding}</p>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <Trophy
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              aria-label="Secure Milestones"
            />
            <ul className="space-y-2 text-gray-700">
              {t.milestones.map((m, i) => (
                <li key={i} className="text-base leading-relaxed">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-start gap-4">
          <Users
            className="w-6 h-6 text-green-600 flex-shrink-0"
            aria-label="Secure Partnerships"
          />
          <p className="text-gray-700 text-base leading-relaxed">
            {t.partnerships}
          </p>
        </div>
        <div className="flex gap-6 mt-6">
          <img
            src="/logos/orange-guinea.svg"
            alt="Orange Guinea: Secure Payments"
            className="h-10"
            loading="lazy"
          />
          <img
            src="/logos/ccc.svg"
            alt="Conakry Chamber of Commerce"
            className="h-10"
            loading="lazy"
          />
        </div>
        <div className="mt-8">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            aria-label={t.cta}
          >
            {t.cta}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="/about-freelance" className="hover:text-white">
              About Freelance-224
            </a>
            <a href="/success-stories" className="hover:text-white">
              Success Stories
            </a>
            <a href="/what-we-do" className="hover:text-white">
              What We Do
            </a>
          </div>
          <p className="text-gray-400 text-center">{t.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
