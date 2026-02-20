import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2, Edit, Plus, FileText, MoreHorizontal, X } from "lucide-react";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

export default function SupportTeamManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("memberName");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [supportMembers, setSupportMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    tickets: ""
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    tickets: ""
  });
  const [selectedRoles, setSelectedRoles] = useState(["Ticket 1", "Ticket 2", "Ticket 3"]);
  const [editSelectedRoles, setEditSelectedRoles] = useState([]);

  const fetchSupportMembers = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllSupportAgents(null, 100);
      setSupportMembers(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportMembers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (id) => {
    const member = supportMembers.find(m => m.id === id);
    setViewingMember(member);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    const member = supportMembers.find(m => m.id === id);
    setEditingMember(member);
    setEditFormData({
      name: member.memberName,
      tickets: ""
    });
    setEditSelectedRoles([member.assignedTickets[0]?.label || "Role 1"]);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    const member = supportMembers.find(m => m.id === id);
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const handleAddMember = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({ name: "", tickets: "" });
    setSelectedRoles(["Ticket 1", "Ticket 2", "Ticket 3"]);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
    setEditFormData({ name: "", tickets: "" });
    setEditSelectedRoles([]);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingMember(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingMember(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveRole = (index) => {
    setSelectedRoles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveEditRole = (index) => {
    setEditSelectedRoles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const assignedTickets = selectedRoles.map((role, index) => ({
        id: index + 1,
        label: role,
        status: "active"
      }));

      await AdminService.createSupportAgent({
        memberName: formData.name,
        avgResponseTime: "1h 20m",
        avgResolutionTime: "1h 20m",
        assignedTickets: assignedTickets
      });
      fetchSupportMembers();
      setError(""); // Clear any previous errors
      handleCloseAddModal();
    } catch (e) {
      console.error("Error adding support member:", e);
      setError(`Failed to add support member: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const assignedTickets = editSelectedRoles.map((role, index) => ({
        id: index + 1,
        label: role,
        status: "active"
      }));

      const updateData = {
        memberName: editFormData.name,
        assignedTickets: assignedTickets,
        updatedAt: new Date()
      };

      await AdminService.updateSupportAgent(editingMember.id, updateData);

      setSupportMembers((prev) => prev.map((member) => (member.id === editingMember.id ? { ...member, ...updateData } : member)));
      setError(""); // Clear any previous errors
      handleCloseEditModal();
    } catch (e) {
      console.error("Error updating support member:", e);
      setError(`Failed to update support member: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await AdminService.deleteSupportAgent(deletingMember.id);
      setSupportMembers((prev) => prev.filter((member) => member.id !== deletingMember.id));
      setError(""); // Clear any previous errors
      handleCloseDeleteModal();
    } catch (e) {
      console.error("Error deleting support member:", e);
      setError(`Failed to delete support member: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    try {
      // Create CSV content
      const headers = ['Member Name', 'Average Response Time', 'Average Resolution Time', 'Assigned Tickets'];
      const csvContent = [
        headers.join(','),
        ...supportMembers.map(member => [
          `"${member.memberName || 'N/A'}"`,
          `"${member.avgResponseTime || 'N/A'}"`,
          `"${member.avgResolutionTime || 'N/A'}"`,
          `"${(member.assignedTickets || []).map(ticket => ticket.label).join('; ')}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `support_team_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error generating CSV report:", e);
      setError(`Failed to generate report: ${e.message}`);
    }
  };

  const itemsPerPage = 9; // Show 9 items per page as shown in the screenshot
  const totalPages = Math.ceil(supportMembers.length / itemsPerPage);

  const filteredMembers = supportMembers.filter(member =>
    (member.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.avgResponseTime || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.avgResolutionTime || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFCFD' }}>
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#FCFCFD' }}>
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">{t('admin_dashboard.support_team_management.title')}</h1>
            <button
              onClick={handleAddMember}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t('admin_dashboard.support_team_management.add_button')}
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-4 mb-6">
            <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
              {t('admin_dashboard.support_team_management.filter.date_range')}
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
              {t('admin_dashboard.support_team_management.filter.activity')}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Results and Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500">{t('admin_dashboard.support_team_management.showing_results', { count: filteredMembers.length })}</p>
              {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
              {loading && <div className="mt-1 text-sm text-gray-500">Loading...</div>}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleViewReport}
                className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t('admin_dashboard.support_team_management.report_button')}
              </button>
              <button className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Support Team Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("displayName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('admin_dashboard.support_team_management.table.headers.name')}</span>
                      {sortField === "displayName" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.support_team_management.table.headers.avg_response')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.support_team_management.table.headers.avg_resolution')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.support_team_management.table.headers.assigned_tickets')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.support_team_management.table.headers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-800">
                      {member.memberName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {member.avgResponseTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {member.avgResolutionTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex flex-wrap gap-1">
                        {(member.assignedTickets || []).slice(0, 2).map((ticket, index) => (
                          <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {ticket.label}
                          </span>
                        ))}
                        {(member.assignedTickets || []).length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {t('admin_dashboard.support_team_management.table.more', { count: (member.assignedTickets || []).length - 2 })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Support Member"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(member.id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Support Member"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleView(member.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('admin_dashboard.support_team_management.modals.view.title')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('admin_dashboard.pagination.previous')}
              </button>

              <span className="text-sm font-medium text-gray-700">
                {t('admin_dashboard.pagination.page_info', { current: currentPage, total: totalPages })}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('admin_dashboard.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.support_team_management.modals.add.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.support_team_management.modals.add.subtitle')}</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.form.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tickets Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.form.tickets')}</label>
                <div className="flex-1 ml-4 relative">
                  <select
                    value=""
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue && selectedValue.trim() !== "") {
                        setSelectedRoles(prev => [...prev, selectedValue]);
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  >
                    <option value="">{t('admin_dashboard.support_team_management.modals.form.select_multiple')}</option>
                    <option value="Ticket 1">Ticket 1</option>
                    <option value="Ticket 2">Ticket 2</option>
                    <option value="Ticket 3">Ticket 3</option>
                    <option value="Ticket 4">Ticket 4</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Selected Roles Tags */}
              <div className="ml-24">
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(index)}
                        className="ml-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('admin_dashboard.support_team_management.modals.add.submitting') : t('admin_dashboard.support_team_management.modals.add.submit')}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseAddModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.support_team_management.modals.edit.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.support_team_management.modals.edit.subtitle')}</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.form.name')}</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => handleEditInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tickets Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.form.tickets')}</label>
                <div className="flex-1 ml-4 relative">
                  <select
                    value=""
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue && selectedValue.trim() !== "") {
                        setEditSelectedRoles(prev => [...prev, selectedValue]);
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  >
                    <option value="">{t('admin_dashboard.support_team_management.modals.form.select_multiple')}</option>
                    <option value="Ticket 1">Ticket 1</option>
                    <option value="Ticket 2">Ticket 2</option>
                    <option value="Ticket 3">Ticket 3</option>
                    <option value="Ticket 4">Ticket 4</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Selected Roles Tags */}
              <div className="ml-24">
                <div className="flex flex-wrap gap-2">
                  {editSelectedRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditRole(index)}
                        className="ml-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('admin_dashboard.support_team_management.modals.edit.submitting') : t('admin_dashboard.support_team_management.modals.edit.submit')}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.support_team_management.modals.delete.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.support_team_management.modals.delete.message')}</p>
            </div>

            {/* Member Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">{deletingMember.memberName}</p>
              <p className="text-gray-600 text-sm">{deletingMember.assignedTickets[0]?.label || "No role assigned"}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
              >
                {t('admin_dashboard.support_team_management.modals.delete.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('admin_dashboard.support_team_management.modals.delete.deleting') : t('admin_dashboard.support_team_management.modals.delete.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {showViewModal && viewingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.support_team_management.modals.view.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.support_team_management.modals.view.subtitle')}</p>
            </div>

            {/* Member Information */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.view.name')}</label>
                <span className="text-gray-800">{viewingMember.memberName}</span>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.view.response_time')}</label>
                <span className="text-gray-800">{viewingMember.avgResponseTime}</span>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">{t('admin_dashboard.support_team_management.modals.view.resolution_time')}</label>
                <span className="text-gray-800">{viewingMember.avgResolutionTime}</span>
              </div>

              <div className="flex items-start">
                <label className="w-32 text-sm font-medium text-gray-700 mt-2">{t('admin_dashboard.support_team_management.modals.view.assigned_tickets')}</label>
                <div className="flex flex-wrap gap-2">
                  {viewingMember.assignedTickets.map((ticket, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${ticket.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${ticket.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                      {ticket.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="text-center pt-6">
              <button
                onClick={handleCloseViewModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
              >
                {t('admin_dashboard.support_team_management.modals.view.close')}
              </button>
            </div>

            {/* Close Button icon */}
            <button
              onClick={handleCloseViewModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
