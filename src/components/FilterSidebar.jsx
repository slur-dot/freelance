import React, { useState } from "react";
import { SlidersHorizontal, ChevronRight } from "lucide-react";

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([50, 200]);

  return (
    <div className="p-4 rounded-lg shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Work Mode */}
      <Accordion title="Work Mode">
        <CheckboxList items={["Remote", "In-Person", "Hybrid"]} />
      </Accordion>

      {/* Specialized Skills Categories */}
      <Accordion title="Specialized Skills">
        <CheckboxList items={[
          "Business Applications",
          "Cloud & Infrastructure", 
          "Cyber Security",
          "Data & Analytics",
          "SAP",
          "Software Development"
        ]} />
      </Accordion>

      {/* Category */}
      <Accordion title="Category">
        <CategoryList
          groups={{
            "Development & Tech": [
              "Web Development",
              "Mobile App Development",
              "Software Development",
              "Game Development",
              "AI & Machine Learning",
              "Data Science & Analytics",
              "Cybersecurity & Networking",
              "Blockchain & Crypto",
            ],
            "Design & Creative": [
              "Graphics & Branding Design",
              "UI/UX Design",
              "Web & App Design",
              "3D Modeling & Animation",
              "Video Editing & Production",
              "Photography & Image Editing",
              "Motion Graphics",
            ],
            "Writing & Translation": [
              "Content Writing",
              "Copywriting",
              "Technical Writing",
              "Blog & Article Writing",
              "Translation Services (FR ↔ EN, Local Languages)",
              "Proofreading & Editing",
              "Research & Academic Writing",
            ],
            "Marketing & Sales": [
              "Digital Marketing",
              "Social Media Management",
              "SEO & SEM",
              "Email Marketing",
              "Branding & Strategy",
              "Lead Generation",
              "Influencer Marketing",
            ],
            "Business & Administration": [
              "Virtual Assistance",
              "Project Management",
              "Customer Support",
              "HR & Recruitment",
              "Business Consulting",
              "Legal Assistance",
            ],
            "Finance & Accounting": [
              "Bookkeeping",
              "Financial Planning",
              "Tax Consulting",
              "Payroll Management",
              "Crypto & Fintech Services",
            ],
            "Education & Training": [
              "Online Tutoring",
              "Language Lessons",
              "IT & Tech Training",
              "Business Coaching",
            ],
            "Local Services (for Guinea)": [
              "Device Repair (Laptops, Smartphones, Desktops)",
              "Internet & Network Setup",
              "Printing & Branding Materials",
              "Event Planning & Promotion",
              "Delivery & Logistics Services",
            ],
          }}
        />
      </Accordion>

      {/* Company Name & Field of Operation */}
      <Accordion title="Company Name & Field of Operation">
        <CheckboxList
          items={[
            "Acme Corp — Web & Mobile Development",
            "Global Solutions — Cybersecurity & Cloud Services",
            "Orange Guinea — Telecom & Fintech",
          ]}
        />
      </Accordion>

      {/* Availability */}
      <Accordion title="Availability">
        <CheckboxList items={["Full-time", "Part-time", "Contract"]} />
      </Accordion>

      {/* Ratings */}
      <Accordion title="Ratings" hasBorder>
        <CheckboxList items={["5 Stars", "4 Stars & Up", "3 Stars & Up"]} />
      </Accordion>

      {/* Price Range */}
      <Accordion title="Price" hasBorder>
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
        Apply Filter
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
