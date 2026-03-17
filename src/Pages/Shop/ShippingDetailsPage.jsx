import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Info, CheckCircle, AlertCircle, MapPin, Clock, Navigation, CreditCard } from "lucide-react";
import { SiStripe } from "react-icons/si";
import { FaUniversity } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import paymentService from "../../services/paymentService";
import { VendorService } from "../../services/vendorService";
import PriceDisplay from "../../components/PriceDisplay";
import { formatPrice } from "../../utils/currencyUtils";
import 'leaflet/dist/leaflet.css';
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { OrderService } from "../../services/orderService";
import { useTranslation } from "react-i18next";

import CashOnDelivery from "../../assets/CashOnDelivery.png";
import Conakry from "../../assets/conakry.png";
import OrangeMoneyIcon from "../../assets/orangemoney_icon.png";
import MTNIcon from "../../assets/mtn_icon.png";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom blue marker icon (Primary Blue #3B82F6)
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker (Red)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when selected location changes
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
};

export default function ShippingDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange-money');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Locations State
  const [vendors, setVendors] = useState([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortedVendors, setSortedVendors] = useState([]);
  const [mapCenter, setMapCenter] = useState([9.5370, -13.6785]); // Default Conakry center

  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  // Fetch Vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const fetchedVendors = await VendorService.getAllVendors();
        setVendors(fetchedVendors);
        setSortedVendors(fetchedVendors);
      } catch (error) {
        console.error("Failed to load pickup locations", error);
      }
    };
    fetchVendors();
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Get User Location
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc = { lat: latitude, lng: longitude }; // For actual use
          // For DEMO purposes, since most users aren't in Conakry, 
          // we'll mock the user location to be in Conakry center
          const demoUserLoc = { lat: 9.5370, lng: -13.6785 }; // Conakry coordinates

          setUserLocation(demoUserLoc);
          setMapCenter([demoUserLoc.lat, demoUserLoc.lng]);

          // Sort vendors by distance
          const sorted = [...vendors].map(vendor => {
            const distance = calculateDistance(
              demoUserLoc.lat,
              demoUserLoc.lng,
              vendor.coordinates.lat || vendor.coordinates[0], // Handle both structures if needed
              vendor.coordinates.lng || vendor.coordinates[1]
            );
            return { ...vendor, distance };
          }).sort((a, b) => a.distance - b.distance);

          setSortedVendors(sorted);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setShowPaymentForm(true);
    setPaymentResult(null);
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePickupLocationSelect = (location) => {
    setSelectedPickupLocation(location);
    // Recenter map to selected location
    const lat = location.coordinates.lat || location.coordinates[0];
    const lng = location.coordinates.lng || location.coordinates[1];
    setMapCenter([lat, lng]);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      if (!currentUser) {
        alert(t('shipping.login_alert'));
        navigate("/login");
        return;
      }

      // Validate payment data
      const validation = paymentService.validatePaymentData(selectedPaymentMethod, paymentDetails);
      if (!validation.isValid) {
        setPaymentResult({
          success: false,
          error: 'Please fill in all required payment details',
          errors: validation.errors
        });
        setIsProcessing(false);
        return;
      }

      // Process payment (Simulated for now)
      const result = await paymentService.processPayment(selectedPaymentMethod, {
        ...paymentDetails,
        amount: subtotal,
        currency: "GNF"
      });

      if (result.success) {
        // Create Order in Firestore
        const shippingMethod = document.querySelector('input[name="shipping"]:checked')?.value;
        const orderData = {
          items: cartItems,
          totalAmount: subtotal,
          shippingDetails: {
            method: shippingMethod === "deliver" ? "Delivery" : "Pickup",
            details: selectedPickupLocation || paymentDetails.deliveryAddress
          },
          paymentMethod: selectedPaymentMethod
        };

        const orderRes = await OrderService.createOrder(currentUser.uid, orderData);

        if (orderRes.success) {
          clearCart();
          // Redirect to invoice page
          navigate("/download-invoice", { state: { orderId: orderRes.orderId } });
        }
      } else {
        setPaymentResult(result);
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        error: error.message || 'Payment processing failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-40 py-6 lg:py-12 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:underline">{t('home.title')}</Link> {">"}{" "}
        <Link to="/cart" className="hover:underline">{t('cart.breadcrumb')}</Link> {">"}{" "}
        <span className="font-medium text-gray-800">{t('shipping.breadcrumb')}</span>
      </div>

      <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-gray-900">{t('shipping.title')}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 grid gap-8">
          {/* Shipping Method */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('shipping.method_title')}</h2>

            {/* Free Delivery Notice */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{t('shipping.free_notice_title')}</span>
              </div>
              <p className="text-sm text-green-700">
                {t('shipping.free_notice_desc')}
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  id: "deliver",
                  label: t('shipping.delivery_label'),
                  desc: t('shipping.delivery_desc'),
                  icon: Conakry,
                  defaultChecked: true,
                },
                {
                  id: "pickup",
                  label: t('shipping.pickup_label'),
                  desc: t('shipping.pickup_desc'),
                  icon: Conakry, // Could use specific icon
                  defaultChecked: false,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors bg-white hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      defaultChecked={method.defaultChecked}
                      id={method.id}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full">
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </div>
                  <img src={method.icon} alt={method.desc} className="h-8 w-8 object-contain mt-2 sm:mt-0" />
                </label>
              ))}
            </div>
          </div>

          {/* Pick Up Location Section */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <MapPin className="h-5 w-5 text-blue-600" />
              {t('shipping.pickup_location_title')}
            </h2>

            {/* Map Controls */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleGetUserLocation}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Navigation className="h-4 w-4" />
                {t('shipping.use_location_btn')}
              </button>
            </div>

            {/* Map Container */}
            <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200 mb-6 z-0 relative">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <RecenterMap center={mapCenter} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="font-semibold text-center">{t('shipping.you_are_here')}</div>
                    </Popup>
                  </Marker>
                )}

                {/* Vendor Markers */}
                {vendors.map((vendor) => (
                  <Marker
                    key={vendor.id}
                    position={[
                      vendor.coordinates.lat || vendor.coordinates[0],
                      vendor.coordinates.lng || vendor.coordinates[1]
                    ]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => handlePickupLocationSelect(vendor),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-gray-900 mb-1">{vendor.businessName}</h3>
                        <p className="text-sm text-gray-600 mb-1">{vendor.city}</p>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {t('shipping.mon_fri')}
                        </p>
                        <button
                          onClick={() => handlePickupLocationSelect(vendor)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-xs font-bold transition-colors"
                        >
                          {t('shipping.select_location_btn')}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Location Selected State */}
            {selectedPickupLocation && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-800">{t('shipping.selected_point')}</span>
                </div>
                <div className="pl-7">
                  <p className="text-gray-900 font-semibold text-lg">{selectedPickupLocation.businessName}</p>
                  <p className="text-sm text-gray-600">{selectedPickupLocation.city}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('shipping.vendor_id')} {selectedPickupLocation.id.substring(0, 8)}...</p>
                </div>
              </div>
            )}

            {/* Location List */}
            <h3 className="font-semibold text-gray-700 mb-3">{t('shipping.available_locations')} {userLocation ? t('shipping.nearest_to_you') : ''}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {sortedVendors.length > 0 ? (
                sortedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedPickupLocation?.id === vendor.id
                      ? 'border-green-500 ring-2 ring-green-100 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow-md bg-white'
                      }`}
                    onClick={() => handlePickupLocationSelect(vendor)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{vendor.businessName}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{vendor.bio || "Verified Vendor"}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {vendor.city}
                        </p>
                      </div>
                      {vendor.distance && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          {vendor.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {t('shipping.no_locations')}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('shipping.payment_method_title')}</h2>
            <div className="grid gap-4">
              {[
                {
                  id: "orange-money",
                  label: (
                    <>
                      Orange<br />Money
                    </>
                  ),
                  desc: t('shipping.redirect_orange'),
                  icon: OrangeMoneyIcon,
                },
                {
                  id: "mtn",
                  label: "MTN",
                  desc: t('shipping.redirect_mtn'),
                  icon: MTNIcon,
                },
                {
                  id: "ymo",
                  label: "YMO Payment Gateway",
                  desc: "Pay securely with YMO",
                  icon: null,
                  iconComponent: CreditCard,
                },
                {
                  id: "stripe",
                  label: "Stripe",
                  desc: t('shipping.pay_card'),
                  icon: null,
                  iconComponent: SiStripe,
                },
                {
                  id: "bank-transfer",
                  label: "Bank Transfer",
                  desc: t('shipping.bank_transfer_desc'),
                  icon: null,
                  iconComponent: FaUniversity,
                },
                {
                  id: "cash-on-delivery",
                  label: (
                    <>
                      Cash on<br />Delivery
                    </>
                  ),
                  desc: t('shipping.cod_desc'),
                  icon: CashOnDelivery,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-lg p-4 cursor-pointer transition-colors bg-white hover:border-blue-500 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
                      <p className="font-medium whitespace-nowrap text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </div>
                  {method.icon ? (
                    <img
                      src={method.icon}
                      alt={`${method.label} Icon`}
                      className="h-8 w-8 object-contain mt-2 sm:mt-0"
                    />
                  ) : method.iconComponent ? (
                    <method.iconComponent className="h-8 w-8 text-gray-600 mt-2 sm:mt-0" />
                  ) : null}
                </label>
              ))}
            </div>

            {/* Payment Form - Show when method is selected */}
            {showPaymentForm && selectedPaymentMethod && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {selectedPaymentMethod === 'orange-money' && 'Orange Money Details'}
                  {selectedPaymentMethod === 'mtn' && 'MTN MoMo Details'}
                  {selectedPaymentMethod === 'ymo' && 'YMO Payment Details'}
                  {selectedPaymentMethod === 'stripe' && 'Card Details'}
                  {selectedPaymentMethod === 'bank-transfer' && 'Bank Transfer Details'}
                  {selectedPaymentMethod === 'cash-on-delivery' && 'Delivery Address'}
                </h3>

                {/* Orange Money / MTN Form */}
                {(selectedPaymentMethod === 'orange-money' || selectedPaymentMethod === 'mtn') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('shipping.phone_label')}
                    </label>
                    <input
                      type="tel"
                      placeholder="+224 123 456 789"
                      value={paymentDetails.phoneNumber || ''}
                      onChange={(e) => handlePaymentDetailsChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                )}

                {/* Stripe Form */}
                {selectedPaymentMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('shipping.card_number')}
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber || ''}
                        onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('shipping.expiry_date')}
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate || ''}
                          onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('shipping.cvv')}
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={paymentDetails.cvv || ''}
                          onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('shipping.cardholder_name')}
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentDetails.cardName || ''}
                        onChange={(e) => handlePaymentDetailsChange('cardName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {selectedPaymentMethod === 'bank-transfer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('shipping.bank_name')}
                      </label>
                      <select
                        value={paymentDetails.bankName || ''}
                        onChange={(e) => handlePaymentDetailsChange('bankName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="">{t('shipping.select_bank')}</option>
                        <option value="bicig">BICIG (Banque Internationale pour le Commerce et l'Industrie de Guinée)</option>
                        <option value="sgbg">SGBG (Société Générale de Banques en Guinée)</option>
                        <option value="ecobank">Ecobank Guinée</option>
                        <option value="uba">UBA (United Bank for Africa)</option>
                        <option value="orabank">Orabank Guinée</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('shipping.account_number')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('shipping.enter_account')}
                        value={paymentDetails.bankAccount || ''}
                        onChange={(e) => handlePaymentDetailsChange('bankAccount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Form */}
                {selectedPaymentMethod === 'cash-on-delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('shipping.delivery_address')}
                    </label>
                    <textarea
                      placeholder={t('shipping.enter_address')}
                      value={paymentDetails.deliveryAddress || ''}
                      onChange={(e) => handlePaymentDetailsChange('deliveryAddress', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                      rows="3"
                    />
                  </div>
                )}

                {/* YMO Form */ }
                {selectedPaymentMethod === 'ymo' && (
                  <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">YMO Integration</p>
                      <p className="text-sm text-green-700 mt-1">
                        You will be redirected to the YMO Payment Gateway to complete your payment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Result Messages */}
            {paymentResult && (
              <div className={`mt-4 p-4 rounded-lg ${paymentResult.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
                }`}>
                <div className="flex items-center gap-2">
                  {paymentResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${paymentResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {paymentResult.success ? t('shipping.success') : t('shipping.error')}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${paymentResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {paymentResult.message || paymentResult.error}
                </p>
                {paymentResult.referenceNumber && (
                  <p className="text-sm mt-1 text-green-700">
                    {t('shipping.reference')} {paymentResult.referenceNumber}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 justify-center">
              <Info className="h-4 w-4" />
              <span>{t('shipping.secure_msg')}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">{t('cart.summary_title')}</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.subtotal')}</span>
              <PriceDisplay amount={subtotal} size="normal" />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.discount')}</span>
              {/* Fixed 0 discount for now, can be dynamic */}
              <span className="font-medium text-gray-900">0 GNF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.delivery_fee')}</span>
              {/* Only show delivery fee if 'deliver' is selected, or make it dynamic.
                  Current logic in code adds it regardless, but text says Free Delivery?
                  Updating to 0 for free delivery as per text claim */}
              <span className="font-medium text-green-600">{t('shipping.free')}</span>
            </div>

            {/* Show Selected Pickup Location in Summary */}
            {selectedPickupLocation && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-600 uppercase font-bold tracking-wider">{t('shipping.pickup_at')}</span>
                <p className="font-medium text-gray-900 mt-1">{selectedPickupLocation.businessName}</p>
                <p className="text-xs text-gray-600">{selectedPickupLocation.city}</p>
              </div>
            )}

            <div className="border-t border-dashed pt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>{t('cart.total')}</span>
              <PriceDisplay amount={subtotal} size="xl" variant="bold" />
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                } text-white mt-4`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {t('shipping.processing')}
                </>
              ) : (
                <>
                  {t('shipping.confirm_payment')} <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-gray-400">{t('shipping.terms_agree')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
