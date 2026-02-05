import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Info, CheckCircle, AlertCircle, MapPin, Clock } from "lucide-react";
import { SiStripe, SiPaypal } from "react-icons/si";
import { FaUniversity } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import paymentService from "../../services/paymentService";
import PriceDisplay from "../../components/PriceDisplay";
import { formatPrice } from "../../utils/currencyUtils";
import 'leaflet/dist/leaflet.css';
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { OrderService } from "../../services/orderService";

import CashOnDelivery from "../../assets/CashOnDelivery.png";
import Conakry from "../../assets/conakry.png";
import PayPalIcon from "../../assets/paypal_icon.png";
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

// Pick-up locations data for Conakry's communes
const pickupLocations = [
  {
    id: 1,
    name: "Kaloum – Central Market",
    address: "123 Market Street, Kaloum, Conakry",
    hours: "Mon-Fri, 9 AM – 5 PM",
    coordinates: [9.5092, -13.7123]
  },
  {
    id: 2,
    name: "Dixinn – Dixinn Stadium",
    address: "456 Stadium Road, Dixinn, Conakry",
    hours: "Mon-Fri, 9 AM – 5 PM",
    coordinates: [9.5476, -13.6745]
  },
  {
    id: 3,
    name: "Matam – Community Center",
    address: "789 Community Ave, Matam, Conakry",
    hours: "Mon-Fri, 9 AM – 5 PM",
    coordinates: [9.5355, -13.6865]
  },
  {
    id: 4,
    name: "Ratoma – Ratoma Market",
    address: "321 Market Square, Ratoma, Conakry",
    hours: "Mon-Fri, 9 AM – 5 PM",
    coordinates: [9.5833, -13.6396]
  },
  {
    id: 5,
    name: "Matoto – Commercial Hub",
    address: "654 Business Blvd, Matoto, Conakry",
    hours: "Mon-Fri, 9 AM – 5 PM",
    coordinates: [9.5716, -13.6118]
  }
];

