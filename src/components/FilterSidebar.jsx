import React, { useState } from "react";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([50, 200]);
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-lg shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('freelancer.filters.title')}</h2>
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Work Mode */}
      <Accordion title={t('freelancer.filters.work_mode')}>
        <CheckboxList items={[t('freelancer.filters.options.remote'), t('freelancer.filters.options.in_person'), t('freelancer.filters.options.hybrid')]} />
      </Accordion>

      {/* Specialized Skills Categories */}
      <Accordion title={t('freelancer.filters.specialized_skills')}>
        <CheckboxList items={t('freelancer.hero.filters', { returnObjects: true })} />
      </Accordion>

      {/* Category */}
      <Accordion title={t('freelancer.filters.category')}>
        <CategoryList
          groups={{
            [t('freelancer.filters.options.groups.dev_tech')]: [
              t('freelancer.categories.web_dev'),
              t('freelancer.categories.mobile_dev'),
              t('freelancer.categories.software_dev'),
              t('freelancer.categories.game_dev'),
              t('freelancer.categories.ai_ml'),
              t('freelancer.categories.data_science'),
              t('freelancer.categories.cybersecurity'),
              t('freelancer.categories.blockchain'),
            ],
            [t('freelancer.filters.options.groups.design')]: [
              t('freelancer.categories.graphics'),
              t('freelancer.categories.ui_ux'),
              t('freelancer.categories.web_design'),
              t('freelancer.categories.3d_modeling'),
              t('freelancer.categories.video_editing'),
              t('freelancer.categories.photography'),
              t('freelancer.categories.motion_graphics'),
            ],
            [t('freelancer.filters.options.groups.writing')]: [
              t('freelancer.categories.content_writing'),
              t('freelancer.categories.copywriting'),
              t('freelancer.categories.technical_writing'),
              t('freelancer.categories.blog_writing'),
              t('freelancer.categories.translation'),
              t('freelancer.categories.proofreading'),
              t('freelancer.categories.research'),
            ],
            [t('freelancer.filters.options.groups.marketing')]: [
              t('freelancer.categories.digital_marketing'),
              t('freelancer.categories.social_media'),
              t('freelancer.categories.seo'),
              t('freelancer.categories.email_marketing'),
              t('freelancer.categories.branding'),
              t('freelancer.categories.lead_gen'),
              t('freelancer.categories.influencer'),
            ],
            [t('freelancer.filters.options.groups.business')]: [
              t('freelancer.categories.virtual_assist'),
              t('freelancer.categories.project_mgmt'),
              t('freelancer.categories.customer_support'),
              t('freelancer.categories.hr'),
              t('freelancer.categories.business_consulting'),
              t('freelancer.categories.legal'),
            ],
            [t('freelancer.filters.options.groups.finance')]: [
              t('freelancer.categories.bookkeeping'),
              t('freelancer.categories.financial_planning'),
              t('freelancer.categories.tax'),
              t('freelancer.categories.payroll'),
              t('freelancer.categories.crypto'),
            ],
            [t('freelancer.filters.options.groups.education')]: [
              t('freelancer.categories.tutoring'),
              t('freelancer.categories.language'),
              t('freelancer.categories.it_training'),
              t('freelancer.categories.coaching'),
            ],
            [t('freelancer.filters.options.groups.local')]: [
              t('freelancer.categories.repair'),
              t('freelancer.categories.network'),
              t('freelancer.categories.printing'),
              t('freelancer.categories.event'),
              t('freelancer.categories.delivery'),
            ],
          }}
        />
      </Accordion>

      {/* Company Name & Field of Operation */}
      <Accordion title={t('freelancer.filters.company_field')}>
        <CheckboxList
          items={[
            "Acme Corp — Web & Mobile Development",
            "Global Solutions — Cybersecurity & Cloud Services",
            "Orange Guinea — Telecom & Fintech",
          ]}
        />
      </Accordion>

      {/* Availability */}
      <Accordion title={t('freelancer.filters.availability')}>
        <CheckboxList items={[t('freelancer.filters.options.full_time'), t('freelancer.filters.options.part_time'), t('freelancer.filters.options.contract')]} />
      </Accordion>

      {/* Ratings */}
      <Accordion title={t('freelancer.filters.ratings')} hasBorder>
        <CheckboxList items={[t('freelancer.filters.options.stars_5'), t('freelancer.filters.options.stars_4_up'), t('freelancer.filters.options.stars_3_up')]} />
      </Accordion>

      {/* Price Range */}
      <Accordion title={t('freelancer.filters.price')} hasBorder>
        <div className="grid gap-4">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-full accent-blue-600"
          />

          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </Accordion>

      {/* Apply Filter Button */}
      <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full">
        {t('freelancer.filters.apply')}
      </button>
    </div>
  );
}

/* Accordion Component */
function Accordion({ title, children, hasBorder = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${hasBorder ? "border-b border-gray-300" : ""} py-2`}>
      <button
        className="flex justify-between items-center w-full text-left text-base font-medium"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

/* Flat Checkbox List */
function CheckboxList({ items }) {
  return (
    <ul className="grid gap-2 text-sm mt-2">
      {items.map((item, index) => (
        <li key={index}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox accent-blue-600" />
            {item}
          </label>
        </li>
      ))}
    </ul>
  );
}

/* Nested Category List (Groups + Sub-items) */
function CategoryList({ groups }) {
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([group, items], idx) => (
        <div key={idx}>
          <p className="font-medium text-sm text-gray-700">{group}</p>
          <CheckboxList items={items} />
        </div>
      ))}
    </div>
  );
}
