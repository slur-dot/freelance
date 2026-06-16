import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, CheckCircle, MapPin, Phone, Loader2 } from "lucide-react";
import DefaultAvatar from "../assets/profile-image.jpg";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import { useTranslation } from "react-i18next";
import { VendorService } from "../services/vendorService";
import { ProductService } from "../services/productService";

export default function VendorProfile() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const [vendor, setVendor] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const profile = await VendorService.getVendorProfile(vendorId);
        if (profile) {
          setVendor({
            avatarUrl: profile.avatar || profile.profileImage || "",
            name: profile.businessName || profile.fullName || profile.name || "Vendor",
            bio: profile.bio || profile.description || "",
            city: profile.city || profile.region || "Guinea",
            whatsapp: profile.phone || "",
            joined: profile.createdAt?.toDate?.()?.toLocaleDateString?.() || "—",
            rating: profile.status?.rating ?? profile.rating ?? 0,
            verified: profile.status?.verified === true,
          });
        }
        const products = await ProductService.getSellerProducts(vendorId);
        setDevices(products.map((p) => ({
          id: p.id,
          name: p.productName || p.name || "Product",
          price: `${Number(p.price || 0).toLocaleString()} ${p.currency || "GNF"}`,
          description: p.description || "",
          imageUrl: p.imageUrl || p.image || HireFreelanceImage,
          condition: p.condition || "—",
          warranty: p.warranty || "—",
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!vendorId || !vendor) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-gray-600 mb-4">{t('vendor_profile.not_found', 'Vendor not found.')}</p>
        <Link to="/vendor-profiles" className="text-blue-600 hover:underline">
          {t('vendor_profiles_page.title')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={vendor.avatarUrl || DefaultAvatar}
            alt={vendor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              {vendor.verified && <CheckCircle className="text-blue-600 w-6 h-6" />}
            </div>
            <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" /> {vendor.city}
            </p>
            {vendor.bio && <p className="text-sm text-gray-500 mt-1">{vendor.bio}</p>}
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-500 w-4 h-4" />
                <span>{vendor.rating} {t('vendor_profile.rating_label', 'Rating')}</span>
              </div>
              <div>{devices.length} {t('vendor_profile.products_count')}</div>
            </div>
            {vendor.whatsapp && (
              <a
                href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow transition mt-4"
              >
                <Phone className="w-4 h-4" /> {vendor.whatsapp}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
          {t('vendor_profile.devices_for_sale')}
        </h2>
        {devices.length === 0 ? (
          <p className="text-gray-500">{t('vendor_profile.no_products', 'No products listed yet.')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <div key={device.id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <img src={device.imageUrl} alt={device.name} className="w-full h-56 object-cover" />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold">{device.name}</h3>
                  <p className="text-blue-600 font-bold text-xl mt-1">{device.price}</p>
                  <p className="text-sm text-gray-600 mt-2 flex-1">{device.description}</p>
                  <Link
                    to={`/shop/product/${device.id}`}
                    className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center"
                  >
                    {t('vendor_profile.view_product', 'View product')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
