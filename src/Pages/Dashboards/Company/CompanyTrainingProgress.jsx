import React, { useState, useMemo, useEffect } from "react";
import { Search, Trash2, Loader2 } from "lucide-react";
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

  // Transform employees data into training courses format
  const courses = useMemo(() => {
    if (!employees.length) return [];

    const trainingCourses = [];

    // Deduplicate employees by name to avoid duplicate training records
    const uniqueEmployees = new Map();
    employees.forEach(employee => {
      if (!uniqueEmployees.has(employee.name)) {
        uniqueEmployees.set(employee.name, employee);
      }
    });

    // Use unique employee data since it contains training information
    Array.from(uniqueEmployees.values()).forEach(employee => {
      if (employee.training && Array.isArray(employee.training)) {
        employee.training.forEach(training => {
          trainingCourses.push({
            id: `${training.courseName}-${employee.name}`,
            employee: employee.name,
            title: training.courseName,
            completion: training.progress,
            status: training.progress >= 100 ? "Completed" : "Active",
            employeeId: employee.id
          });
        });
      }
    });

    // Only use data from API - no fallback data

    return trainingCourses;
  }, [employees, companyStats]);

  const handleDelete = (id) => {
    // In a real app, this would make an API call to delete the training record
    console.log('Delete training record:', id);
    alert('Delete functionality will be implemented with API integration');
  };

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(term) || c.employee.toLowerCase().includes(term));
  }, [searchTerm, courses]);

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
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('company_dashboard.tp_col_course')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('company_dashboard.tp_col_completion')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('company_dashboard.tp_col_status')}</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">{t('company_dashboard.tp_col_action')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{course.employee}</td>
                <td className="px-6 py-4 text-gray-700">{course.title}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>{course.completion}%</span>
                    <div className="relative w-24 h-2 bg-gray-200 rounded-full">
                      <div className="absolute h-full bg-green-700 rounded-full" style={{ width: `${course.completion}%` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-green-700 rounded-full shadow" style={{ left: `calc(${course.completion}% - 8px)` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center bg-green-100 rounded-full p-1">
                    <span className="ml-4 h-2 w-2 bg-green-700 rounded-full mr-2" />
                    {course.status === 'Completed' ? t('company_dashboard.tp_status_completed') : t('company_dashboard.tp_status_active')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center space-x-2 justify-end">
                    <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </TPButton>
                    <TPButton onClick={() => handleOpenChat(course.id)}>{t('company_dashboard.tp_message')}</TPButton>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">{t('company_dashboard.tp_no_records')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900">{course.employee}</h3>
              <p className="text-gray-600 text-sm">{course.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">{course.completion}% Complete</span>
                <div className="relative w-20 h-2 bg-gray-200 rounded-full">
                  <div className="absolute h-full bg-green-700 rounded-full" style={{ width: `${course.completion}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">{course.status}</span>
                <div className="flex space-x-2">
                  <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </TPButton>
                  <TPButton size="sm" onClick={() => handleOpenChat(course.id)}>Message</TPButton>
                </div>
              </div>
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
          courseTitle={courses.find(c => c.id === chatCourseId)?.title}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}
