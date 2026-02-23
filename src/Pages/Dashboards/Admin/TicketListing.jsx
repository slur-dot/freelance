import React, { useEffect, useState } from "react";
import { Search, Trash2, Pencil } from "lucide-react";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

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

export default function TicketListings() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: "",
    description: "",
    status: "open",
    priority: "medium",
    assignedTo: ""
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllTickets(null, 100);
      setTickets(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin_dashboard.listings.ticket.actions.delete_confirm'))) {
      return;
    }

    try {
      setLoading(true);
      await AdminService.deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error deleting ticket:", e);
      setError(t('admin_dashboard.listings.ticket.errors.delete_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      setEditingTicket(id);
      setEditFormData({
        subject: ticket.subject || "",
        description: ticket.description || "",
        status: ticket.status || "open",
        priority: ticket.priority || "medium",
        assignedTo: ticket.assignedTo || ""
      });
    }
  };

  const handleView = (id) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      setViewingTicket(ticket);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTicket) return;

    try {
      setLoading(true);
      const updateData = {
        ...editFormData,
        updatedAt: new Date()
      };
      await AdminService.updateTicket(editingTicket, updateData);

      setTickets((prev) => prev.map((t) => (t.id === editingTicket ? { ...t, ...updateData } : t)));
      setEditingTicket(null);
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error updating ticket:", e);
      setError(t('admin_dashboard.listings.ticket.errors.update_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setEditFormData({
      subject: "",
      description: "",
      status: "open",
      priority: "medium",
      assignedTo: ""
    });
  };

  const handleCloseView = () => {
    setViewingTicket(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Heading with button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {t('admin_dashboard.listings.ticket.title')}
        </h1>

      </div>

      <RCCard className="p-3 sm:p-4 md:p-6">
        {/* Search */}
        <div className="relative mb-4">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          {loading && <div className="mb-3 text-gray-500 text-sm">{t('common.loading')}</div>}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput placeholder={t('admin_dashboard.listings.ticket.search_placeholder')} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.s_no')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.name')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.assigned_to')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.created_date')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.status')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.ticket.table.headers.actions')}</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {tickets.map((ticket, index) => (
                <RCTableRow key={ticket.id}>
                  <RCTableCell>{index + 1}</RCTableCell>
                  <RCTableCell className="font-medium">
                    {editingTicket === ticket.id ? (
                      <input
                        type="text"
                        value={editFormData.subject}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={t('admin_dashboard.listings.ticket.form.subject_placeholder')}
                      />
                    ) : (
                      ticket.subject
                    )}
                  </RCTableCell>
                  <RCTableCell>
                    {editingTicket === ticket.id ? (
                      <input
                        type="text"
                        value={editFormData.assignedTo}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={t('admin_dashboard.listings.ticket.form.assigned_to_placeholder')}
                      />
                    ) : (
                      ticket.assignedTo || '-'
                    )}
                  </RCTableCell>
                  <RCTableCell>{new Date(ticket.createdAt?._seconds ? ticket.createdAt._seconds * 1000 : ticket.createdAt || Date.now()).toLocaleDateString()}</RCTableCell>
                  <RCTableCell>
                    {editingTicket === ticket.id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="open">{t('admin_dashboard.listings.ticket.status.open')}</option>
                        <option value="in_progress">{t('admin_dashboard.listings.ticket.status.in_progress')}</option>
                        <option value="resolved">{t('admin_dashboard.listings.ticket.status.resolved')}</option>
                        <option value="closed">{t('admin_dashboard.listings.ticket.status.closed')}</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium
                          ${(ticket.status || 'open').toLowerCase() === "open"
                            ? "bg-green-100 text-green-800"
                            : (ticket.status || '').toLowerCase() === "closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full
                            ${(ticket.status || 'open').toLowerCase() === "open"
                              ? "bg-green-500"
                              : (ticket.status || '').toLowerCase() === "closed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                        />
                        {t(`admin_dashboard.listings.ticket.status.${(ticket.status || 'open')}`)}
                      </span>
                    )}
                  </RCTableCell>
                  <RCTableCell>
                    <div className="flex items-center gap-2">
                      {editingTicket === ticket.id ? (
                        <>
                          <RCButton
                            variant="custom"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={handleSaveEdit}
                            disabled={loading}
                            title="Save changes"
                          >
                            {t('admin_dashboard.listings.ticket.actions.save')}
                          </RCButton>
                          <RCButton
                            variant="custom"
                            className="bg-gray-600 text-white hover:bg-gray-700"
                            onClick={handleCancelEdit}
                            disabled={loading}
                            title="Cancel editing"
                          >
                            {t('admin_dashboard.listings.ticket.actions.cancel')}
                          </RCButton>
                        </>
                      ) : (
                        <>
                          <RCButton
                            size="icon"
                            onClick={() => handleDelete(ticket.id)}
                            className="text-red-600 hover:bg-red-50"
                            disabled={loading}
                            title="Delete ticket"
                          >
                            <Trash2 className="h-4 w-4" />
                          </RCButton>
                          <RCButton
                            size="icon"
                            onClick={() => handleEdit(ticket.id)}
                            className="text-blue-600 hover:bg-blue-50"
                            disabled={loading}
                            title="Edit ticket"
                          >
                            <Pencil className="h-4 w-4" />
                          </RCButton>
                          <RCButton
                            variant="custom"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleView(ticket.id)}
                            disabled={loading}
                            title="View ticket details"
                          >
                            {t('admin_dashboard.listings.ticket.actions.view')}
                          </RCButton>
                        </>
                      )}
                    </div>
                  </RCTableCell>
                </RCTableRow>
              ))}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-3">
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className="border rounded-md p-3 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-sm mb-1">
                {index + 1}. {ticket.subject}
              </h2>
              <p className="text-xs text-gray-500 mb-1">
                {t('admin_dashboard.listings.ticket.mobile.assigned_to')} {ticket.assignedTo || t('admin_dashboard.listings.ticket.details.unassigned')}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {t('admin_dashboard.listings.ticket.mobile.created')} {new Date(ticket.createdAt?._seconds ? ticket.createdAt._seconds * 1000 : ticket.createdAt || Date.now()).toLocaleDateString()}
              </p>
              <p
                className={`text-xs font-medium mb-2 ${(ticket.status || 'open').toLowerCase() === "open"
                  ? "text-green-600"
                  : (ticket.status || '').toLowerCase() === "closed"
                    ? "text-red-600"
                    : "text-yellow-600"
                  }`}
              >
                {t('admin_dashboard.listings.ticket.mobile.status')} {t(`admin_dashboard.listings.ticket.status.${(ticket.status || 'open')}`)}
              </p>
              <div className="flex items-center gap-2">
                <RCButton
                  size="icon"
                  onClick={() => handleDelete(ticket.id)}
                  className="text-red-600 hover:bg-red-50"
                  disabled={loading}
                  title="Delete ticket"
                >
                  <Trash2 className="h-4 w-4" />
                </RCButton>
                <RCButton
                  size="icon"
                  onClick={() => handleEdit(ticket.id)}
                  className="text-blue-600 hover:bg-blue-50"
                  disabled={loading}
                  title="Edit ticket"
                >
                  <Pencil className="h-4 w-4" />
                </RCButton>
                <RCButton
                  variant="custom"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => handleView(ticket.id)}
                  disabled={loading}
                  title="View ticket details"
                >
                  {t('admin_dashboard.listings.ticket.actions.view')}
                </RCButton>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 border-t border-gray-300 pt-4">
          <RCButton variant="outline">{t('admin_dashboard.pagination.previous')}</RCButton>
          <span className="text-xs sm:text-sm text-gray-500">
            {t('admin_dashboard.pagination.page_info', { current: 1, total: 10 })}
          </span>
          <RCButton>{t('admin_dashboard.pagination.next')}</RCButton>
        </div>
      </RCCard>

      {/* View Ticket Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('admin_dashboard.listings.ticket.details.title')}</h2>
                <button
                  onClick={handleCloseView}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin_dashboard.listings.ticket.details.subject')}
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {viewingTicket.subject}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin_dashboard.listings.ticket.details.description')}
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded min-h-[100px]">
                    {viewingTicket.description || t('admin_dashboard.listings.ticket.details.no_description')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin_dashboard.listings.ticket.details.status')}
                    </label>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${(viewingTicket.status || 'open').toLowerCase() === "open"
                          ? "bg-green-100 text-green-800"
                          : (viewingTicket.status || '').toLowerCase() === "closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {t(`admin_dashboard.listings.ticket.status.${(viewingTicket.status || 'open')}`)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin_dashboard.listings.ticket.details.priority')}
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewingTicket.priority || t('admin_dashboard.listings.ticket.priority.medium')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin_dashboard.listings.ticket.details.assigned_to')}
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewingTicket.assignedTo || t('admin_dashboard.listings.ticket.details.unassigned')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin_dashboard.listings.ticket.details.created_by')}
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewingTicket.createdBy || t('admin_dashboard.listings.ticket.details.unknown')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin_dashboard.listings.ticket.details.created_date')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(viewingTicket.createdAt?._seconds ? viewingTicket.createdAt._seconds * 1000 : viewingTicket.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <RCButton
                  variant="custom"
                  className="bg-gray-600 text-white hover:bg-gray-700"
                  onClick={handleCloseView}
                >
                  {t('admin_dashboard.listings.ticket.actions.close')}
                </RCButton>
                <RCButton
                  variant="custom"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    handleCloseView();
                    handleEdit(viewingTicket.id);
                  }}
                >
                  {t('admin_dashboard.listings.ticket.actions.edit_ticket')}
                </RCButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
