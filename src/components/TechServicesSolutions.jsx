import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useTranslation } from "react-i18next";

export default function TechServicesSolutions() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-16 mx-2 sm:mx-4 md:mx-8 lg:mx-16">
      {/* Breadcrumbs */}
      <div className="container mx-auto mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm text-gray-500">
        <Link to="/" className="hover:underline">
          {t('tech_services.solutions.breadcrumbs.home')}
        </Link>
        {" > "}
        <Link to="/tech-services" className="text-blue-500 hover:underline">
          {t('tech_services.solutions.breadcrumbs.tech_services')}
        </Link>
      </div>

      {/* Main Heading */}
      <div className="container mx-auto mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug sm:leading-tight">
          {t('tech_services.solutions.main_heading')}
        </h1>
      </div>

      {/* Sections */}
      <ServiceSection
        title={t('tech_services.solutions.erp.title')}
        description={t('tech_services.solutions.erp.description')}
        buttonText={t('tech_services.solutions.erp.btn')}
        cards={[
          {
            title: t('tech_services.solutions.erp.cards.impl.title'),
            description: t('tech_services.solutions.erp.cards.impl.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.impl.flip.title')}</p>
                <p>{t('tech_services.solutions.erp.cards.impl.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.impl.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.analysis_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.analysis_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.setup_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.setup_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.migration_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.migration_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.customization_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.customization_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.training_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.training_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.impl.flip.services.support_title')}</span> – {t('tech_services.solutions.erp.cards.impl.flip.services.support_desc')}</li>
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.impl.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.erp.cards.impl.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.erp.cards.impl.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.erp.cards.opt.title'),
            description: t('tech_services.solutions.erp.cards.opt.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.opt.flip.title')}</p>
                <p>{t('tech_services.solutions.erp.cards.opt.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.opt.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.process_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.process_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.selection_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.selection_desc')}</li>
                </ul>
                <div>
                  <p className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.platforms_title')}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {(t('tech_services.solutions.erp.cards.opt.flip.platforms_list', { returnObjects: true }) || []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.migration_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.migration_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.customization_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.customization_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.training_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.training_desc')}</li>
                  <li><span className="font-medium">{t('tech_services.solutions.erp.cards.opt.flip.services.support_title')}</span> – {t('tech_services.solutions.erp.cards.opt.flip.services.support_desc')}</li>
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.opt.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.erp.cards.opt.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.erp.cards.opt.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.erp.cards.custom.title'),
            description: t('tech_services.solutions.erp.cards.custom.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.custom.flip.title')}</p>
                <p>{t('tech_services.solutions.erp.cards.custom.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.custom.flip.industries_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.erp.cards.custom.flip.industries_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.erp.cards.custom.flip.solutions_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.erp.cards.custom.flip.solutions_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.erp.cards.custom.flip.conclusion')}</p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title={t('tech_services.solutions.it_support.title')}
        description={t('tech_services.solutions.it_support.description')}
        buttonText={t('tech_services.solutions.it_support.btn')}
        cards={[
          {
            title: t('tech_services.solutions.it_support.cards.support247.title'),
            description: t('tech_services.solutions.it_support.cards.support247.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.support247.flip.title')}</p>
                <p>{t('tech_services.solutions.it_support.cards.support247.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.support247.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.support247.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.support247.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.support247.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.it_support.cards.support247.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.it_support.cards.hardware.title'),
            description: t('tech_services.solutions.it_support.cards.hardware.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.hardware.flip.title')}</p>
                <p>{t('tech_services.solutions.it_support.cards.hardware.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.hardware.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.hardware.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.hardware.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.hardware.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.it_support.cards.hardware.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.it_support.cards.network.title'),
            description: t('tech_services.solutions.it_support.cards.network.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.network.flip.title')}</p>
                <p>{t('tech_services.solutions.it_support.cards.network.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.network.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.network.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.it_support.cards.network.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.it_support.cards.network.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.it_support.cards.network.flip.conclusion')}</p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title={t('tech_services.solutions.integration.title')}
        description={t('tech_services.solutions.integration.description')}
        buttonText={t('tech_services.solutions.integration.btn')}
        cards={[
          {
            title: t('tech_services.solutions.integration.cards.api.title'),
            description: t('tech_services.solutions.integration.cards.api.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.api.flip.title')}</p>
                <p>{t('tech_services.solutions.integration.cards.api.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.api.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.api.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.api.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.api.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.integration.cards.api.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.integration.cards.cloud.title'),
            description: t('tech_services.solutions.integration.cards.cloud.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.cloud.flip.title')}</p>
                <p>{t('tech_services.solutions.integration.cards.cloud.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.cloud.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.cloud.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.cloud.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.cloud.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.integration.cards.cloud.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.integration.cards.iot.title'),
            description: t('tech_services.solutions.integration.cards.iot.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.iot.flip.title')}</p>
                <p>{t('tech_services.solutions.integration.cards.iot.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.iot.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.iot.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.integration.cards.iot.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.integration.cards.iot.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.integration.cards.iot.flip.conclusion')}</p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title={t('tech_services.solutions.outsourcing.title')}
        description={t('tech_services.solutions.outsourcing.description')}
        buttonText={t('tech_services.solutions.outsourcing.btn')}
        cards={[
          {
            title: t('tech_services.solutions.outsourcing.cards.staffing.title'),
            description: t('tech_services.solutions.outsourcing.cards.staffing.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.staffing.flip.title')}</p>
                <p>{t('tech_services.solutions.outsourcing.cards.staffing.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.staffing.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.staffing.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.staffing.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.staffing.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.outsourcing.cards.staffing.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.outsourcing.cards.project.title'),
            description: t('tech_services.solutions.outsourcing.cards.project.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.project.flip.title')}</p>
                <p>{t('tech_services.solutions.outsourcing.cards.project.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.project.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.project.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.project.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.project.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.outsourcing.cards.project.flip.conclusion')}</p>
              </div>
            ),
          },
          {
            title: t('tech_services.solutions.outsourcing.cards.managed.title'),
            description: t('tech_services.solutions.outsourcing.cards.managed.desc'),
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.managed.flip.title')}</p>
                <p>{t('tech_services.solutions.outsourcing.cards.managed.flip.intro')}</p>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.managed.flip.services_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.managed.flip.services_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-semibold">{t('tech_services.solutions.outsourcing.cards.managed.flip.why_title')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(t('tech_services.solutions.outsourcing.cards.managed.flip.why_list', { returnObjects: true }) || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{t('tech_services.solutions.outsourcing.cards.managed.flip.conclusion')}</p>
              </div>
            ),
          },
        ]}
      />

      {/* Google Map Section */}
      <div className="container mx-auto mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t('tech_services.solutions.map_title')}
        </h2>
        <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 h-72 sm:h-96 rounded-lg overflow-hidden shadow-md mx-auto border border-gray-400">
          <iframe
            title="Conakry IT Consultants Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63624.05563747121!2d-13.725108300000001!3d9.641185050920002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xefdc292f2ed6d7af%3A0xe4e0ccbe67276dbf!2sConakry%2C%20Guinea!5e0!3m2!1sen!2s!4v1699964059000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

/* Section Component */
function ServiceSection({ title, description, cards, buttonText }) {
  return (
    <section className="container mx-auto mb-12 sm:mb-14 md:mb-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-3xl">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {cards.map((card, index) => (
          <ServiceCard
            key={index}
            title={card.title}
            description={card.description}
            flipContent={card.flipContent}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <ServiceButton text={buttonText} />
      </div>
    </section>
  );
}

/* Card Component */
function ServiceCard({ title, description, flipContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flipContent) {
    return (
      <div className="bg-green-50 border border-gray-600 rounded-lg shadow-md p-6 sm:p-8 h-40 sm:h-48 w-full flex flex-col justify-center space-y-2 sm:space-y-3 hover:shadow-lg transition-shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
      </div>
    );
  }

  return (
    <div
      className="h-40 sm:h-48 w-full [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTouchStart={() => setIsFlipped((prev) => !prev)}
      role="button"
      aria-label={`${title} details`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
    >
      <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 [backface-visibility:hidden] bg-green-50 border border-gray-600 rounded-lg shadow-md p-6 sm:p-8 h-40 sm:h-48 w-full flex flex-col justify-center space-y-2 sm:space-y-3 hover:shadow-lg transition-shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white border border-gray-600 rounded-lg shadow-md p-4 sm:p-5 h-40 sm:h-48 w-full overflow-hidden">
          <div className="h-full overflow-y-auto pr-2">
            {flipContent}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Button Component */
function ServiceButton({ text }) {
  return (
    <Link
      to="/tech-services/booking"
      className="inline-flex items-center justify-center rounded-full bg-blue-400 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
    >
      {text}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}
