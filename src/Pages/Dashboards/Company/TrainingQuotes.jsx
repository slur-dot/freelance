import React, { useState, useMemo, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { CompanyService } from "../../../services/companyService";
import { auth } from "../../../firebaseConfig";

// Button Component (Reused/Inline)
function TPButton({
  children,
  className = "",
  variant = "default",
  size = "md",
  disabled,
  ...props
}) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
      : variant === "ghost"
        ? "text-blue-600 hover:bg-blue-50"
        : variant === "danger"
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-green-700 hover:bg-green-800 text-white";

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
      : size === "sm"
        ? "px-3 py-1.5 rounded-md text-xs font-medium"
        : "px-4 py-2 rounded-md text-sm font-medium";

  return (
    <button
      disabled={disabled}
      className={`${base} ${sizeCls} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Input
function TPInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 w-full text-sm ${className}`}
      {...props}
    />
  );
}

export default function TrainingQuotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestedCoursesRaw, setRequestedCoursesRaw] = useState([]);
  const [companyGamification, setCompanyGamification] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await CompanyService.getDashboardData(user.uid);
      const gamification = dashboardData.stats?.gamification;

      if (gamification?.courses?.requestedCourses) {
        const rawRequests = gamification.courses.requestedCourses;
        setRequestedCoursesRaw(rawRequests);
        setCompanyGamification(gamification);

        const transformedQuotes = rawRequests.map((request, index) => ({
          id: `request-${index}`,
          client: user.displayName || "Company", // Display user/company name
          description: `${request.courseName} for ${request.employeeCount} employees`,
          date: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          amount: `${(request.cost || request.amount || 0).toLocaleString()} GNF`,
          employeeCount: request.employeeCount,
          status: request.status || "Pending",
          _sourceIndex: index
        }));

        setQuotes(transformedQuotes);
      } else {
        setQuotes([]);
        setRequestedCoursesRaw([]);
        setCompanyGamification(gamification || {});
      }

    } catch (err) {
      console.error('Error fetching training quotes:', err);
      setError(`Failed to load training quotes: ${err.message}`);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return quotes;
    return quotes.filter(
      (q) =>
        q.client.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term)
    );
  }, [searchTerm, quotes]);

  const updateRequestStatus = async (quoteId, newStatus) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote || quote._sourceIndex == null || !companyGamification || !user) return;

    try {
      setUpdatingId(quoteId);

      // Build updated raw array
      const updatedRequests = requestedCoursesRaw.map((req, idx) => {
        if (idx === quote._sourceIndex) {
          return { ...req, status: newStatus };
        }
        return req;
      });

      // Optimistic UI update for table
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
      setRequestedCoursesRaw(updatedRequests);

      // Prepare payload preserving other gamification data
      const updatedGamification = {
        ...companyGamification,
        courses: {
          ...(companyGamification.courses || {}),
          requestedCourses: updatedRequests
        }
      };

      await CompanyService.updateCompanyGamification(user.uid, updatedGamification);

    } catch (e) {
      console.error(e);
      // Revert UI on failure
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: q.status } : q));
      alert('Failed to update request status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAccept = (id) => updateRequestStatus(id, 'Accepted');

  const handleDeny = (id) => updateRequestStatus(id, 'Denied');

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-lg text-gray-700">Loading training quotes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading training quotes</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => fetchQuotes()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Custom Training Requests
        </h1>
      </header>

      {/* Search */}
      <div className="relative mb-6 w-full bg-white rounded-md shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <TPInput
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search quotes"
        />
      </div>

      {/* Table (Desktop and larger) */}
      <div className="hidden md:block flex-1 overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                Company
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Training Request
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                Request Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-3 font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {quote.client}
                </td>
                <td className="px-3 sm:px-6 py-4 text-gray-700 break-words max-w-[200px] sm:max-w-none">
                  {quote.description}
                </td>
                <td className="px-3 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                  {quote.date}
                </td>
                <td className="px-3 sm:px-6 py-4 text-gray-800 font-semibold whitespace-nowrap">
                  {quote.amount}
                </td>
                <td className="px-3 sm:px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${quote.status === 'Accepted'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : quote.status === 'Denied'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                    >
                      {quote.status}
                    </span>
                    {quote.status !== 'Accepted' && (
                      <TPButton size="sm" disabled={updatingId === quote.id} onClick={() => handleAccept(quote.id)}>
                        Accept
                      </TPButton>
                    )}
                    {quote.status !== 'Denied' && (
                      <TPButton variant="danger" size="sm" disabled={updatingId === quote.id} onClick={() => handleDeny(quote.id)}>
                        Deny
                      </TPButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No training quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Small screens) */}
      <div className="md:hidden space-y-3">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm">{quote.client}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${quote.status === 'Accepted'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : quote.status === 'Denied'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                >
                  {quote.status}
                </span>
              </div>
              <p className="text-gray-700 text-xs">{quote.description}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{quote.date}</span>
                <span className="font-semibold text-gray-800">{quote.amount}</span>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                {quote.status !== 'Accepted' && (
                  <TPButton size="sm" disabled={updatingId === quote.id} onClick={() => handleAccept(quote.id)}>
                    Accept
                  </TPButton>
                )}
                {quote.status !== 'Denied' && (
                  <TPButton variant="danger" size="sm" disabled={updatingId === quote.id} onClick={() => handleDeny(quote.id)}>
                    Deny
                  </TPButton>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No training quotes found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-4 bg-white rounded-lg border-t border-gray-200 shadow-sm flex-wrap gap-4 ">
        <TPButton variant="outline" size="sm">
          Previous
        </TPButton>
        <span className="text-xs sm:text-sm text-gray-700">Page 1 of 1</span>
        <TPButton variant="outline" size="sm">
          Next
        </TPButton>
      </div>
    </div>
  );
}
