import React, { useState, useMemo, useEffect } from "react";
import { Search, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ChatPopup from "../../../components/ChatPopup";
import { CompanyService } from "../../../services/companyService";
import { auth } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

// Button
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
        : "bg-green-700 hover:bg-green-900 text-white";

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
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

export default function TrainingProgress() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [chatCourseId, setChatCourseId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real data from API with retry mechanism
  useEffect(() => {
    if (!user) {
      if (!loading && !user) setLoading(false); // Stop loading if no user
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const companyId = user.uid;

        // Fetch employees and company stats from API
        const [employeesData, statsData] = await Promise.all([
          CompanyService.getEmployees(companyId),
          CompanyService.getDashboardData(companyId)
        ]);

        setEmployees(employeesData || []);
        // statsData.stats contains gamification
        setCompanyStats(statsData.stats || null);

      } catch (err) {
        console.error('Error fetching training data:', err);
        setError(`Failed to load training data: ${err.message}`);
        setEmployees([]);
        setCompanyStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const [expandedUsers, setExpandedUsers] = useState({});

  // Transform employees data into training courses format
  const groupedEmployees = useMemo(() => {
    if (!employees.length) return [];

    const uniqueEmployees = new Map();
    employees.forEach(employee => {
      if (!uniqueEmployees.has(employee.name) && employee.training && Array.isArray(employee.training) && employee.training.length > 0) {
        uniqueEmployees.set(employee.name, employee);
      }
    });

    return Array.from(uniqueEmployees.values()).map(employee => {
      return {
        id: employee.id || Math.random().toString(),
        name: employee.name,
        courses: employee.training.map((t, idx) => ({
          id: `${t.courseName}-${employee.id}-${idx}`,
          title: t.courseName,
          completion: t.progress || 0,
          status: t.progress >= 100 ? "Completed" : t.progress > 0 ? "In Progress" : "Accepted",
          deliveryMode: t.deliveryMode || (Math.random() > 0.5 ? "Remote" : "On-site")
        }))
      };
    });
  }, [employees, companyStats]);

  const handleDelete = (id) => {
    // In a real app, this would make an API call to delete the training record
    console.log('Delete training record:', id);
    alert('Delete functionality will be implemented with API integration');
  };

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return groupedEmployees;
    return groupedEmployees.filter((e) => e.name.toLowerCase().includes(term) || e.courses.some(c => c.title.toLowerCase().includes(term)));
  }, [searchTerm, groupedEmployees]);

  const toggleUser = (id) => {
    setExpandedUsers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenChat = (courseId) => {
    setChatCourseId(courseId);
  };

  const handleCloseChat = () => {
    setChatCourseId(null);
  };

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-lg text-gray-700">{t('company_dashboard.tp_loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">{t('company_dashboard.tp_error')}</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            {t('company_dashboard.tp_retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('company_dashboard.tp_title')}</h1>
      </header>

      {/* Search */}
      <div className="relative mb-6 w-full bg-white">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <TPInput
          type="search"
          placeholder={t('company_dashboard.tp_search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table / Cards */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('company_dashboard.tp_col_name')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Assigned Courses</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
              <React.Fragment key={emp.id}>
                <tr className="cursor-pointer hover:bg-gray-50" onClick={() => toggleUser(emp.id)}>
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.courses.length} courses</td>
                  <td className="px-6 py-4 text-right text-blue-600 flex justify-end items-center gap-1">
                    {expandedUsers[emp.id] ? "Hide Details" : "View Details"}
                    {expandedUsers[emp.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </td>
                </tr>
                {expandedUsers[emp.id] && (
                  <tr>
                    <td colSpan={3} className="px-0 py-0 bg-gray-50">
                      <div className="p-4 pl-12 border-l-4 border-blue-500">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="pb-2 text-left text-gray-500 font-medium">Course</th>
                              <th className="pb-2 text-left text-gray-500 font-medium">Delivery Mode</th>
                              <th className="pb-2 text-left text-gray-500 font-medium">Status</th>
                              <th className="pb-2 text-left text-gray-500 font-medium">Progress</th>
                              <th className="pb-2 text-right text-gray-500 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emp.courses.map(course => (
                              <tr key={course.id} className="border-t border-gray-200">
                                <td className="py-3 text-gray-900 font-medium">{course.title}</td>
                                <td className="py-3 text-gray-600">{course.deliveryMode}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    course.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    course.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {course.status}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-500 w-8">{course.completion}%</span>
                                    <div className="relative w-24 h-2 bg-gray-200 rounded-full">
                                      <div className="absolute h-full bg-green-700 rounded-full" style={{ width: `${course.completion}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="flex items-center space-x-2 justify-end">
                                    <TPButton variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}>
                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                    </TPButton>
                                    <TPButton size="sm" onClick={(e) => { e.stopPropagation(); handleOpenChat(course.id); }}>{t('company_dashboard.tp_message')}</TPButton>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">{t('company_dashboard.tp_no_records')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleUser(emp.id)}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                  <p className="text-gray-500 text-sm">{emp.courses.length} Assigned Courses</p>
                </div>
                <div className="text-blue-600">
                  {expandedUsers[emp.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {expandedUsers[emp.id] && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  {emp.courses.map((course) => (
                    <div key={course.id} className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium text-gray-800 text-sm">{course.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{course.deliveryMode}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{course.completion}% Complete</span>
                        <div className="relative w-20 h-2 bg-gray-200 rounded-full">
                          <div className="absolute h-full bg-green-700 rounded-full" style={{ width: `${course.completion}%` }} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`flex items-center text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${
                          course.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          course.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                        <div className="flex space-x-2">
                          <TPButton variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </TPButton>
                          <TPButton size="sm" onClick={(e) => { e.stopPropagation(); handleOpenChat(course.id); }}>Message</TPButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No records found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3  px-4 py-3 bg-white rounded-md border border-gray-200 shadow-sm">
        <TPButton variant="outline" className="w-full sm:w-auto">Previous</TPButton>
        <span className="text-sm text-gray-700">Page 1 of 1</span>
        <TPButton variant="outline" className="w-full sm:w-auto">Next</TPButton>
      </div>

      {/* Chat Popup */}
      {chatCourseId !== null && (
        <ChatPopup
          courseId={chatCourseId}
          courseTitle={groupedEmployees.flatMap(e => e.courses).find(c => c.id === chatCourseId)?.title}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}
