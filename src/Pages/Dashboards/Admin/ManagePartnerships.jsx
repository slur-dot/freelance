import React, { useEffect, useState } from "react";
import { Search, Trash2, Eye, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { db } from "../../../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

// Reusable Button
function RCButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  let base = "";

  if (variant === "outline") {
    base =
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50";
  } else if (variant === "default") {
    base =
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50";
  } else if (variant === "custom") {
    base = ""; // allow full customization
  }

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
      : "px-3 md:px-4 py-2 rounded-md text-sm font-medium";

  return (
    <button className={`${base} ${sizeCls} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Input
function RCInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full ${className}`}
      {...props}
    />
  );
}

// Card
function RCCard({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

// Table
function RCTable({ children }) {
  return (
    <table className="hidden sm:table min-w-full text-xs sm:text-sm text-left divide-y divide-gray-200">
      {children}
    </table>
  );
}
function RCTableHeader({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}
function RCTableBody({ children }) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}
function RCTableRow({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}
function RCTableHead({ children, className = "" }) {
  return (
    <th
      className={`px-3 sm:px-6 py-3 font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}
function RCTableCell({ children, className = "" }) {
  return (
    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

export default function ManagePartnerships() {
  const { t } = useTranslation();
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [viewingPartnership, setViewingPartnership] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "partnerships"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPartnerships(data);
      setFilteredPartnerships(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching partnerships:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPartnerships(partnerships);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = partnerships.filter(p => 
      (p.name?.toLowerCase() || "").includes(lowerQuery) ||
      (p.email?.toLowerCase() || "").includes(lowerQuery) ||
      (p.partnershipType?.toLowerCase() || "").includes(lowerQuery)
    );
    setFilteredPartnerships(filtered);
  }, [searchQuery, partnerships]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin_dashboard.partnerships.actions.delete_confirm', 'Are you sure you want to delete this application?'))) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "partnerships", id));
      setError(""); 
    } catch (e) {
      console.error("Error deleting partnership:", e);
      setError("Failed to delete the application.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "partnerships", id), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (e) {
      console.error("Error updating status:", e);
      alert("Failed to update status.");
    }
  };

  const handleView = (partnership) => {
    setViewingPartnership(partnership);
  };

  const handleCloseView = () => {
    setViewingPartnership(null);
  };

  const getStatusColor = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'accepted' || s === 'approved') return 'bg-green-100 text-green-800';
    if (s === 'rejected') return 'bg-red-100 text-red-800';
    if (s === 'contacted' || s === 'in progress') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800'; // pending
  };

  const getStatusDotColor = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'accepted' || s === 'approved') return 'bg-green-500';
    if (s === 'rejected') return 'bg-red-500';
    if (s === 'contacted' || s === 'in progress') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {t('admin_dashboard.partnerships.title', 'Manage Partnerships')}
        </h1>
      </div>

      <RCCard className="p-3 sm:p-4 md:p-6">
        {/* Search */}
        <div className="relative mb-4">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput 
            placeholder={t('admin_dashboard.partnerships.search_placeholder', 'Search by name, email or type...')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead>{t('admin_dashboard.partnerships.table.date', 'Date')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.partnerships.table.company', 'Company / Name')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.partnerships.table.contact', 'Contact')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.partnerships.table.type', 'Type')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.partnerships.table.status', 'Status')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.partnerships.table.actions', 'Actions')}</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {loading && filteredPartnerships.length === 0 ? (
                <RCTableRow>
                  <RCTableCell colSpan="6" className="text-center py-8 text-gray-500">
                    {t('common.loading', 'Loading...')}
                  </RCTableCell>
                </RCTableRow>
              ) : filteredPartnerships.length === 0 ? (
                <RCTableRow>
                  <RCTableCell colSpan="6" className="text-center py-8 text-gray-500">
                    {t('admin_dashboard.partnerships.no_data', 'No partnership applications found.')}
                  </RCTableCell>
                </RCTableRow>
              ) : (
                filteredPartnerships.map((item) => (
                  <RCTableRow key={item.id}>
                    <RCTableCell className="text-gray-500">
                      {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </RCTableCell>
                    <RCTableCell>
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </RCTableCell>
                    <RCTableCell>
                      <div className="flex flex-col">
                        <span className="text-gray-900">{item.email}</span>
                        <span className="text-gray-500 text-xs">{item.phone}</span>
                      </div>
                    </RCTableCell>
                    <RCTableCell>
                      <span className="capitalize text-gray-700">{item.partnershipType}</span>
                    </RCTableCell>
                    <RCTableCell>
                      <select
                        value={item.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer outline-none ${getStatusColor(item.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </RCTableCell>
                    <RCTableCell>
                      <div className="flex items-center gap-2">
                        <RCButton
                          size="icon"
                          onClick={() => handleView(item)}
                          className="text-blue-600 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </RCButton>
                        <RCButton
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:bg-red-50"
                          title="Delete Application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </RCButton>
                      </div>
                    </RCTableCell>
                  </RCTableRow>
                ))
              )}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-3 mt-4">
          {loading && filteredPartnerships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t('common.loading', 'Loading...')}</div>
          ) : filteredPartnerships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t('admin_dashboard.partnerships.no_data', 'No partnership applications found.')}</div>
          ) : (
            filteredPartnerships.map((item) => (
              <div key={item.id} className="border rounded-md p-4 shadow-sm bg-white relative">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-gray-900">{item.name}</h2>
                  <span className="text-xs text-gray-500">
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{item.email}</div>
                <div className="text-sm text-gray-600 mb-3">{item.phone}</div>
                
                <div className="flex justify-between items-center mt-4">
                  <select
                    value={item.status || 'pending'}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none ${getStatusColor(item.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <RCButton size="icon" onClick={() => handleView(item)} className="text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </RCButton>
                    <RCButton size="icon" onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </RCButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </RCCard>

      {/* View Details Modal */}
      {viewingPartnership && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Partnership Details</h2>
              <button onClick={handleCloseView} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Company / Name</label>
                  <p className="text-base font-medium text-gray-900">{viewingPartnership.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Partnership Type</label>
                  <p className="text-base font-medium text-gray-900 capitalize">{viewingPartnership.partnershipType}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Email</label>
                  <a href={`mailto:${viewingPartnership.email}`} className="text-base font-medium text-blue-600 hover:underline">{viewingPartnership.email}</a>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                  <a href={`tel:${viewingPartnership.phone}`} className="text-base font-medium text-blue-600 hover:underline">{viewingPartnership.phone}</a>
                </div>
              </div>

              {/* Long Text Areas */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Details</label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                  {viewingPartnership.projectDetails || 'No details provided.'}
                </div>
              </div>

              {viewingPartnership.comments && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Comments</label>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                    {viewingPartnership.comments}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {viewingPartnership.fileUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Attached Document</label>
                  <a 
                    href={viewingPartnership.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-[#15803D]/10 text-[#15803D] hover:bg-[#15803D]/20 rounded-lg font-semibold transition-colors text-sm"
                  >
                    <FileDown className="w-5 h-5" />
                    Download {viewingPartnership.fileName || 'Document'}
                  </a>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
               <RCButton variant="custom" className="bg-gray-800 text-white hover:bg-gray-900 font-semibold px-6" onClick={handleCloseView}>
                 Close
               </RCButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
