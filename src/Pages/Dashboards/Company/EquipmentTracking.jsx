import { useTranslation } from "react-i18next";import React, { useState } from 'react';
import { Monitor, Laptop, Printer, Smartphone, AlertTriangle, PenTool, CheckCircle, Search, ChevronDown, ChevronUp, MapPin, Settings, Clock } from 'lucide-react';

const mockEquipment = [];

export default function EquipmentTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (name) => {
    if (name.toLowerCase().includes('macbook') || name.toLowerCase().includes('dell')) return <Laptop className="w-5 h-5 text-gray-500" />;
    if (name.toLowerCase().includes('printer')) return <Printer className="w-5 h-5 text-gray-500" />;
    if (name.toLowerCase().includes('ipad') || name.toLowerCase().includes('phone')) return <Smartphone className="w-5 h-5 text-gray-500" />;
    return <Monitor className="w-5 h-5 text-gray-500" />;
  };

  const filteredItems = mockEquipment.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDevices = mockEquipment.length;
  const assignedDevices = mockEquipment.filter((item) => item.status === 'active').length;
  const maintenanceDevices = mockEquipment.filter((item) => item.status === 'maintenance').length;
  const lostDamagedDevices = mockEquipment.filter((item) => item.status === 'lost' || item.status === 'damaged').length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("equipment_tracking_526", "Equipment Tracking")}</h1>
          <p className="text-gray-500 mt-1">{t("manage_company_devices_monitor_conditions_and_tr_987", "Manage company devices, monitor conditions, and track assignments.")}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all">
          {t("request_it_support_837", "Request IT Support")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">{t("total_devices_440", "Total Devices")}</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">{totalDevices}</p>
           </div>
           <div className="bg-blue-50 p-3 rounded-full"><Monitor className="w-6 h-6 text-blue-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">{t("assigned_289", "Assigned")}</p>
             <p className="text-2xl font-bold text-green-600 mt-1">{assignedDevices}</p>
           </div>
           <div className="bg-green-50 p-3 rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">{t("in_maintenance_317", "In Maintenance")}</p>
             <p className="text-2xl font-bold text-yellow-600 mt-1">{maintenanceDevices}</p>
           </div>
           <div className="bg-yellow-50 p-3 rounded-full"><PenTool className="w-6 h-6 text-yellow-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-sm font-medium text-gray-500">Lost / Damaged</p>
             <p className="text-2xl font-bold text-red-600 mt-1">{lostDamagedDevices}</p>
           </div>
           <div className="bg-red-50 p-3 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-gray-800 text-lg">{t("inventory_list_105", "Inventory List")}</h2>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={t("search_equipment_or_assignee_686", "Search equipment or assignee...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
            
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">{t("device_749", "Device")}</th>
                <th className="px-6 py-4">{t("assignee_725", "Assignee")}</th>
                <th className="px-6 py-4">{t("condition_174", "Condition")}</th>
                <th className="px-6 py-4">{t("status_346", "Status")}</th>
                <th className="px-6 py-4 text-right">{t("last_checked_643", "Last Checked")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) =>
              <React.Fragment key={item.id}>
                  <tr
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(item.id)}>
                  
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
                      {item.status === 'active' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{t("assigned_321", "Assigned")}</span>}
                      {item.status === 'available' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{t("available_868", "Available")}</span>}
                      {item.status === 'maintenance' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{t("maintenance_875", "Maintenance")}</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <span className="text-gray-900">{item.lastChecked}</span>
                        {expandedItems[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </td>
                  </tr>
                  
                  {expandedItems[item.id] &&
                <tr className="bg-blue-50/30">
                      <td colSpan="5" className="px-6 py-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Configuration Details */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Settings className="w-4 h-4 text-blue-600" /> {t("configuration_452", "Configuration")}
                            </h3>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700">{item.configuration}</p>
                            </div>
                          </div>

                          {/* Location & Tracking */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" /> {t("location_data_968", "Location Data")}
                            </h3>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700">{item.location}</p>
                            </div>
                          </div>

                          {/* Assignment History */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" /> {t("assignment_history_622", "Assignment History")}
                            </h3>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <ul className="divide-y divide-gray-100 text-sm">
                                {item.assignmentHistory.map((historyItem, idx) =>
                            <li key={idx} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                      <span className="font-medium text-gray-900">{historyItem.user}</span>
                                      <span className="text-xs text-gray-500 block">{historyItem.action}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{historyItem.date}</span>
                                  </li>
                            )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                }
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}