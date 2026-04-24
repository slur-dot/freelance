import React, { useState } from 'react';
import { Monitor, Laptop, Printer, Smartphone, AlertTriangle, PenTool, CheckCircle, Search } from 'lucide-react';

const mockEquipment = [
  { id: 'EQ-001', name: 'MacBook Pro 16"', assignee: 'John Doe', status: 'active', condition: 'Good', lastChecked: '2024-03-10' },
  { id: 'EQ-042', name: 'Canon ImageRunner Printer', assignee: 'Office A', status: 'maintenance', condition: 'Needs Repair', lastChecked: '2024-04-18' },
  { id: 'EQ-018', name: 'Dell XPS 15', assignee: 'Sarah Smith', status: 'active', condition: 'Good', lastChecked: '2024-01-20' },
  { id: 'EQ-088', name: 'iPad Pro 12.9', assignee: 'Unassigned', status: 'available', condition: 'New', lastChecked: '2024-04-01' },
];

export default function EquipmentTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getIcon = (name) => {
    if (name.toLowerCase().includes('macbook') || name.toLowerCase().includes('dell')) return <Laptop className="w-5 h-5 text-gray-500" />;
    if (name.toLowerCase().includes('printer')) return <Printer className="w-5 h-5 text-gray-500" />;
    if (name.toLowerCase().includes('ipad') || name.toLowerCase().includes('phone')) return <Smartphone className="w-5 h-5 text-gray-500" />;
    return <Monitor className="w-5 h-5 text-gray-500" />;
  };

  const filteredItems = mockEquipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Tracking</h1>
          <p className="text-gray-500 mt-1">Manage company devices, monitor conditions, and track assignments.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all">
          Request IT Support
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">Total Devices</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
           </div>
           <div className="bg-blue-50 p-3 rounded-full"><Monitor className="w-6 h-6 text-blue-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">Assigned</p>
             <p className="text-2xl font-bold text-green-600 mt-1">38</p>
           </div>
           <div className="bg-green-50 p-3 rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">In Maintenance</p>
             <p className="text-2xl font-bold text-yellow-600 mt-1">5</p>
           </div>
           <div className="bg-yellow-50 p-3 rounded-full"><PenTool className="w-6 h-6 text-yellow-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">Lost / Damaged</p>
             <p className="text-2xl font-bold text-red-600 mt-1">2</p>
           </div>
           <div className="bg-red-50 p-3 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-gray-800 text-lg">Inventory List</h2>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text"
              placeholder="Search equipment or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getIcon(item.name)}
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.assignee}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{item.condition}</td>
                  <td className="px-6 py-4">
                    {item.status === 'active' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Assigned</span>}
                    {item.status === 'available' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Available</span>}
                    {item.status === 'maintenance' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Maintenance</span>}
                  </td>
                  <td className="px-6 py-4 text-right">{item.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
