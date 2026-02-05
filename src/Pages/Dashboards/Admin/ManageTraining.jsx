import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AdminService } from "../../../services/adminService";

export default function ManageTraining() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("clientName");
  const [sortDirection, setSortDirection] = useState("desc");
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrainingRequests = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllTrainingRequests(null, 100);
      setTrainingRequests(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingRequests();
  }, []);


  const itemsPerPage = 9; // Show 9 items per page as shown in the screenshot

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      await AdminService.updateTrainingRequest(id, {
        status: "approved",
        updatedAt: new Date()
      });

      setTrainingRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "approved" } : request)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error accepting training request:", e);
      setError(`Failed to accept training request: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async (id) => {
    if (!window.confirm("Are you sure you want to deny this training request?")) {
      return;
    }

    try {
      setLoading(true);
      await AdminService.updateTrainingRequest(id, {
        status: "rejected",
        updatedAt: new Date()
      });

      setTrainingRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error denying training request:", e);
      setError(`Failed to deny training request: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = trainingRequests.filter(request =>
    (request.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFCFD' }}>
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#FCFCFD' }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Training Requests</h1>

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

        {/* Training Requests Table */}
        <div className="shadow rounded-lg overflow-hidden mx-6 mb-6" style={{ backgroundColor: '#FCFCFD' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ backgroundColor: '#FCFCFD' }}>
              <thead className="border-b border-gray-200" style={{ backgroundColor: '#FCFCFD' }}>
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("companyId")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Client Name</span>
                      {sortField === "companyId" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Bidding Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200" style={{ backgroundColor: '#FCFCFD' }}>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      {request.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {request.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {request.biddingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {request.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        {request.status === 'pending' || !request.status ? (
                          <>
                            <button
                              onClick={() => handleAccept(request.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDeny(request.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Deny
                            </button>
                          </>
                        ) : (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}
                          </span>
                        )}
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
    </div>
  );
}
