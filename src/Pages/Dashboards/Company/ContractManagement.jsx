import React, { useState } from 'react';
import { FileText, Download, Clock, CheckCircle2, AlertCircle, FilePlus, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockContracts = [
  { id: 'C-2024-001', vendor: 'TechCorp Africa', type: 'SLA', status: 'active', startDate: '2024-01-15', endDate: '2025-01-14', value: '15,000,000 GNF' },
  { id: 'C-2024-002', vendor: 'DevStudio Guinea', type: 'Project', status: 'pending_signature', startDate: '2024-05-01', endDate: '2024-08-30', value: '8,500,000 GNF' },
  { id: 'C-2023-089', vendor: 'Global Office Supplies', type: 'Procurement', status: 'expired', startDate: '2023-02-10', endDate: '2024-02-09', value: '2,000,000 GNF' },
];

export default function ContractManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredContracts = mockContracts.filter(c => 
    c.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-500 mt-1">Manage vendor SLAs, project contracts, and procurement agreements.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-all">
          <FilePlus className="w-4 h-4" />
          Request New Contract
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <FileText className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-gray-800">12</span>
           </div>
           <p className="text-sm font-medium text-gray-500">Total Contracts</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg">
               <CheckCircle2 className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-gray-800">8</span>
           </div>
           <p className="text-sm font-medium text-gray-500">Active SLAs</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
               <Clock className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-gray-800">3</span>
           </div>
           <p className="text-sm font-medium text-gray-500">Pending Signatures</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg">
               <AlertCircle className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-gray-800">1</span>
           </div>
           <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
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
                <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{contract.id}</td>
                  <td className="px-6 py-4 font-semibold text-blue-700">{contract.vendor}</td>
                  <td className="px-6 py-4">{contract.type}</td>
                  <td className="px-6 py-4">
                    {contract.status === 'active' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>}
                    {contract.status === 'pending_signature' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>}
                    {contract.status === 'expired' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="text-gray-900">{contract.startDate}</div>
                    <div className="text-gray-400">to {contract.endDate}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                         <ExternalLink className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download PDF">
                         <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No contracts found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
