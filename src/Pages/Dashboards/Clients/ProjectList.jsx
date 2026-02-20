import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Trash2 } from "lucide-react";
import ChatPopup from "../../../components/ChatPopup";
import { ClientService } from "../../../services/clientService";
import { auth } from "../../../firebaseConfig";

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

export default function ProjectList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [chatCourseId, setChatCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const projects = await ClientService.getProjects(user.uid);
          // Map orders to project format
          const mappedProjects = projects.map(p => ({
            id: p.id,
            title: p.items?.[0]?.name || "Project " + p.id.slice(0, 5),
            completion: p.status === 'delivered' ? 100 : 50, // Mock progress based on status
            status: p.status || "Pending",
            lastAccessed: p.updatedAt?.toDate().toLocaleDateString() || "N/A",
            timeRemaining: "N/A"
          }));
          setCourses(mappedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(term));
  }, [searchTerm, courses]);

  const handleOpenChat = (courseId) => setChatCourseId(courseId);
  const handleCloseChat = () => setChatCourseId(null);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('client_dashboard.project_list.title')}</h1>
      </header>

      {/* Search */}
      <div className="relative mb-6 w-full bg-white">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <TPInput
          type="search"
          placeholder={t('client_dashboard.project_list.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search courses"
        />
      </div>

      {/* Table for md+ screens */}
      <div className="hidden md:block flex-1 overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.title')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.completion')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.status')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.milestone')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.time_remaining')}</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">{t('client_dashboard.project_list.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
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
                    <span className="h-2 w-2 bg-green-700 rounded-full mr-2" />
                    {course.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{course.lastAccessed}</td>
                <td className="px-6 py-4 text-gray-500">{course.timeRemaining}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center space-x-2 justify-end">
                    <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </TPButton>
                    <TPButton onClick={() => handleOpenChat(course.id)}>{t('client_dashboard.project_list.buttons.messages')}</TPButton>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">{t('client_dashboard.project_list.table.empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('client_dashboard.project_list.table.milestone')}: {course.lastAccessed}</p>
            <p className="text-sm text-gray-500">{t('client_dashboard.project_list.table.time_remaining')}: {course.timeRemaining}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{course.completion}%</span>
                <div className="relative w-20 h-2 bg-gray-200 rounded-full">
                  <div className="absolute h-full bg-green-700 rounded-full" style={{ width: `${course.completion}%` }} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </TPButton>
                <TPButton size="sm" onClick={() => handleOpenChat(course.id)}>{t('client_dashboard.project_list.buttons.msg')}</TPButton>
              </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 py-6">{t('client_dashboard.project_list.table.empty')}</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2  px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <TPButton variant="outline">{t('client_dashboard.project_list.buttons.previous')}</TPButton>
        <span className="text-sm text-gray-700">{t('client_dashboard.project_list.page_info')}</span>
        <TPButton variant="outline">{t('client_dashboard.project_list.buttons.next')}</TPButton>
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
