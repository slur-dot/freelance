import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { guineaCitiesByRegion } from "../data/guineaCities";

export default function FilterSidebar() {
  const { t } = useTranslation();
  
  // Flatten prefectures from all regions
  const allPrefectures = useMemo(() => {
    return guineaCitiesByRegion.flatMap(region => region.prefectures);
  }, []);

  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedSubprefecture, setSelectedSubprefecture] = useState("");

  const handlePrefectureChange = (e) => {
    setSelectedPrefecture(e.target.value);
    setSelectedSubprefecture(""); // reset subprefecture when prefecture changes
  };

  const handleSubprefectureChange = (e) => {
    setSelectedSubprefecture(e.target.value);
  };

  // Find subprefectures for the selected prefecture
  const activeSubprefectures = useMemo(() => {
    if (!selectedPrefecture) return [];
    const pref = allPrefectures.find(p => p.name === selectedPrefecture);
    return pref ? pref.subprefectures : [];
  }, [selectedPrefecture, allPrefectures]);

  return (
    <div className="p-4 rounded-lg shadow-inner bg-white border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('freelancer.filters.title') || 'Filters'}</h2>
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </div>

      {/* Geography Filters (Prefecture & Subprefecture) */}
      <div className="space-y-6">
        
        {/* Prefecture */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Prefecture
          </label>
          <select 
            value={selectedPrefecture}
            onChange={handlePrefectureChange}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
          >
            <option value="">All Prefectures</option>
            {allPrefectures.map((pref, idx) => (
              <option key={idx} value={pref.name}>
                {pref.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subprefecture */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Subprefecture</label>
          <select 
            value={selectedSubprefecture}
            onChange={handleSubprefectureChange}
            disabled={!selectedPrefecture}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 bg-gray-50"
          >
            <option value="">{selectedPrefecture ? 'All Subprefectures' : 'Select a Prefecture first'}</option>
            {activeSubprefectures.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Apply Filter Button */}
      <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-medium transition-colors">
        {t('freelancer.filters.apply') || 'Apply Filters'}
      </button>
    </div>
  );
}

/* Accordion Component (Kept for future use) */
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
