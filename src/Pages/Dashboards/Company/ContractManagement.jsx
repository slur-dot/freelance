import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, CheckCircle2, AlertCircle, FilePlus, ExternalLink, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../../../firebaseConfig';
import { ContractService } from '../../../services/contractService';

export default function ContractManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedContracts, setExpandedContracts] = useState({});
  const [creating, setCreating] = useState(false);
  const [newContract, setNewContract] = useState({
    vendor: '', type: 'Project', startDate: '', endDate: '', value: '', description: ''
  });

  const user = auth.currentUser;

  const fetchContracts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [contractsList, contractStats] = await Promise.all([
        ContractService.getCompanyContracts(user.uid),
        ContractService.getContractStats(user.uid)
      ]);
      if (contractsList.length === 0) {
        // Inject mock contract for demonstration if DB is empty
        const mockContract = {
          id: "CTR-2024-001",
          vendor: "TechCorp Solutions",
          type: "SLA",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          value: "50,000,000",
          description: "Annual SLA for server maintenance and 24/7 IT support.",
          terms: "Standard SLA terms apply. 99.9% uptime guarantee. Response time < 2 hours for critical issues.",
          records: [
             { id: "REC1", name: "Q1 Invoice", date: "2024-03-31", type: "Invoice" },
             { id: "REC2", name: "Maintenance Report", date: "2024-02-15", type: "Report" }
          ]
        };
        setContracts([mockContract]);
        setStats({ total: 1, active: 1, pending: 0, expired: 0 });
      } else {
        setContracts(contractsList);
        setStats(contractStats);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const handleCreateContract = async (e) => {
    e.preventDefault();
    if (!user || !newContract.vendor) return;
    try {
      setCreating(true);
      await ContractService.createContract(user.uid, newContract);
      setNewContract({ vendor: '', type: 'Project', startDate: '', endDate: '', value: '', description: '' });
      setShowCreateModal(false);
      await fetchContracts();
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (contractId, newStatus) => {
    try {
      await ContractService.updateContract(contractId, { status: newStatus });
      await fetchContracts();
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("Failed to update contract status.");
    }
  };

  const handleDelete = async (contractId) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    try {
      await ContractService.deleteContract(contractId);
      await fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("Failed to delete contract.");
    }
  };

  const toggleContract = (id) => {
    setExpandedContracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredContracts = contracts.filter(c =>
    (c.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateVal) => {
    if (!dateVal) return '-';
    if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString();
    return String(dateVal);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-500 mt-1">Manage vendor SLAs, project contracts, and procurement agreements.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <FilePlus className="w-4 h-4" />
          Request New Contract
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-5 h-5" /></div>
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Total Contracts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            <span className="text-2xl font-bold text-gray-800">{stats.active}</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Active SLAs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-5 h-5" /></div>
            <span className="text-2xl font-bold text-gray-800">{stats.pending}</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Pending Signatures</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
            <span className="text-2xl font-bold text-gray-800">{stats.expired}</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Expired</p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-gray-800 text-lg">All Contracts</h2>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Contract ID</th>
                <th className="px-6 py-4">Vendor / Partner</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContracts.map((contract) => (
                <React.Fragment key={contract.id}>
                  <tr 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => toggleContract(contract.id)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{contract.id.slice(0, 12)}</td>
                    <td className="px-6 py-4 font-semibold text-blue-700">{contract.vendor}</td>
                    <td className="px-6 py-4">{contract.type}</td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={contract.status}
                        onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                          contract.status === 'active' ? 'bg-green-100 text-green-800' :
                          contract.status === 'pending_signature' ? 'bg-yellow-100 text-yellow-800' :
                          contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending_signature">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-gray-900">{formatDate(contract.startDate) || contract.startDate}</div>
                      <div className="text-gray-400">to {formatDate(contract.endDate) || contract.endDate}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-gray-400">
                        {expandedContracts[contract.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(contract.id); }}
                          className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedContracts[contract.id] && (
                    <tr className="bg-blue-50/30">
                      <td colSpan="6" className="px-6 py-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column: Terms & Details */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" /> Contract Terms & Details
                            </h3>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                              <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Value</span>
                                <div className="text-sm font-medium text-gray-900">{contract.value || '-'}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Description</span>
                                <div className="text-sm text-gray-700 mt-1">{contract.description || 'No description provided.'}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Specific Terms</span>
                                <div className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded border border-gray-100">
                                  {contract.terms || 'Standard platform terms apply.'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Associated Records */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" /> Associated Records
                            </h3>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              {contract.records && contract.records.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                  {contract.records.map(record => (
                                    <li key={record.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded bg-gray-100 text-gray-600`}>
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                                          <div className="text-xs text-gray-500">{record.type} • {record.date}</div>
                                        </div>
                                      </div>
                                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="p-6 text-center text-sm text-gray-500">
                                  No associated records found for this contract.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {contracts.length === 0
                      ? "No contracts yet. Click 'Request New Contract' to create one."
                      : `No contracts found matching "${searchTerm}"`
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Request New Contract</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleCreateContract} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Partner Name *</label>
                  <input
                    type="text"
                    value={newContract.vendor}
                    onChange={(e) => setNewContract(prev => ({ ...prev, vendor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                  <select
                    value={newContract.type}
                    onChange={(e) => setNewContract(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Project">Project</option>
                    <option value="SLA">SLA</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newContract.startDate}
                      onChange={(e) => setNewContract(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={newContract.endDate}
                      onChange={(e) => setNewContract(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (GNF)</label>
                  <input
                    type="text"
                    value={newContract.value}
                    onChange={(e) => setNewContract(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 15,000,000 GNF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newContract.description}
                    onChange={(e) => setNewContract(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create Contract"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Removed View Contract Modal in favor of expandable rows */}
    </div>
  );
}
