import React, { useState } from "react";
import { Star, CheckCircle, MapPin, Phone } from "lucide-react";
import DefaultAvatar from "../assets/profile-image.jpg";
import IphoneImage from "../assets/iphoneProduct.jpg";
import SamsungImage from "../assets/mobile.jpg";
import LaptopImage from "../assets/Laptop.jpg";

export default function VendorProfile() {
  const [vendor] = useState({
    avatarUrl: "",
    name: "John Doe",
    bio: "Trusted electronics & mobile devices seller in Conakry. Specializing in premium smartphones, laptops, and accessories.",
    city: "Conakry, Guinea",
    whatsapp: "+224620123456",
    joined: "March 2022",
    rating: 4.8,
    verified: true,
    devices: [
      {
        id: 1,
        name: "iPhone 13 Pro",
        price: "8,500,000 GNF",
        description: "256GB, Sierra Blue, excellent condition",
        imageUrl: IphoneImage,
        condition: "Used - Like New",
        warranty: "6 Months",
      },
      {
        id: 2,
        name: "Samsung Galaxy S22",
        price: "6,800,000 GNF",
        description: "128GB, Phantom Black, 1-year warranty",
        imageUrl: SamsungImage,
        condition: "Brand New",
        warranty: "12 Months",
      },
      {
        id: 3,
        name: "HP EliteBook 840 G7",
        price: "9,000,000 GNF",
        description: "Core i7, 16GB RAM, 512GB SSD",
        imageUrl: LaptopImage,
        condition: "Refurbished",
        warranty: "3 Months",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={vendor.avatarUrl || DefaultAvatar}
            alt="Vendor Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              {vendor.verified && (
                <CheckCircle className="text-blue-600 w-6 h-6" />
              )}
            </div>
            <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" /> {vendor.city}
            </p>
            <p className="text-sm text-gray-500 mt-1">{vendor.bio}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-500 w-4 h-4" />
                <span>{vendor.rating} Rating</span>
              </div>
              <div>Joined {vendor.joined}</div>
              <div>{vendor.devices.length} Products</div>
            </div>

            {/* Contact Vendor */}
            <div className="mt-4">
              <a
                href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow transition"
              >
                <Phone className="w-4 h-4" /> Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
          Devices for Sale
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendor.devices.map((device) => (
            <div
              key={device.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={device.imageUrl}
                alt={device.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {device.name}
                </h3>
                <p className="text-blue-600 font-bold text-xl mt-1">
                  {device.price}
                </p>
                <p className="text-sm text-gray-600 mt-2 flex-1">
                  {device.description}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {device.condition}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Warranty: {device.warranty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
