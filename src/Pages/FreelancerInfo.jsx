import React, { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatPopup from "../components/ChatPopup";
import FreelanceImage from "../assets/HireFreelanceImage.png";
import EmilyImage from "../assets/Emily.jpg";
import DefaultAvatar from "../assets/profile-image.jpg";

export default function FreelancerInfo () {
  const navigate = useNavigate();


  const [showChat, setShowChat] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [bidsWon] = useState(0);

  const [profile, setProfile] = useState({
    avatarUrl: "",
    name: "John Doe",
    nickname: "Mamadou Dev",
    bio: "Social Media & IT Support in Conakry",
    city: "Conakry",
    whatsapp: "",
    skills: ["Social Media Ads", "IT Support", "API Integration"],
    portfolio: {
      title: "Built CRM API integration",
      imageUrl: "",
      github: "",
      linkedin: "",
    },
    rating: 5,
    review: {
      name: "Emily Lewis",
      location: "Conakry",
      comment: "Great work, delivered on time!",
    },
  });

  const completionChecks = useMemo(() => {
    const checks = {
      hasPhoto: Boolean(profile.avatarUrl),
      hasBio: Boolean(profile.bio && profile.bio.trim().length > 0),
      hasSkills: profile.skills.length === 3,
      hasPortfolio:
        Boolean(profile.portfolio.title && profile.portfolio.title.trim()) &&
        Boolean(profile.portfolio.imageUrl),
    };
    const score =
      (Object.values(checks).filter((c) => c).length / Object.values(checks).length) * 100;
    return { checks, percent: Math.round(score) };
  }, [profile]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/webp"]; 
    const maxBytes = 100 * 1024;
    if (!validTypes.includes(file.type)) {
      alert("Format non pris en charge. Utilisez JPEG ou WebP.");
      return;
    }
    if (file.size > maxBytes) {
      alert("Fichier trop volumineux (<100 KB requis).");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatarUrl: localUrl }));
  };

  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="hover:text-gray-700 cursor-pointer">Hire Freelancers</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">{profile.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header + Avatar */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={profile.avatarUrl || DefaultAvatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border border-gray-200"
                />
                <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept="image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black mb-1">{profile.name}</h1>
                <div className="text-black mb-2">{profile.city || ""}</div>
                <div className="text-sm text-gray-600">{profile.bio}</div>
                
              </div>
              <div>
               
              </div>
            </div>

            
            {/* Rating */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Rating</h2>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-600" />
                ))}
                <span className="text-gray-700 font-medium">4.9 (7)</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <img src={EmilyImage} alt={profile.review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{profile.review.name}</h4>
                        <span className="text-sm text-gray-500 block">{profile.review.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(profile.rating)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4 text-yellow-600" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic mt-2">{profile.review.comment}</p>
                    
                  </div>
                </div>
              </div>
            </div>

           
          </div>

          {/* Right Column */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            <div className="overflow-hidden rounded-lg bg-white">
              <div className="relative">
                <img
                  src={FreelanceImage}
                  alt="Freelancer"
                  className="w-full h-auto object-contain"
                />
              </div>

              
            </div>

            {/* Badges + Progress */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {completionChecks.percent === 100 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Profil complet</span>
                )}
                {bidsWon >= 5 && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Top Freelancer</span>
                )}
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Profile {completionChecks.percent}% complete</span>
                 
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${completionChecks.percent}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div> 

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modifier le profil</h3>
              <button onClick={() => setShowEdit(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nom</label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Surnom</label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={profile.nickname}
                  onChange={(e) => setProfile((p) => ({ ...p, nickname: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Bio (200 caractères max)</label>
                <textarea
                  maxLength={200}
                  className="mt-1 w-full border rounded px-3 py-2 text-sm min-h-[80px]"
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                />
                <div className="text-xs text-gray-500 mt-1">{profile.bio.length}/200</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Ville (optionnel)</label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={profile.city}
                  onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                />
                <div className="text-xs text-gray-500 mt-1">Web ID: 2</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp (obligatoire)</label>
                <input
                  type="tel"
                  required
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Titre du portfolio</label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={profile.portfolio.title}
                  onChange={(e) => setProfile((p) => ({ ...p, portfolio: { ...p.portfolio, title: e.target.value } }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-full border text-gray-700">Annuler</button>
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-full bg-blue-600 text-white">Enregistrer</button>
            </div>
            <div className="text-xs text-gray-500">Web ID: 9 · Validation en temps réel</div>
          </div>
        </div>
      )}

      {/* In-App Chat */}
      {showChat && <ChatPopup onClose={() => setShowChat(false)} />}
    </div>
  );
}
