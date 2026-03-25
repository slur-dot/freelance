import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const ref = searchParams.get('ref') || searchParams.get('merchantPaymentReference') || 'Unknown Reference';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been securely processed by Djomy.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
          <p className="text-sm text-gray-500 mb-2 font-medium">Transaction Reference</p>
          <p className="font-mono text-gray-900 font-semibold break-all text-sm bg-white p-3 rounded-lg border border-gray-200">
            {ref}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Use the explicitly passed orderId, or fallback to ref if missing */}
          <button 
            onClick={() => navigate('/download-invoice', { state: { orderId: orderId || ref } })}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <Receipt className="w-5 h-5" />
            View Invoice
          </button>
          
          <Link 
            to="/"
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5 text-gray-500" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
