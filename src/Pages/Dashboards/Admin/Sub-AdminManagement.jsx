import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Edit, Plus, X } from "lucide-react";
import { AdminService } from "../../../services/adminService";

export default function SubAdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("subAdminName");
  const [sortDirection] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [deletingSubAdmin, setDeletingSubAdmin] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    permissions: "",
    roles: []
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    permissions: "",
    roles: []
  });
  const [selectedRoles, setSelectedRoles] = useState(["Role 1", "Role 1", "Role 1"]);
  const [editSelectedRoles, setEditSelectedRoles] = useState([]);

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllSubAdmins(null, 100);
      setSubAdmins(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(subAdmins.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id) => {
    const subAdmin = subAdmins.find(admin => admin.id === id);
    setDeletingSubAdmin(subAdmin);
    setShowDeleteModal(true);
  };

  const handleEdit = (id) => {
    const subAdmin = subAdmins.find(admin => admin.id === id);
    setEditingSubAdmin(subAdmin);
    setEditFormData({
      name: subAdmin.subAdminName,
      permissions: subAdmin.permission,
      roles: []
    });
    setEditSelectedRoles([subAdmin.role]);
    setShowEditModal(true);
  };

  const handleAddSubAdmin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", permissions: "", roles: [] });
    setSelectedRoles(["Role 1", "Role 1", "Role 1"]);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSubAdmin(null);
    setEditFormData({ name: "", permissions: "", roles: [] });
    setEditSelectedRoles([]);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingSubAdmin(null);
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

  const handleClearAllRoles = () => {
    setSelectedRoles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await AdminService.createSubAdmin({
        subAdminName: formData.name,
        permission: formData.permissions,
        assignedDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        role: selectedRoles[0] || "Support"
      });
      fetchSubAdmins();
      setError("");
      handleCloseModal();
    } catch (e) {
      console.error("Error adding sub admin:", e);
      setError(`Failed to add sub admin: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        subAdminName: editFormData.name,
        permission: editFormData.permissions,
        role: editSelectedRoles[0] || editingSubAdmin.role,
        updatedAt: new Date()
      };
      await AdminService.updateSubAdmin(editingSubAdmin.id, updateData);

      setSubAdmins((prev) => prev.map((admin) => (admin.id === editingSubAdmin.id ? { ...admin, ...updateData } : admin)));
      setError("");
      handleCloseEditModal();
    } catch (e) {
      console.error("Error updating sub admin:", e);
      setError(`Failed to update sub admin: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await AdminService.deleteSubAdmin(deletingSubAdmin.id);
      setSubAdmins((prev) => prev.filter((admin) => admin.id !== deletingSubAdmin.id));
      setError("");
      handleCloseDeleteModal();
    } catch (e) {
      console.error("Error deleting sub admin:", e);
      setError(`Failed to delete sub admin: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getRolePillColor = (role) => {
    switch (role) {
      case "Support":
        return "bg-green-100 text-green-800";
      case "Head":
        return "bg-red-100 text-red-800";
      case "Order Manager":
        return "bg-orange-100 text-orange-800";
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "Content Manager":
        return "bg-purple-100 text-purple-800";
      case "Finance Manager":
        return "bg-indigo-100 text-indigo-800";
      case "Analytics Manager":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubAdmins = subAdmins.filter(subAdmin =>
    (subAdmin.subAdminName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subAdmin.permission || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subAdmin.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubAdmins = filteredSubAdmins.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFCFD' }}>
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#FCFCFD' }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Sub Admin Management</h1>
            <button
              onClick={handleAddSubAdmin}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Sub Admin
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mx-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none text-gray-700 placeholder-gray-500"
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            {loading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
          </div>
        </div>

        {/* Sub Admin Table */}
        <div className="shadow rounded-lg overflow-hidden mx-6 mb-6" style={{ backgroundColor: '#FCFCFD' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ backgroundColor: '#FCFCFD' }}>
              <thead className="border-b border-gray-200" style={{ backgroundColor: '#FCFCFD' }}>
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("displayName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Sub Admin Name</span>
                      {sortField === "displayName" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Permission
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Assigned Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200" style={{ backgroundColor: '#FCFCFD' }}>
                {paginatedSubAdmins.map((subAdmin) => (
                  <tr key={subAdmin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      {subAdmin.subAdminName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {subAdmin.permission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {subAdmin.assignedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRolePillColor(subAdmin.role)}`}>
                        {subAdmin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDelete(subAdmin.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Sub Admin"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(subAdmin.id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Sub Admin"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200" style={{ backgroundColor: '#FCFCFD' }}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Sub Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Sub Admin</h2>
              <p className="text-gray-600">Add your sub admins manually</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Permissions Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Permissions:</label>
                <div className="flex-1 ml-4 relative">
                  <select
                    value={formData.permissions}
                    onChange={(e) => handleInputChange("permissions", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select Permission</option>
                    <option value="User Management Access">User Management Access</option>
                    <option value="Support Team Access">Support Team Access</option>
                    <option value="Order Management Access">Order Management Access</option>
                    <option value="Content Management Access">Content Management Access</option>
                    <option value="Finance Management Access">Finance Management Access</option>
                    <option value="Analytics Access">Analytics Access</option>
                    <option value="Full Admin Access">Full Admin Access</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Roles Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Roles:</label>
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
                    <option value="">Select Role</option>
                    <option value="Head">Head</option>
                    <option value="Support">Support</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Analytics Manager">Analytics Manager</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
                {selectedRoles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllRoles}
                    className="ml-2 px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}
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
                  {loading ? "Adding..." : "Add Sub Admin"}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Sub Admin Modal */}
      {showEditModal && editingSubAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Sub Admin</h2>
              <p className="text-gray-600">Update sub admin information</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => handleEditInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Permissions Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Permissions:</label>
                <div className="flex-1 ml-4 relative">
                  <select
                    value={editFormData.permissions}
                    onChange={(e) => handleEditInputChange("permissions", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select Permission</option>
                    <option value="User Management Access">User Management Access</option>
                    <option value="Support Team Access">Support Team Access</option>
                    <option value="Order Management Access">Order Management Access</option>
                    <option value="Content Management Access">Content Management Access</option>
                    <option value="Finance Management Access">Finance Management Access</option>
                    <option value="Analytics Access">Analytics Access</option>
                    <option value="Full Admin Access">Full Admin Access</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Roles Field */}
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Roles:</label>
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
                    <option value="">Select Multiple</option>
                    <option value="Support">Support</option>
                    <option value="Head">Head</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Analytics Manager">Analytics Manager</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
                {editSelectedRoles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEditSelectedRoles([])}
                    className="ml-2 px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}
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
                  {loading ? "Updating..." : "Update Sub Admin"}
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
      {showDeleteModal && deletingSubAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
              <p className="text-gray-600">Are you sure you want to delete this sub admin?</p>
            </div>

            {/* Sub Admin Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">{deletingSubAdmin.subAdminName}</p>
              <p className="text-gray-600 text-sm">{deletingSubAdmin.role}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