export default function ShippingDetailsPage() {
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange-money');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);

  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      if (!currentUser) {
        alert("Please login to complete your order");
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
        currency: currency
      });

      if (result.success) {
        // Create Order in Firestore
        const orderData = {
          items: cartItems,
          totalAmount: subtotal,
          shippingDetails: {
            method: documents.getElementById("deliver").checked ? "Delivery" : "Pickup",
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
    <div className="px-4 sm:px-6 lg:px-40 py-6 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> {">"}{" "}
        <Link to="/cart" className="hover:underline">Cart</Link> {">"}{" "}
        <span className="font-medium text-gray-800">Details</span>
      </div>

      <h1 className="mb-8 text-2xl sm:text-3xl font-bold">Your Details</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 grid gap-8">
          {/* Shipping Method */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Shipping Method</h2>

            {/* Free Delivery Notice */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Free Delivery in Conakry or Pick Up – Select Your Location at Checkout!</span>
              </div>
              <p className="text-sm text-green-700">
                We offer free delivery within Conakry city limits. You can also choose to pick up your order from our convenient locations.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  id: "deliver",
                  label: "Free Delivery",
                  desc: "Deliver to your address in Conakry",
                  icon: Conakry,
                  defaultChecked: true,
                },
                {
                  id: "pickup",
                  label: "Pick Up",
                  desc: "Pick Up from our location in Conakry",
                  icon: Conakry,
                  defaultChecked: false,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-md p-4 cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      defaultChecked={method.defaultChecked}
                      className="mt-1"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full">
                      <p className="font-medium whitespace-nowrap">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </div>
                  <img src={method.icon} alt={method.desc} className="h-8 w-8 object-contain mt-2 sm:mt-0" />
                </label>
              ))}
            </div>
          </div>

          {/* Pick Up Location Map */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Choose Pick Up Location
            </h2>

            {selectedPickupLocation && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Selected Location</span>
                </div>
                <p className="text-green-700 font-medium">{selectedPickupLocation.name}</p>
                <p className="text-sm text-green-600">{selectedPickupLocation.address}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedPickupLocation.hours}
                </p>
              </div>
            )}

            <div className="h-96 w-full rounded-lg overflow-hidden border mb-4">
              <MapContainer
                center={[9.5500, -13.6667]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {pickupLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.coordinates}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 mb-2">{location.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {location.hours}
                        </p>
                        <button
                          onClick={() => handlePickupLocationSelect(location)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                          style={{ backgroundColor: '#15803D' }}
                        >
                          Select This Location
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pickupLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPickupLocation?.id === location.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  onClick={() => handlePickupLocationSelect(location)}
                >
                  <h4 className="font-medium text-gray-900">{location.name}</h4>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-xs text-gray-500 mt-1">{location.hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid gap-4">
              {[
                {
                  id: "orange-money",
                  label: (
                    <>
                      Orange<br />Money
                    </>
                  ),
                  desc: "You will be redirected to the Orange Money website after submitting your order",
                  icon: OrangeMoneyIcon,
                },
                {
                  id: "mtn",
                  label: "MTN",
                  desc: "You will be redirected to the MTN website after submitting your order",
                  icon: MTNIcon,
                },
                {
                  id: "paypal",
                  label: "PayPal",
                  desc: "You will be redirected to the PayPal website after submitting your order",
                  icon: PayPalIcon,
                },
                {
                  id: "stripe",
                  label: "Stripe",
                  desc: "Pay securely with your credit or debit card",
                  icon: null,
                  iconComponent: SiStripe,
                },
                {
                  id: "bank-transfer",
                  label: "Bank Transfer",
                  desc: "Transfer directly to our bank account",
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
                  desc: "Please enter your address details and we will accept payment on Delivery",
                  icon: CashOnDelivery,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-md p-4 cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
                      <p className="font-medium whitespace-nowrap">{method.label}</p>
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
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedPaymentMethod === 'orange-money' && 'Orange Money Details'}
                  {selectedPaymentMethod === 'mtn' && 'MTN MoMo Details'}
                  {selectedPaymentMethod === 'paypal' && 'PayPal Details'}
                  {selectedPaymentMethod === 'stripe' && 'Card Details'}
                  {selectedPaymentMethod === 'bank-transfer' && 'Bank Transfer Details'}
                  {selectedPaymentMethod === 'cash-on-delivery' && 'Delivery Address'}
                </h3>

                {/* Orange Money / MTN Form */}
                {(selectedPaymentMethod === 'orange-money' || selectedPaymentMethod === 'mtn') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+224 123 456 789"
                      value={paymentDetails.phoneNumber || ''}
                      onChange={(e) => handlePaymentDetailsChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Stripe Form */}
                {selectedPaymentMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber || ''}
                        onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate || ''}
                          onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={paymentDetails.cvv || ''}
                          onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentDetails.cardName || ''}
                        onChange={(e) => handlePaymentDetailsChange('cardName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {selectedPaymentMethod === 'bank-transfer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <select
                        value={paymentDetails.bankName || ''}
                        onChange={(e) => handlePaymentDetailsChange('bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Bank</option>
                        <option value="bicig">BICIG (Banque Internationale pour le Commerce et l'Industrie de Guinée)</option>
                        <option value="sgbg">SGBG (Société Générale de Banques en Guinée)</option>
                        <option value="ecobank">Ecobank Guinée</option>
                        <option value="uba">UBA (United Bank for Africa)</option>
                        <option value="orabank">Orabank Guinée</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your account number"
                        value={paymentDetails.bankAccount || ''}
                        onChange={(e) => handlePaymentDetailsChange('bankAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Form */}
                {selectedPaymentMethod === 'cash-on-delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      placeholder="Enter your complete delivery address"
                      value={paymentDetails.deliveryAddress || ''}
                      onChange={(e) => handlePaymentDetailsChange('deliveryAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>
                )}

                {/* PayPal - No additional form needed */}
                {selectedPaymentMethod === 'paypal' && (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Info className="h-5 w-5" />
                      <span className="font-medium">PayPal Integration</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      You will be redirected to PayPal to complete your payment
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payment Result Messages */}
            {paymentResult && (
              <div className={`mt-4 p-4 rounded-md ${paymentResult.success
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
                    {paymentResult.success ? 'Success!' : 'Error'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${paymentResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {paymentResult.message || paymentResult.error}
                </p>
                {paymentResult.referenceNumber && (
                  <p className="text-sm mt-1 text-green-700">
                    Reference: {paymentResult.referenceNumber}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>Supports pay-as-you-go, deposits, and service-level payments.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-fit">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <PriceDisplay amount={subtotal} size="normal" />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount (-20%)</span>
              <span className="font-medium text-red-500">-<PriceDisplay amount={0} showSecondary={false} /></span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <PriceDisplay amount={15000} size="normal" />
            </div>
            {selectedPickupLocation && (
              <div className="flex justify-between">
                <span className="text-gray-500">Pickup Location</span>
                <span className="font-medium text-sm text-blue-600">{selectedPickupLocation.name}</span>
              </div>
            )}
            <div className="border-t pt-4 flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <PriceDisplay amount={subtotal + 15000} size="large" variant="bold" />
            </div>
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full py-3 rounded-full text-base sm:text-lg flex items-center justify-center ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay Now <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
