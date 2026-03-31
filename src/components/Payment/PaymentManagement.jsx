import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Smartphone, 
  Building2,
  ChevronRight,
  History,
  DollarSign
} from 'lucide-react';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ClientService } from '../../services/clientService';

const PaymentManagement = ({ userRole }) => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card', // card, mobile_money, bank
    details: {}
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          // Fetch saved methods from user profile
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPaymentMethods(data.savedPaymentMethods || []);
          }

          // Fetch transaction history (reusing ClientService logic if applicable)
          // For non-clients, we might need a generic service, but let's try ClientService for now
          const history = await ClientService.getPayments(user.uid);
          setTransactions(history);

        } catch (error) {
          console.error("Error fetching payment data:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddMethod = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const methodToAdd = {
        id: Date.now().toString(),
        ...newMethod,
        addedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, "users", user.uid), {
        savedPaymentMethods: arrayUnion(methodToAdd)
      });

      setPaymentMethods(prev => [...prev, methodToAdd]);
      setShowAddForm(false);
      setNewMethod({ type: 'card', details: {} });
      alert(t('payments.method_added', 'Payment method added successfully!'));
    } catch (error) {
      console.error("Error adding method:", error);
      alert(t('payments.add_error', 'Failed to add payment method.'));
    }
  };

  const handleRemoveMethod = async (method) => {
    if (!confirm(t('payments.confirm_remove', 'Are you sure you want to remove this payment method?'))) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        savedPaymentMethods: arrayRemove(method)
      });

      setPaymentMethods(prev => prev.filter(m => m.id !== method.id));
    } catch (error) {
      console.error("Error removing method:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Saved Payment Methods Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('payments.saved_methods', 'Saved Payment Methods')}</h3>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('payments.add_new', 'Add Method')}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-gray-800 mb-4">{t('payments.select_type', 'New Payment Method')}</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'mobile_money', label: 'MoMo/OM', icon: Smartphone },
                { id: 'bank', label: 'Bank', icon: Building2 },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setNewMethod({ ...newMethod, type: type.id })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    newMethod.type === type.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-white bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <type.icon className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Simple Form based on type */}
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder={newMethod.type === 'card' ? 'Card Holder Name' : newMethod.type === 'mobile_money' ? 'Account Holder Name' : 'Bank Name'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                onChange={(e) => setNewMethod({ ...newMethod, details: { ...newMethod.details, name: e.target.value } })}
              />
              <input 
                type="text" 
                placeholder={newMethod.type === 'card' ? 'Card Number' : newMethod.type === 'mobile_money' ? 'Phone Number' : 'Account Number'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                onChange={(e) => setNewMethod({ ...newMethod, details: { ...newMethod.details, value: e.target.value } })}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMethod}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  Save Method
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div key={method.id} className="relative bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {method.type === 'card' && <CreditCard className="w-6 h-6" />}
                    {method.type === 'mobile_money' && <Smartphone className="w-6 h-6" />}
                    {method.type === 'bank' && <Building2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{method.details.name || 'Unnamed'}</p>
                    <p className="text-sm text-gray-500">
                      {method.type === 'card' ? '•••• •••• •••• ' + method.details.value?.slice(-4) : method.details.value}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveMethod(method)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 border-2 border-dashed border-gray-100 rounded-2xl py-12 flex flex-col items-center justify-center text-gray-400">
              <CreditCard className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No saved payment methods yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Transaction History Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">{t('payments.history', 'Transaction History')}</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-500 uppercase tracking-wider">{t('payments.table.date', 'Date')}</th>
                  <th className="py-4 px-6 font-bold text-gray-500 uppercase tracking-wider">{t('payments.table.description', 'Description')}</th>
                  <th className="py-4 px-6 font-bold text-gray-500 uppercase tracking-wider">{t('payments.table.status', 'Status')}</th>
                  <th className="py-4 px-6 font-bold text-gray-500 uppercase tracking-wider text-right">{t('payments.table.amount', 'Amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{tx.description}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-green-100">
                          {tx.activity || 'Completed'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        {tx.amount} GNF
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 italic">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {transactions.length > 5 && (
            <div className="p-4 border-t border-gray-50 text-center">
              <button className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-700">
                View All Transactions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Account Balance (Role-specific) */}
      {(userRole === 'Freelancer' || userRole === 'Vendor' || userRole === 'Seller') && (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
           <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Available Balance</p>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-bold">12,450,000</h4>
                  <span className="text-xl font-medium text-white/80">GNF</span>
                </div>
              </div>
              <button className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Request Withdrawal
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
