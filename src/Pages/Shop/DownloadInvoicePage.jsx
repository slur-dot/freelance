import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Printer, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { OrderService } from "../../services/orderService";
import { useAuth } from "../../contexts/AuthContext";

export default function DownloadInvoicePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const { currentUser } = useAuth();

  // Extract orderId from state passed by navigate()
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        if (!currentUser) {
          setAuthError(true);
          setLoading(false);
          return;
        }

        const fetchedOrder = await OrderService.getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          // If the fetch returned null but an orderId was supplied, it's likely a permission error or invalid ID
          setAuthError(true);
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = async () => {
    setDownloadingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = invoiceRef.current;
      const opt = {
        margin:       0.3,
        filename:     `Invoice_${displayOrder?.id?.toUpperCase() || 'DEMO'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed, falling back to print:", error);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formatGNF = (n) => {
    return new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      maximumFractionDigits: 0,
    }).format(n || 0);
  };

  // Format Firestore timestamp to short date
  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleDateString('en-GB');
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('en-GB');
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB');
    return new Date(timestamp).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (authError || (orderId && !order)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 pb-4">
            We couldn't securely load your receipt. If you just completed a payment, you may have been redirected into a browser that isn't logged in.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Log In to View Receipt
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Fallback demo data if visited directly without an orderId
  const displayOrder = order || {
    id: "DEMO-" + Math.floor(Math.random() * 1000000),
    createdAt: new Date(),
    paymentMethod: "Not Specified",
    totalAmount: 0,
    shippingDetails: {
      method: "Pickup/Delivery",
      details: "No address provided"
    },
    items: [
      {
        name: "Demo Item",
        quantity: 1,
        price: 0,
        serials: ["F224-DEMO1234-ABCD"]
      }
    ]
  };

  const subtotal = displayOrder.totalAmount; // Assuming totalAmount is without tax for simplicity, or inclusive

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background-color: white !important; }
            .invoice-container { box-shadow: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          }
        `}
      </style>

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 max-w-4xl mx-auto text-sm text-gray-500 flex flex-wrap gap-2 items-center no-print">
        <Link to="/" className="hover:text-purple-600 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('home.title') || "Home"}
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{t('invoice.tax_invoice') || "Receipt"}</span>
      </nav>

      {/* Invoice Card */}
      <div 
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden invoice-container"
      >
        {/* Header Section */}
        <div className="bg-purple-600 text-white p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Freelance2414</h1>
            <p className="text-purple-200 text-sm">Conakry, Guinea</p>
            <p className="text-purple-200 text-sm mt-4">support@freelance2414.com</p>
          </div>
          
          <div className="text-left sm:text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <h2 className="text-xl font-bold mb-1">INVOICE/RECEIPT</h2>
            <p className="text-purple-100 text-sm">#{displayOrder.id.toUpperCase()}</p>
            <p className="text-purple-100 text-sm mt-1">Date: {formatDate(displayOrder.createdAt)}</p>
            <p className="text-purple-50 text-xs mt-1 font-mono tracking-widest">
              VALIDATION: {displayOrder.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10">
          
          {/* Status Alert */}
          <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-8 no-print">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-medium">Order confirmed and being processed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Billed To */}
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Delivery Information</h3>
              <p className="text-gray-900 font-medium">{displayOrder.shippingDetails?.method || "Standard Delivery"}</p>
              <p className="text-gray-600 mt-1 max-w-xs leading-relaxed">
                {typeof displayOrder.shippingDetails?.details === 'object' 
                  ? displayOrder.shippingDetails.details?.name || "Customer Location"
                  : displayOrder.shippingDetails?.details || "Not Applicable"}
              </p>
            </div>

            {/* Payment Details */}
            <div className="md:text-right flex flex-col md:items-end">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Payment Validation</h3>
              <p className="text-gray-900 font-medium capitalize bg-gray-100 px-4 py-1.5 rounded-lg inline-block text-sm mb-4">
                Method: {displayOrder.paymentMethod || "Not Specified"}
              </p>
              
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm inline-block">
                <QRCode 
                  value={JSON.stringify({ 
                    orderId: displayOrder.id, 
                    amount: displayOrder.totalAmount, 
                    code: displayOrder.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase(),
                    date: formatDate(displayOrder.createdAt),
                    status: "CONFIRMED"
                  })} 
                  size={100} 
                  level="M"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 max-w-[180px] leading-relaxed text-right no-print">
                Vendors: use the dashboard to <strong>scan the QR</strong> or enter the Validation Code to verify this receipt.
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold">Item Description</th>
                  <th className="py-4 px-6 font-semibold text-center">Qty</th>
                  <th className="py-4 px-6 font-semibold text-right">Price</th>
                  <th className="py-4 px-6 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayOrder.items?.length > 0 ? (
                  displayOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        <div>{item.name || item.description || "Product"}</div>
                        {item.serials && item.serials.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            S/N: {item.serials.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-center">{item.quantity || 1}</td>
                      <td className="py-4 px-6 text-gray-600 text-right">{formatGNF(item.price || 0)}</td>
                      <td className="py-4 px-6 text-gray-900 font-semibold text-right">{formatGNF((item.price || 0) * (item.quantity || 1))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No items found for this order.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-3 text-gray-600">
                <span>Subtotal</span>
                <span>{formatGNF(displayOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-gray-600">
                <span>Shipping</span>
                <span>{formatGNF(0)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-xl font-bold text-purple-600">{formatGNF(displayOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>Thank you for choosing Freelance2414!</p>
            <p className="mt-1">For any queries, please contact support with your invoice number.</p>
          </div>

        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-4 no-print">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Return Home
        </button>
        <button
          onClick={handlePrint}
          disabled={downloadingPdf}
          className={`px-6 py-2.5 text-white font-medium rounded-xl transition-colors flex items-center gap-2 ${downloadingPdf ? 'bg-purple-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {downloadingPdf ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <Printer className="w-4 h-4" />
          )}
          {downloadingPdf ? "Generating PDF..." : "Print / Save PDF"}
        </button>
      </div>
    </div>
  );
}
