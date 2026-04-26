import React, { useState, useEffect } from "react";
import { ChevronRight, SlidersHorizontal, MapPin, Users, Briefcase } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom briefcase icon
const createBriefcaseIcon = () => {
  return L.divIcon({
    className: 'custom-briefcase-icon',
    html: `
      <div style="
        background-color: #15803D;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4V8h16v11z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

export default function FreelancerLocation({ activeTab = "freelancers" }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [selectedSubPrefecture, setSelectedSubPrefecture] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  
  const filters = ["Region", "Prefecture", "Sub-Prefecture", "Skills"];

  // Get all locations for filtering
  const getAllLocations = () => {
    const locations = [];
    guineaData.regions.forEach((region, regionIndex) => {
      region.prefectures.forEach((prefecture, prefectureIndex) => {
        prefecture.communes.forEach((commune, communeIndex) => {
          locations.push({
            ...commune,
            region: region.name,
            prefecture: prefecture.name,
            regionIndex,
            prefectureIndex,
            communeIndex
          });
        });
      });
    });
    return locations;
  };

  // Filter locations based on selected filters
  const filterLocations = () => {
    let locations = getAllLocations();

    if (selectedRegion) {
      locations = locations.filter(loc => loc.region === selectedRegion);
    }

    if (selectedPrefecture) {
      locations = locations.filter(loc => loc.prefecture === selectedPrefecture);
    }

    if (selectedSubPrefecture) {
      locations = locations.filter(loc => loc.name === selectedSubPrefecture);
    }

    if (selectedSkills.length > 0) {
      locations = locations.filter(loc => 
        loc.skills && loc.skills.some(skill => 
          selectedSkills.some(selectedSkill => 
            skill.toLowerCase().includes(selectedSkill.toLowerCase())
          )
        )
      );
    }

    setFilteredLocations(locations);
  };

  // Update filters when selections change
  useEffect(() => {
    filterLocations();
  }, [selectedRegion, selectedPrefecture, selectedSubPrefecture, selectedSkills]);

  // Get available prefectures for selected region
  const getAvailablePrefectures = () => {
    if (!selectedRegion) return [];
    const region = guineaData.regions.find(r => r.name === selectedRegion);
    return region ? region.prefectures.map(p => p.name) : [];
  };

  // Get available subprefectures for selected prefecture
  const getAvailableSubPrefectures = () => {
    if (!selectedPrefecture || !selectedRegion) return [];
    const region = guineaData.regions.find(r => r.name === selectedRegion);
    if (!region) return [];
    const prefecture = region.prefectures.find(p => p.name === selectedPrefecture);
    return prefecture ? prefecture.communes.map(c => c.name) : [];
  };

  // Comprehensive Guinea location data
  const guineaData = {
    regions: [
      {
        name: "Conakry Special Zone",
        capital: "Conakry (Camayenne)",
        population: "1,871,242",
        coordinates: [9.9456, -9.6966],
        prefectures: [
          {
            name: "Conakry",
            communes: [
              { 
                name: "Kaloum", 
                freelancers: 30, 
                coordinates: [9.5092, -13.7123],
                skills: ["IT Specialists", "Graphic Designers", "Business Consultants"]
              },
              { 
                name: "Dixinn", 
                freelancers: 25, 
                coordinates: [9.5476, -13.6745],
                skills: ["Marketers", "Social Media Managers", "Content Writers"]
              },
              { 
                name: "Matam", 
                freelancers: 20, 
                coordinates: [9.5355, -13.6865],
                skills: ["Software Engineers", "Web Developers", "Database Administrators"]
              },
              { 
                name: "Ratoma", 
                freelancers: 35, 
                coordinates: [9.5833, -13.6396],
                skills: ["IT Support", "Network Administrators", "System Analysts"]
              },
              { 
                name: "Matoto", 
                freelancers: 40, 
                coordinates: [9.5716, -13.6118],
                skills: ["App Developers", "Mobile Developers", "UI/UX Designers"]
              }
            ]
          }
        ]
      },
      {
        name: "Nzérékoré Region",
        capital: "Nzérékoré",
        population: "1,663,582",
        coordinates: [7.7472, -8.8237],
        prefectures: [
          {
            name: "Nzérékoré",
            communes: [
              { name: "Nzérékoré", freelancers: 28, coordinates: [7.7472, -8.8237] },
              { name: "Yomou", freelancers: 15, coordinates: [7.5667, -9.2667] },
              { name: "Guéckédou", freelancers: 22, coordinates: [8.5667, -10.1333] },
              { name: "Lola", freelancers: 18, coordinates: [7.8000, -8.5333] },
              { name: "Beyla", freelancers: 12, coordinates: [8.6833, -8.6500] }
            ]
          }
        ]
      },
      {
        name: "Kankan Region",
        capital: "Kankan",
        population: "1,972,537",
        coordinates: [10.3844, -9.3056],
        prefectures: [
          {
            name: "Kankan",
            communes: [
              { name: "Kankan", freelancers: 32, coordinates: [10.3844, -9.3056] },
              { name: "Siguiri", freelancers: 20, coordinates: [11.4167, -9.1667] },
              { name: "Kouroussa", freelancers: 16, coordinates: [10.6500, -9.8833] },
              { name: "Mandiana", freelancers: 14, coordinates: [10.6500, -8.7000] },
              { name: "Kérouané", freelancers: 18, coordinates: [9.2667, -9.0167] }
            ]
          }
        ]
      },
      {
        name: "Kindia Region",
        capital: "Kindia",
        population: "1,559,185",
        coordinates: [10.0569, -12.8653],
        prefectures: [
          {
            name: "Kindia",
            communes: [
              { name: "Kindia", freelancers: 25, coordinates: [10.0569, -12.8653] },
              { name: "Coyah", freelancers: 19, coordinates: [9.7000, -13.3833] },
              { name: "Dubréka", freelancers: 17, coordinates: [9.7833, -13.5167] },
              { name: "Forécariah", freelancers: 13, coordinates: [9.4333, -13.0833] },
              { name: "Télimélé", freelancers: 11, coordinates: [10.9000, -13.0333] }
            ]
          }
        ]
      },
      {
        name: "Labé Region",
        capital: "Labé",
        population: "1,001,392",
        coordinates: [11.3167, -12.2833],
        prefectures: [
          {
            name: "Labé",
            communes: [
              { name: "Labé", freelancers: 21, coordinates: [11.3167, -12.2833] },
              { name: "Koubia", freelancers: 8, coordinates: [11.5833, -11.8833] },
              { name: "Lélouma", freelancers: 9, coordinates: [11.4167, -12.9333] },
              { name: "Mali", freelancers: 7, coordinates: [12.0833, -12.3000] },
              { name: "Tougué", freelancers: 6, coordinates: [11.4500, -11.6667] }
            ]
          }
        ]
      },
      {
        name: "Mamou Region",
        capital: "Mamou",
        population: "731,188",
        coordinates: [10.3833, -12.0833],
        prefectures: [
          {
            name: "Mamou",
            communes: [
              { name: "Mamou", freelancers: 15, coordinates: [10.3833, -12.0833] },
              { name: "Dalaba", freelancers: 6, coordinates: [10.6833, -12.2500] },
              { name: "Pita", freelancers: 8, coordinates: [11.0667, -12.4000] }
            ]
          }
        ]
      },
      {
        name: "Faranah Region",
        capital: "Faranah",
        population: "941,554",
        coordinates: [10.0333, -10.7500],
        prefectures: [
          {
            name: "Faranah",
            communes: [
              { name: "Faranah", freelancers: 19, coordinates: [10.0333, -10.7500] },
              { name: "Dabola", freelancers: 12, coordinates: [10.1833, -11.1167] },
              { name: "Dinguiraye", freelancers: 10, coordinates: [11.3000, -10.7167] },
              { name: "Kissidougou", freelancers: 14, coordinates: [9.1833, -10.1000] }
            ]
          }
        ]
      },
      {
        name: "Boké Region",
        capital: "Boké",
        population: "1,083,147",
        coordinates: [10.9333, -14.2833],
        prefectures: [
          {
            name: "Boffa",
            mainTown: "Boffa (10.1833°N, -14.0333°W)",
            communes: [
              { name: "Douprou", freelancers: 8, coordinates: [10.1833, -14.0333] },
              { name: "Koba-Tatema", freelancers: 6, coordinates: [10.1833, -14.0333] },
              { name: "Mankountan", freelancers: 5, coordinates: [10.1833, -14.0333] },
              { name: "Tougnifili", freelancers: 7, coordinates: [10.1833, -14.0333] }
            ]
          },
          {
            name: "Boké",
            mainTown: "Boké (10.9333°N, -14.3000°W)",
            communes: [
              { name: "Dabiss", freelancers: 12, coordinates: [10.9333, -14.3000] },
              { name: "Kanfarandé", freelancers: 9, coordinates: [10.9333, -14.3000] },
              { name: "Kolaboui", freelancers: 11, coordinates: [10.9333, -14.3000] },
              { name: "Malapouya", freelancers: 8, coordinates: [10.9333, -14.3000] },
              { name: "Tanéné", freelancers: 10, coordinates: [10.9333, -14.3000] }
            ]
          },
          {
            name: "Fria",
            mainTown: "Fria (10.3667°N, -13.5833°W)",
            communes: [
              { name: "Baguinet", freelancers: 6, coordinates: [10.3667, -13.5833] },
              { name: "Tormelin", freelancers: 8, coordinates: [10.3667, -13.5833] }
            ]
          },
          {
            name: "Gaoual",
            mainTown: "Gaoual (11.7500°N, -13.2000°W)",
            communes: [
              { name: "Foulamory", freelancers: 4, coordinates: [11.7500, -13.2000] },
              { name: "Koumbia", freelancers: 5, coordinates: [11.7500, -13.2000] },
              { name: "Malanta", freelancers: 3, coordinates: [11.7500, -13.2000] },
              { name: "Wendou M'bour", freelancers: 6, coordinates: [11.7500, -13.2000] }
            ]
          },
          {
            name: "Koundara",
            mainTown: "Koundara (12.4833°N, -13.3000°W)",
            communes: [
              { name: "Guingan", freelancers: 3, coordinates: [12.4833, -13.3000] },
              { name: "Kamaby", freelancers: 4, coordinates: [12.4833, -13.3000] },
              { name: "Sambailo", freelancers: 2, coordinates: [12.4833, -13.3000] },
              { name: "Saréboido", freelancers: 3, coordinates: [12.4833, -13.3000] },
              { name: "Youkounkoun", freelancers: 5, coordinates: [12.4833, -13.3000] }
            ]
          }
        ]
      },
      {
        name: "Kankan Region",
        capital: "Kankan",
        population: "1,972,537",
        coordinates: [10.3844, -9.3056],
        prefectures: [
          {
            name: "Kankan",
            mainTown: "Kankan (10.3854°N, -9.3054°W)",
            communes: [
              { name: "Kankan", freelancers: 15, coordinates: [10.3854, -9.3054], skills: ["Miners", "Surveyors", "Geologists"] },
              { name: "Balandougou", freelancers: 8, coordinates: [10.3854, -9.3054] },
              { name: "Bate-Nafadji", freelancers: 6, coordinates: [10.3854, -9.3054] },
              { name: "Gbérédou-Baranama", freelancers: 7, coordinates: [10.3854, -9.3054] },
              { name: "Koumban", freelancers: 5, coordinates: [10.3854, -9.3054] }
            ]
          },
          {
            name: "Mandiana",
            mainTown: "Mandiana (10.6333°N, -8.6833°W)",
            communes: [
              { name: "Mandiana", freelancers: 10, coordinates: [10.6333, -8.6833], skills: ["Surveyors", "Land Surveyors", "Cartographers"] },
              { name: "Balandougouba", freelancers: 4, coordinates: [10.6333, -8.6833] },
              { name: "Dialakoro", freelancers: 3, coordinates: [10.6333, -8.6833] },
              { name: "Faralako", freelancers: 2, coordinates: [10.6333, -8.6833] },
              { name: "Koundian", freelancers: 3, coordinates: [10.6333, -8.6833] }
            ]
          }
        ]
      },
      {
        name: "Kindia Region",
        capital: "Kindia",
        population: "1,559,185",
        coordinates: [10.0569, -12.8653],
        prefectures: [
          {
            name: "Kindia",
            mainTown: "Kindia (10.0500°N, -12.8667°W)",
            communes: [
              { name: "Kindia", freelancers: 18, coordinates: [10.0500, -12.8667], skills: ["Electricians", "Electrical Engineers", "Power Systems"] },
              { name: "Bangouyah", freelancers: 8, coordinates: [10.0500, -12.8667] },
              { name: "Damankanyah", freelancers: 6, coordinates: [10.0500, -12.8667] },
              { name: "Friguiagbé", freelancers: 5, coordinates: [10.0500, -12.8667] },
              { name: "Mambia", freelancers: 4, coordinates: [10.0500, -12.8667] }
            ]
          },
          {
            name: "Coyah",
            mainTown: "Coyah (9.7000°N, -13.3833°W)",
            communes: [
              { name: "Coyah", freelancers: 10, coordinates: [9.7000, -13.3833], skills: ["Construction Specialists", "Civil Engineers", "Project Managers"] },
              { name: "Kouriah", freelancers: 5, coordinates: [9.7000, -13.3833] },
              { name: "Manéah", freelancers: 4, coordinates: [9.7000, -13.3833] },
              { name: "Wonkifong", freelancers: 3, coordinates: [9.7000, -13.3833] }
            ]
          }
        ]
      },
      {
        name: "Labé Region",
        capital: "Labé",
        population: "1,001,392",
        coordinates: [11.3167, -12.2833],
        prefectures: [
          {
            name: "Labé",
            mainTown: "Labé (11.3167°N, -12.2833°W)",
            communes: [
              { name: "Labé", freelancers: 14, coordinates: [11.3167, -12.2833], skills: ["IT Specialists", "Software Developers", "Database Administrators"] },
              { name: "Daralabé", freelancers: 6, coordinates: [11.3167, -12.2833] },
              { name: "Diari", freelancers: 5, coordinates: [11.3167, -12.2833] },
              { name: "Garambé", freelancers: 4, coordinates: [11.3167, -12.2833] },
              { name: "Hafia", freelancers: 3, coordinates: [11.3167, -12.2833] }
            ]
          },
          {
            name: "Koubia",
            mainTown: "Koubia (11.5833°N, -11.9000°W)",
            communes: [
              { name: "Koubia", freelancers: 7, coordinates: [11.5833, -11.9000], skills: ["Agricultural Experts", "Agronomists", "Farm Consultants"] },
              { name: "Fafaya", freelancers: 3, coordinates: [11.5833, -11.9000] },
              { name: "Gadha-Woundou", freelancers: 2, coordinates: [11.5833, -11.9000] },
              { name: "Matakaou", freelancers: 2, coordinates: [11.5833, -11.9000] },
              { name: "Pilimini", freelancers: 1, coordinates: [11.5833, -11.9000] }
            ]
          }
        ]
      },
      {
        name: "Nzérékoré Region",
        capital: "Nzérékoré",
        population: "1,663,582",
        coordinates: [7.7472, -8.8237],
        prefectures: [
          {
            name: "Nzérékoré",
            mainTown: "Nzérékoré (7.7562°N, -8.8179°W)",
            communes: [
              { name: "Nzérékoré", freelancers: 12, coordinates: [7.7562, -8.8179], skills: ["Agricultural Consultants", "Agronomists", "Farm Management"] },
              { name: "Gouécké", freelancers: 4, coordinates: [7.7562, -8.8179], skills: ["Agricultural Experts"] },
              { name: "Koropara", freelancers: 3, coordinates: [7.7562, -8.8179], skills: ["Farm Consultants"] },
              { name: "Palé", freelancers: 2, coordinates: [7.7562, -8.8179], skills: ["Agriculture"] },
              { name: "Soulouta", freelancers: 3, coordinates: [7.7562, -8.8179], skills: ["Agricultural Experts"] }
            ]
          },
          {
            name: "Lola",
            mainTown: "Lola (7.8000°N, -8.5333°W)",
            communes: [
              { name: "Lola", freelancers: 8, coordinates: [7.8000, -8.5333], skills: ["Agronomists", "Agricultural Engineers", "Soil Scientists"] },
              { name: "Bossou", freelancers: 3, coordinates: [7.8000, -8.5333], skills: ["Agriculture"] },
              { name: "Foumbadou", freelancers: 2, coordinates: [7.8000, -8.5333], skills: ["Agricultural Experts"] },
              { name: "Guéasso", freelancers: 2, coordinates: [7.8000, -8.5333], skills: ["Farm Consultants"] },
              { name: "N'Zoo", freelancers: 1, coordinates: [7.8000, -8.5333], skills: ["Agriculture"] }
            ]
          },
          {
            name: "Guéckédou",
            mainTown: "Guéckédou (8.5667°N, -10.1333°W)",
            communes: [
              { name: "Guéckédou", freelancers: 22, coordinates: [8.5667, -10.1333], skills: ["Agricultural Experts", "Agronomists", "Farm Management"] },
              { name: "Fangamadou", freelancers: 6, coordinates: [8.5667, -10.1333], skills: ["Agriculture"] },
              { name: "Klam", freelancers: 4, coordinates: [8.5667, -10.1333], skills: ["Agricultural Experts"] },
              { name: "Nongoa", freelancers: 5, coordinates: [8.5667, -10.1333], skills: ["Farm Consultants"] },
              { name: "Ouendé-Kénéma", freelancers: 7, coordinates: [8.5667, -10.1333], skills: ["Agriculture"] }
            ]
          }
        ]
      }
    ]
  };

  // Pick-up locations in Conakry
  const pickupLocations = [
    { name: "Kaloum Business Center", address: "Kaloum, Conakry", coordinates: [9.6412, -13.5784], hours: "8AM-6PM" },
    { name: "Dixinn Shopping Mall", address: "Dixinn, Conakry", coordinates: [9.6412, -13.5784], hours: "9AM-8PM" },
    { name: "Matam Tech Hub", address: "Matam, Conakry", coordinates: [9.6412, -13.5784], hours: "8AM-7PM" },
    { name: "Matoto Office Complex", address: "Matoto, Conakry", coordinates: [9.6412, -13.5784], hours: "8AM-6PM" },
    { name: "Ratoma Community Center", address: "Ratoma, Conakry", coordinates: [9.6412, -13.5784], hours: "9AM-5PM" }
  ];

  const mapAlt =
    activeTab === "pickup"
      ? "Map of Pick-Up Locations"
      : "Map of Freelancer Locations";

  // Calculate total freelancers
  const totalFreelancers = guineaData.regions.reduce((total, region) => {
    return total + region.prefectures.reduce((regionTotal, prefecture) => {
      return regionTotal + prefecture.communes.reduce((communeTotal, commune) => {
        return communeTotal + commune.freelancers;
      }, 0);
    }, 0);
  }, 0);

  return (
    <section className="bg-gray-50 py-6 px-3 sm:px-6 lg:px-8 overflow-x-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-8 order-2 md:order-1">
          {/* Stats Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-[#228B22]" />
              <h2 className="text-lg font-semibold text-[#228B22]">Freelancer Statistics</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Freelancers:</span>
                <span className="text-sm font-semibold">{totalFreelancers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Regions:</span>
                <span className="text-sm font-semibold">{guineaData.regions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Prefectures:</span>
                <span className="text-sm font-semibold">{guineaData.regions.reduce((total, region) => total + region.prefectures.length, 0)}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Card */}
          <div className="w-full sm:max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm p-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h2 className="text-base font-semibold text-[#228B22]">Filters</h2>
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Region Filter */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={selectedRegion || ""}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                style={{ backgroundColor: selectedRegion ? '#15803D' : '#E5E7EB', color: selectedRegion ? 'white' : 'black' }}
              >
                <option value="">All Regions</option>
                {guineaData.regions.map((region, index) => (
                  <option key={index} value={region.name}>{region.name}</option>
                ))}
              </select>
            </div>

            {/* Prefecture Filter */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prefecture</label>
              <select
                value={selectedPrefecture || ""}
                onChange={(e) => {
                  setSelectedPrefecture(e.target.value);
                  setSelectedSubPrefecture(null); // Reset subprefecture when prefecture changes
                }}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                style={{ backgroundColor: selectedPrefecture ? '#15803D' : '#E5E7EB', color: selectedPrefecture ? 'white' : 'black' }}
              >
                <option value="">All Prefectures</option>
                {getAvailablePrefectures().map((prefecture, index) => (
                  <option key={index} value={prefecture}>{prefecture}</option>
                ))}
              </select>
            </div>

            {/* Subprefecture Filter */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subprefecture</label>
              <select
                value={selectedSubPrefecture || ""}
                onChange={(e) => setSelectedSubPrefecture(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                style={{ backgroundColor: selectedSubPrefecture ? '#15803D' : '#E5E7EB', color: selectedSubPrefecture ? 'white' : 'black' }}
                disabled={!selectedPrefecture}
              >
                <option value="">All Subprefectures</option>
                {getAvailableSubPrefectures().map((subprefecture, index) => (
                  <option key={index} value={subprefecture}>{subprefecture}</option>
                ))}
              </select>
            </div>

            {/* Skills Filter */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <select
                multiple
                value={selectedSkills}
                onChange={(e) => setSelectedSkills(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                style={{ backgroundColor: selectedSkills.length > 0 ? '#15803D' : '#E5E7EB', color: selectedSkills.length > 0 ? 'white' : 'black' }}
              >
                <option value="IT">IT Specialists</option>
                <option value="Mining">Mining</option>
                <option value="Agriculture">Agriculture for NGOs</option>
                <option value="Graphic Designers">Graphic Designers</option>
                <option value="Business Consultants">Business Consultants</option>
                <option value="Marketers">Marketers</option>
                <option value="Software Engineers">Software Engineers</option>
                <option value="App Developers">App Developers</option>
                <option value="Agricultural Experts">Agricultural Experts</option>
                <option value="Construction Specialists">Construction Specialists</option>
                <option value="Miners">Miners</option>
                <option value="Surveyors">Surveyors</option>
                <option value="Electricians">Electricians</option>
                <option value="Agronomists">Agronomists</option>
              </select>
            </div>

            {/* Filter Results Count */}
            {filteredLocations.length > 0 && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  <strong>{filteredLocations.length}</strong> location(s) found
                </p>
              </div>
            )}

            <button
              type="button"
              className="mt-4 w-full bg-[#15803D] hover:bg-[#1e7a1e] text-white rounded-full py-2 text-sm font-medium transition-colors"
              onClick={() => {
                setSelectedRegion(null);
                setSelectedPrefecture(null);
                setSelectedSubPrefecture(null);
                setSelectedSkills([]);
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* Region List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Guinea Regions & Prefectures</h2>
            {guineaData.regions.map((region, i) => (
              <div key={i} className="pb-4">
                <h3 className="text-lg font-semibold text-[#228B22]">{region.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Capital: {region.capital}</p>
                <p className="text-sm text-gray-600">Population: {region.population}</p>
                <p className="text-sm font-semibold mt-3">Communes & Freelancers</p>
                <ul className="mt-1 space-y-1 list-none p-0">
                  {region.prefectures.map((prefecture, pi) => 
                    prefecture.communes.map((commune, ci) => (
                      <li key={`${pi}-${ci}`} className="text-sm hover:text-[#228B22] cursor-pointer">
                        {commune.name}: {commune.freelancers} freelancers
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Leaflet Map */}
        <div className="lg:col-span-2 order-1 md:order-2">
          <div className="relative w-full h-[200px] md:h-[300px] lg:h-[470px] rounded-lg overflow-hidden shadow-md bg-gray-200">
            <MapContainer
              center={[9.9456, -9.6966]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {activeTab === "freelancers" ? (
                // Show filtered locations or all locations if no filters applied
                (filteredLocations.length > 0 ? filteredLocations : getAllLocations()).map((location, index) => (
                  <Marker
                    key={`${location.regionIndex}-${location.prefectureIndex}-${location.communeIndex}-${index}`}
                    position={location.coordinates}
                    icon={createBriefcaseIcon()}
                  >
                    <Popup>
                      <div className="p-3 min-w-[200px]">
                        <h3 className="font-semibold text-[#15803D] text-lg">{location.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{location.region}</p>
                        <p className="text-sm font-semibold mb-2">{location.freelancers} Freelancers Available</p>
                        {location.skills && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Top Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {location.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-3">
                          <button 
                            className="bg-[#15803D] hover:bg-[#1e7a1e] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                            onClick={() => window.open(`/freelancers?location=${location.name.toLowerCase()}`, '_blank')}
                          >
                            View Freelancers
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              ) : (
                // Pick-up locations
                pickupLocations.map((location, index) => (
                  <Marker
                    key={index}
                    position={location.coordinates}
                    icon={L.icon({
                      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                      shadowSize: [41, 41]
                    })}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-[#228B22]">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <p className="text-sm font-semibold">Hours: {location.hours}</p>
                        <div className="mt-2">
                          <button className="bg-[#228B22] text-white px-3 py-1 rounded text-xs">
                            Select Location
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>
          
          {/* Map Legend */}
          <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#228B22]" />
                <span>{activeTab === "freelancers" ? "Freelancer Locations" : "Pick-up Points"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Available Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
