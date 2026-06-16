import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Receipt, Loader2, XCircle } from 'lucide-react';
import { OrderService, ORDER_STATUS } from '../../services/orderService';
import paymentService from '../../services/paymentService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const returnStatus = searchParams.get('status');
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(!!orderId);
  const [error, setError] = useState(null);
  const [paymentRef, setPaymentRef] = useState(transactionId || '');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function confirmPayment() {
      if (!orderId) {
        setConfirming(false);
        return;
      }

      const normalized = (returnStatus || '').toUpperCase();
      if (normalized && normalized !== 'SUCCESS') {
        setFailed(true);
        setError('Payment was not completed. You can try again from your cart.');
        try {
          await OrderService.updateOrderStatus(orderId, ORDER_STATUS.PAYMENT_FAILED);
        } catch (err) {
          console.error('Failed to update order status:', err);
        }
        setConfirming(false);
        return;
      }

      if (!transactionId) {
        setError(
          'Missing payment reference from Djomy. If you were charged, contact support with your order ID.'
        );
        setConfirming(false);
        return;
      }

      try {
        const verification = await paymentService.confirmDjomyPayment({
          orderId,
          transactionId,
          status: returnStatus,
        });

        if (!verification.verified) {
          setFailed(true);
          setError('Payment could not be verified with Djomy. Contact support if you were charged.');
          await OrderService.updateOrderStatus(orderId, ORDER_STATUS.PAYMENT_FAILED);
          setConfirming(false);
          return;
        }

        setPaymentRef(verification.transactionId || transactionId);
        await OrderService.markOrderPaid(orderId, verification.transactionId || transactionId);
      } catch (err) {
        console.error('Failed to confirm payment:', err);
        setError(
          'Payment received but order status could not be updated. Contact support with your reference.'
        );
      } finally {
        setConfirming(false);
      }
    }
    confirmPayment();
  }, [orderId, transactionId, returnStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-center p-8">
        {confirming ? (
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-6" />
        ) : failed ? (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {confirming ? 'Confirming payment…' : failed ? 'Payment not completed' : 'Payment Successful!'}
        </h1>
        <p className="text-gray-600 mb-6">
          {confirming
            ? 'Verifying your payment with Djomy…'
            : failed
              ? error
              : 'Thank you for your purchase. Your payment has been securely processed.'}
        </p>

        {error && !failed && <p className="text-sm text-amber-700 mb-4">{error}</p>}

        {paymentRef && !failed && (
          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2 font-medium">Transaction Reference</p>
            <p className="font-mono text-gray-900 font-semibold break-all text-sm bg-white p-3 rounded-lg border border-gray-200">
              {paymentRef}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!failed && (
            <button
              onClick={() => navigate('/download-invoice', { state: { orderId: orderId || paymentRef } })}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              View Invoice
            </button>
          )}

          {failed && (
            <Link
              to="/checkout/cart"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Return to cart
            </Link>
          )}

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
