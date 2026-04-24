import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Search, CreditCard, Calendar, Filter } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Mock data until Firestore is connected
const MOCK_RECEIPTS = [
  {
    id: 'RCP-2024-001',
    orderId: 'ORD-75892',
    date: '2024-04-18',
    customer: 'Tech Corp SARL',
    items: [
      { name: 'MacBook Pro M3', quantity: 2, price: 1999, serials: ['F224-20240418-A1B2', 'F224-20240418-C3D4'] }
    ],
    amount: 3998,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Stripe'
  },
  {
    id: 'RCP-2024-002',
    orderId: 'ORD-75895',
    date: '2024-04-19',
    customer: 'John Doe',
    items: [
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 1199, serials: ['F224-20240419-X9Y8'] }
    ],
    amount: 1199,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Mobile Money'
  }
];

export default function Receipts() {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from vendorService.getReceipts(vendorId)
    setTimeout(() => {
      setReceipts(MOCK_RECEIPTS);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredReceipts = receipts.filter(receipt => 
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadReceiptPDF = (receipt) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
          <div>
            <h1 style="color: #2563eb; margin: 0;">Freelance24</h1>
            <p style="margin: 5px 0; color: #666;">Vendor Receipt</p>
          </div>
          <div style="text-align: right;">
            <p style="font-weight: bold; margin: 0;">Receipt #: ${receipt.id}</p>
            <p style="margin: 5px 0;">Date: ${new Date(receipt.date).toLocaleDateString()}</p>
            <span style="background: #ecfdf5; color: #059669; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">PAID</span>
          </div>
        </div>
        
        <div style="margin-bottom: 40px;">
          <h3 style="margin-bottom: 10px; color: #444;">Customer Details:</h3>
          <p style="margin: 0;"><strong>${receipt.customer}</strong></p>
          <p style="margin: 5px 0;">Order Ref: ${receipt.orderId}</p>
          <p style="margin: 5px 0;">Payment Method: ${receipt.paymentMethod}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
              <th style="padding: 12px;">Item</th>
              <th style="padding: 12px;">Serial Numbers</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.items.map(item => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px;">${item.name}</td>
                <td style="padding: 12px; font-size: 12px; color: #666;">${item.serials.join(', ')}</td>
                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #e2e8f0;">
              <strong style="font-size: 18px;">Total Paid:</strong>
              <strong style="font-size: 18px; color: #2563eb;">$${receipt.amount.toFixed(2)} ${receipt.currency}</strong>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>This is a computer generated receipt and requires no signature.</p>
          <p>© 2024 Freelance24 Platform</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Receipt_${receipt.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold border-b-4 border-blue-500 inline-block pb-2 mb-2">
            {t('vendor_dashboard.receipts.title', 'Transaction Receipts')}
          </h1>
          <p className="text-gray-600">
            {t('vendor_dashboard.receipts.subtitle', 'View and download receipts for all completed orders.')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('vendor_dashboard.receipts.search', 'Search receipts...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <Filter className="w-4 h-4" />
            {t('common.filter', 'Filter')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">{t('vendor_dashboard.receipts.receipt_id', 'Receipt ID')}</th>
                <th className="px-6 py-4">{t('vendor_dashboard.receipts.date', 'Date')}</th>
                <th className="px-6 py-4">{t('vendor_dashboard.receipts.customer', 'Customer')}</th>
                <th className="px-6 py-4">{t('vendor_dashboard.receipts.amount', 'Amount')}</th>
                <th className="px-6 py-4">{t('vendor_dashboard.receipts.status', 'Status')}</th>
                <th className="px-6 py-4 text-right">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2">Loading receipts...</p>
                  </td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">{t('vendor_dashboard.receipts.no_receipts', 'No receipts found')}</p>
                    <p className="mt-1">{t('vendor_dashboard.receipts.try_different_search', 'Try adjusting your search terms.')}</p>
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {receipt.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(receipt.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{receipt.customer}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {receipt.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {receipt.amount.toLocaleString()} {receipt.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {t('vendor_dashboard.receipts.paid', 'Paid')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadReceiptPDF(receipt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t('common.download', 'Download')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
