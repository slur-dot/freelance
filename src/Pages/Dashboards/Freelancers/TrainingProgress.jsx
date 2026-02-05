import React, { useState, useMemo, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import ChatPopup from "../../../components/ChatPopup";
import { auth } from "../../../firebaseConfig";

// Button
function TPButton({ children, className = "", variant = "default", size = "md", disabled, ...props }) {
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

import { FreelancerService } from "../../../services/freelancerService";

export default function TrainingProgress() {
  const [user, setUser] = useState(auth.currentUser);
  const FREELANCER_ID = user?.uid;

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatCourseId, setChatCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!FREELANCER_ID) {
      if (!auth.currentUser) setLoading(false);
      return;
    }
    let isMounted = true;

    async function fetchStats() {
      try {
        setLoading(true);
        // Use FreelancerService instead of fetch
        const response = await FreelancerService.getTrainingProgress(FREELANCER_ID);

        const list = response.data?.trainingProgress?.courses || [];

        const mapped = list.map((c) => ({
          id: c.id,
          title: c.title,
          completion: c.progress || c.completion || 0,
          status: c.status === 'completed' ? 'Completed' : c.status === 'in_progress' ? 'Active' : 'Not started',
          // Handle Firestore Timestamp or Date or string
          lastAccessed: c.lastAccessed
            ? (c.lastAccessed.seconds
              ? new Date(c.lastAccessed.seconds * 1000).toLocaleDateString()
              : new Date(c.lastAccessed).toLocaleDateString())
            : "-",
          timeRemaining: (() => {
            if (c.status === 'completed') return 'Done';
            // Handle Firestore Timestamp
            const end = c.expectedCompletion
              ? (c.expectedCompletion.seconds
                ? new Date(c.expectedCompletion.seconds * 1000)
                : new Date(c.expectedCompletion))
              : null;

            if (!end) return '';
            const diffDays = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            return `by ${end.toLocaleDateString()} (${diffDays} days)`;
          })()
        }));

        if (isMounted) setCourses(mapped);
      } catch (e) {
        if (isMounted) {
          console.error("Error loading training:", e);
          setError("Failed to load training progress");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();
    return () => { isMounted = false; };
  }, [FREELANCER_ID]);

  const handleDelete = (id) => setCourses((prev) => prev.filter((c) => c.id !== id));
  const handleOpenChat = (courseId) => setChatCourseId(courseId);
  const handleCloseChat = () => setChatCourseId(null);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(term));
  }, [searchTerm, courses]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Training Progress</h1>
      </header>

      {/* Search */}
      <div className="relative mb-6 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <TPInput
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search courses"
        />
      </div>

      {/* Table - Large screens */}
      <div className="hidden xl:block flex-1 overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        {loading && <div className="p-4">Loading...</div>}
        {error && !loading && <div className="p-4 text-red-600">{error}</div>}
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Completion</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Time Remaining</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center bg-green-100 rounded-full p-1">
                    <span className="h-2 w-2 rounded-full bg-green-700 mr-2" />
                    {course.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{course.lastAccessed}</td>
                <td className="px-6 py-4 text-gray-500">{course.timeRemaining}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex space-x-2 justify-end">
                    <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </TPButton>
                    <TPButton onClick={() => handleOpenChat(course.id)}>Continue</TPButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table - Medium screens (hide Last Accessed & Time Remaining) */}
      <div className="hidden md:block xl:hidden flex-1 overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Completion</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-4 font-medium text-gray-900">{course.title}</td>
                <td className="px-4 py-4 text-gray-500">{course.completion}%</td>
                <td className="px-4 py-4 text-gray-500">{course.status}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex space-x-2 justify-end">
                    <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </TPButton>
                    <TPButton onClick={() => handleOpenChat(course.id)}>Continue</TPButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-semibold text-gray-800 mb-2">{course.title}</h2>
            <p className="text-sm text-gray-600 mb-1">Completion: {course.completion}%</p>
            <p className="text-sm text-gray-600 mb-1">Status: {course.status}</p>
            <p className="text-sm text-gray-600 mb-1">Last Accessed: {course.lastAccessed}</p>
            <p className="text-sm text-gray-600 mb-3">Time Remaining: {course.timeRemaining}</p>
            <div className="flex space-x-2">
              <TPButton variant="outline" size="icon" onClick={() => handleDelete(course.id)}>
                <Trash2 className="h-4 w-4 text-gray-500" />
              </TPButton>
              <TPButton onClick={() => handleOpenChat(course.id)}>Continue</TPButton>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <TPButton variant="outline">Previous</TPButton>
        <span className="text-sm text-gray-700">Page 1 of 10</span>
        <TPButton variant="outline">Next</TPButton>
      </div>

      {/* Chat Popup */}
      {chatCourseId !== null && (
        <ChatPopup
          courseId={chatCourseId}
          courseTitle={courses.find((c) => c.id === chatCourseId)?.title}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}
