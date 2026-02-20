import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import QRCode from "react-qr-code";
import { useTranslation, Trans } from "react-i18next";

export default function DownloadInvoicePage({ invoiceData }) {
  const { t } = useTranslation();
  // Default invoice data (for demo purposes, can be overridden by props)
  const defaultInvoiceData = {
    invoiceNumber: "17-18/JH/97",
    invoiceDate: "July 26, 2017",
    invoiceAmount: 47925.0,
    reverseCharge: false,
    supplier: {
      name: "CloudZen Software Labs Pvt. Ltd.",
      state: "Jharkhand",
      stateCode: "JH-20",
      gstin: "200XOCC9424D1Z5",
    },
    buyer: {
      name: "Cipla Ltd",
      state: "Rajasthan - 757166",
      stateCode: "RJ-08",
      gstin: "08AKOCX6349P1ZL",
    },
    consignee: {
      name: "Cipla Ltd",
      state: "Rajasthan - 757166",
      stateCode: "RJ-08",
      gstin: "08AKOCX6349P1ZL",
    },
    items: [
      {
        hsnSac: "521222",
        description: "iPhone 14 Pro - 256GB, Sierra Blue",
        quantity: 1,
        unit: "PCS",
        unitRate: 8509200.0,
        taxableValue: 8509200.0,
        igstRate: 18.0,
        igstAmount: 1530000.0,
        total: 10030000.0,
        serialNumber: "IP14P256SB001234",
      },
      {
        hsnSac: "071339",
        description: "OTER BEANS DRIED & SHLD",
        quantity: 7,
        unit: "UNT",
        unitRate: 1106.0,
        taxableValue: 7742.0,
        igstRate: 18.0,
        igstAmount: 1393.56,
        total: 9135.56,
      },
      {
        hsnSac: "321490",
        description: "GLAZIERS & GRAFTING PUTY, RESIN ELEMNTS NON RFRCTRY SRFCNG PRPN FR FLOORS, WALL ETC",
        quantity: 7,
        unit: "CCM",
        unitRate: 1335.0,
        taxableValue: 9345.0,
        igstRate: 28.0,
        igstAmount: 2616.6,
        total: 11961.6,
      },
      {
        hsnSac: "020735",
        description: "OTHER, FRESH OR CHILLED",
        quantity: 7,
        unit: "BTL",
        unitRate: 1081.0,
        taxableValue: 7567.0,
        igstRate: 28.0,
        igstAmount: 2118.76,
        total: 9685.76,
      },
      {
        hsnSac: "33079090",
        description: "OTHER COSMETIC & TOILT PRPN NE S",
        quantity: 3,
        unit: "MLT",
        unitRate: 747.0,
        taxableValue: 2241.0,
        igstRate: 28.0,
        igstAmount: 627.48,
        total: 2868.48,
      },
    ],
    totals: {
      taxableValue: 8509200.0,
      igstAmount: 1530000.0,
      rounding: 0.0,
      total: 10030000.0,
    },
  };

  // Use provided invoiceData or fallback to default
  const INVOICE_DATA = invoiceData || defaultInvoiceData;

  // Derived amounts
  const amounts = useMemo(() => ({
    taxable: INVOICE_DATA.totals.taxableValue,
    igst: INVOICE_DATA.totals.igstAmount,
    total: INVOICE_DATA.totals.total,
  }), [INVOICE_DATA]);

  // Payment / Invoice state
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const invoiceRef = useRef(null);

  // Restore last invoice if page was refreshed
  useEffect(() => {
    const saved = localStorage.getItem("lastInvoice");
    if (saved) {
      const data = JSON.parse(saved);
      setPaid(true);
      setOrderId(data.orderId);
      setVerificationCode(data.verificationCode);
      setQrPayload(data.qrPayload);
    }
  }, []);

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(n);

  // Generate verification code
  const generateCode = (len = 10) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out.replace(/(.{5})/g, "$1-").replace(/-$/, "");
  };

  // Simulate payment
  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const id = INVOICE_DATA.invoiceNumber;
      const code = generateCode();
      const payload = {
        orderId: id,
        verificationCode: code,
        currency: "INR",
        invoiceNumber: INVOICE_DATA.invoiceNumber,
        invoiceDate: INVOICE_DATA.invoiceDate,
        invoiceAmount: INVOICE_DATA.invoiceAmount,
        taxableValue: amounts.taxable,
        igstAmount: amounts.igst,
        totalPaid: amounts.total,
        ts: new Date().toISOString(),
        supplier: INVOICE_DATA.supplier,
        buyer: INVOICE_DATA.buyer,
        consignee: INVOICE_DATA.consignee,
        items: INVOICE_DATA.items,
      };

      setOrderId(id);
      setVerificationCode(code);
      setQrPayload(JSON.stringify(payload));
      setPaid(true);

      localStorage.setItem(
        "lastInvoice",
        JSON.stringify({
          orderId: id,
          verificationCode: code,
          qrPayload: JSON.stringify(payload),
        })
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert amount to words (placeholder)
  const amountInWords = (num) => {
    return "Forty-Seven Thousand Nine Hundred Twenty-Four and Sixty-Eight Paise";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          @media print {
            .no-print { display: none; }
            .invoice-container { width: 100%; max-width: 100%; overflow: visible; }
            table { width: 100%; font-size: 10pt; }
            th, td { padding: 6px; }
            .break-inside { page-break-inside: avoid; }
          }
        `}
      </style>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 lg:px-16 py-6 invoice-container">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 flex flex-wrap gap-1 no-print">
          <Link to="/" className="hover:underline">{t('home.title')}</Link>
          <span>{">"}</span>
          <Link to="/cart" className="hover:underline">{t('cart.breadcrumb')}</Link>
          <span>{">"}</span>
          <Link to="/details" className="hover:underline">{t('shipping.breadcrumb')}</Link>
          <span>{">"}</span>
          <span className="font-medium text-gray-700">{t('invoice.breadcrumb')}</span>
        </nav>

        {/* Main Heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 break-inside">
          {paid ? t('invoice.tax_invoice') : t('invoice.checkout_summary')}
        </h1>

        <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
          {/* Left: Invoice */}
          <div className="w-full lg:w-full bg-white rounded-lg shadow p-4 sm:p-6 break-inside">
            {paid ? (
              <div ref={invoiceRef}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">{t('invoice.tax_invoice')}</h2>
                    <p className="text-xs text-gray-500 mt-1">{t('invoice.number')} <span className="font-medium">{INVOICE_DATA.invoiceNumber}</span></p>
                    <p className="text-xs text-gray-500">{t('invoice.date')} <span className="font-medium">{INVOICE_DATA.invoiceDate}</span></p>
                    <p className="text-xs text-gray-500">{t('invoice.verification_code')} <span className="font-semibold tracking-wider">{verificationCode}</span></p>
                    <p className="text-xs text-gray-500">{t('invoice.reverse_charge')} <span className="font-medium">{INVOICE_DATA.reverseCharge ? t('invoice.yes') : t('invoice.no')}</span></p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <QRCode value={qrPayload || " "} size={110} />
                  </div>
                </div>

                {/* Supplier and Buyer Details */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold">{t('invoice.supplier')}</h3>
                    <p>{INVOICE_DATA.supplier.name}</p>
                    <p>{t('invoice.state')} {INVOICE_DATA.supplier.state}</p>
                    <p>{t('invoice.state_code')} {INVOICE_DATA.supplier.stateCode}</p>
                    <p>{t('invoice.gstin')} {INVOICE_DATA.supplier.gstin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('invoice.buyer')}</h3>
                    <p>{INVOICE_DATA.buyer.name}</p>
                    <p>{t('invoice.state')} {INVOICE_DATA.buyer.state}</p>
                    <p>{t('invoice.state_code')} {INVOICE_DATA.buyer.stateCode}</p>
                    <p>{t('invoice.gstin')} {INVOICE_DATA.buyer.gstin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('invoice.consignee')}</h3>
                    <p>{INVOICE_DATA.consignee.name}</p>
                    <p>{t('invoice.state')} {INVOICE_DATA.consignee.state}</p>
                    <p>{t('invoice.state_code')} {INVOICE_DATA.consignee.stateCode}</p>
                    <p>{t('invoice.gstin')} {INVOICE_DATA.consignee.gstin}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="mt-4 border rounded-lg overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[600px]">
                    <thead className="bg-gray-100">
                      <tr className="[&>th]:px-4 [&>th]:py-2 text-left border-b">
                        <th className="border-r">{t('invoice.table.hsn')}</th>
                        <th className="border-r">{t('invoice.table.desc')}</th>
                        <th className="border-r">{t('invoice.table.qty')}</th>
                        <th className="border-r">{t('invoice.table.unit')}</th>
                        <th className="border-r">{t('invoice.table.rate')}</th>
                        <th className="border-r">{t('invoice.table.taxable')}</th>
                        <th className="border-r">{t('invoice.table.igst_rate')}</th>
                        <th className="border-r">{t('invoice.table.igst_amount')}</th>
                        <th className="border-r">{t('invoice.table.total')}</th>
                        <th>{t('invoice.table.serial')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVOICE_DATA.items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="border-r px-4 py-3">{item.hsnSac}</td>
                          <td className="border-r px-4 py-3">{item.description}</td>
                          <td className="border-r px-4 py-3">{item.quantity}</td>
                          <td className="border-r px-4 py-3">{item.unit}</td>
                          <td className="border-r px-4 py-3">{formatINR(item.unitRate)}</td>
                          <td className="border-r px-4 py-3">{formatINR(item.taxableValue)}</td>
                          <td className="border-r px-4 py-3">{item.igstRate}%</td>
                          <td className="border-r px-4 py-3">{formatINR(item.igstAmount)}</td>
                          <td className="border-r px-4 py-3">{formatINR(item.total)}</td>
                          <td className="px-4 py-3 font-mono text-xs">{item.serialNumber || "N/A"}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold border-t">
                        <td colSpan={5} className="border-r px-4 py-3">{t('invoice.total_amounts')}</td>
                        <td className="border-r px-4 py-3">{formatINR(INVOICE_DATA.totals.taxableValue)}</td>
                        <td className="border-r px-4 py-3"></td>
                        <td className="border-r px-4 py-3">{formatINR(INVOICE_DATA.totals.igstAmount)}</td>
                        <td className="border-r px-4 py-3">{formatINR(INVOICE_DATA.totals.total)}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                      <tr className="border-t">
                        <td colSpan={8} className="border-r px-4 py-3">{t('invoice.rounding')}</td>
                        <td className="border-r px-4 py-3">{formatINR(INVOICE_DATA.totals.rounding)}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total in Words */}
                <p className="text-sm mt-3 break-inside">{t('invoice.amount_words')} {amountInWords(INVOICE_DATA.totals.total)}</p>

                {/* Delivery Information */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg break-inside">
                  <h3 className="font-semibold text-blue-900 mb-2">{t('invoice.delivery_info')}</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>{t('invoice.pickup_loc')}</strong> Conakry Tech Hub - Hamdallaye, Conakry</p>
                    <p><strong>{t('invoice.delivery_method')}</strong> {t('shipping.free_notice_title')}</p>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-4 text-xs text-gray-500 break-inside">
                  <p>{t('invoice.original_recipient')}</p>
                  <p>E&OE</p>
                  <p>{t('invoice.auth_signatory')} CloudZen Software Labs Pvt. Ltd.</p>
                  <p>CIN: ABCD....</p>
                  <p>Website: <a href="https://www.cloudzen.in" className="underline">www.cloudzen.in</a></p>
                  <p>
                    Note: You have not specified any notes that should appear in the Invoice. Please customize this information at{" "}
                    <a href="https://my.gstzen.in/~demo/a/gstins/1/update/" className="underline">
                      https://my.gstzen.in/~demo/a/gstins/1/update/
                    </a>
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-3 break-inside">
                  {t('invoice.qr_instruction')}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3 no-print">
                  <button
                    onClick={handlePrint}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
                  >
                    {t('invoice.print_btn')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="mb-2">{t('invoice.complete_payment_msg')}</p>
                <p>{t('invoice.igst_msg')}</p>
              </div>
            )}
          </div>

          {/* Right: Order Summary + Payment */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-4 sm:p-6 break-inside no-print">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">{t('cart.summary_title')}</h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('invoice.table.taxable')}</span>
                <span className="font-medium">{formatINR(amounts.taxable)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('invoice.table.igst_amount')}</span>
                <span className="font-medium">{formatINR(amounts.igst)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('invoice.rounding')}</span>
                <span className="font-medium">{formatINR(INVOICE_DATA.totals.rounding)}</span>
              </div>
              <div className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg">
                <span>{t('invoice.table.total')}</span>
                <span>{formatINR(amounts.total)}</span>
              </div>

              {!paid ? (
                <button
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 sm:py-3 rounded-full text-base sm:text-lg flex items-center justify-center gap-2 mt-3 sm:mt-4"
                >
                  {isPaying ? t('shipping.processing') : t('invoice.pay_now')}
                  {!isPaying && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              ) : (
                <div className="mt-3 text-green-600 text-sm font-medium">
                  {t('invoice.payment_completed')}
                </div>
              )}
            </div>

            <div className="mt-4 p-3 rounded-md bg-green-50 text-xs text-green-800">
              <Trans i18nKey="invoice.vendor_instruction" components={{ strong: <strong /> }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

