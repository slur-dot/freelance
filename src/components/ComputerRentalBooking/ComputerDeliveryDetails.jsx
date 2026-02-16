import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VendorService } from "../../services/vendorService";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom blue marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
};

export default function ComputerDeliveryDetails({ onContinue }) {
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "delivery",
    pickupLocation: null,
  });

  const [vendors, setVendors] = useState([]);
  const [mapCenter, setMapCenter] = useState([9.5370, -13.6785]); // Default Conakry

  useEffect(() => {
    if (formData.deliveryType === 'pickup') {
      const fetchVendors = async () => {
        try {
          const fetchedVendors = await VendorService.getAllVendors();
          setVendors(fetchedVendors);
        } catch (error) {
          console.error("Failed to load pickup locations", error);
        }
      };
      fetchVendors();
    }
  }, [formData.deliveryType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePickupSelect = (vendor) => {
    setFormData(prev => ({ ...prev, pickupLocation: vendor }));
    const lat = vendor.coordinates.lat || vendor.coordinates[0];
    const lng = vendor.coordinates.lng || vendor.coordinates[1];
    setMapCenter([lat, lng]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.deliveryType === 'pickup' && !formData.pickupLocation) {
      alert("Please select a pickup location.");
      return;
    }
    if (onContinue) onContinue(formData);
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Booking Form</h1>
          <p className="text-black text-sm sm:text-base">
            Complete the booking form to complete your booking
          </p>
        </div>

        {/* Delivery Type Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 border-b pb-4">
          <h2 className="text-lg sm:text-xl font-bold">Delivery / Pickup Details</h2>
          <div className="flex space-x-2">
            {["delivery", "pickup"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange("deliveryType", type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${formData.deliveryType === type
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Delivery Logic */}
          {formData.deliveryType === 'delivery' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Delivery Address*</label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                    placeholder="e.g., 123 Street, Conakry"
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Delivery Date*</label>
                  <input
                    type="date"
                    min={today}
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Preferred Time*</label>
                  <select
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    <option value="09:00 - 12:00">Morning (09:00 - 12:00)</option>
                    <option value="12:00 - 15:00">Afternoon (12:00 - 15:00)</option>
                    <option value="15:00 - 18:00">Evening (15:00 - 18:00)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Pickup Logic */}
          {formData.deliveryType === 'pickup' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-1 h-[400px] overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  <h3 className="font-bold mb-2 sticky top-0 bg-gray-50 p-2">Select a Pickup Point</h3>
                  <div className="space-y-2">
                    {vendors.map(vendor => (
                      <div
                        key={vendor.id}
                        onClick={() => handlePickupSelect(vendor)}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${formData.pickupLocation?.id === vendor.id
                          ? 'bg-green-50 border-green-500 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-green-300'
                          }`}
                      >
                        <div className="font-semibold text-gray-800">{vendor.name}</div>
                        <div className="text-xs text-gray-500">{vendor.address}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="lg:col-span-2 h-[400px] rounded-lg overflow-hidden border border-gray-300 relative z-0">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <RecenterMap center={mapCenter} />
                    {vendors.map((vendor) => (
                      <Marker
                        key={vendor.id}
                        position={[
                          vendor.coordinates.lat || vendor.coordinates[0],
                          vendor.coordinates.lng || vendor.coordinates[1]
                        ]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => handlePickupSelect(vendor),
                        }}
                      >
                        <Popup>
                          <div className="text-center">
                            <h3 className="font-bold">{vendor.name}</h3>
                            <p className="text-sm">{vendor.address}</p>
                            <button
                              className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-xs"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent map click
                                handlePickupSelect(vendor);
                              }}
                            >
                              Select Location
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Pickup Date*</label>
                  <input
                    type="date"
                    min={today}
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Pickup Time*</label>
                  <select
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    <option value="09:00 - 12:00">Morning (09:00 - 12:00)</option>
                    <option value="12:00 - 15:00">Afternoon (12:00 - 15:00)</option>
                    <option value="15:00 - 18:00">Evening (15:00 - 18:00)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center p-6">
            <button
              type="submit"
              className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
