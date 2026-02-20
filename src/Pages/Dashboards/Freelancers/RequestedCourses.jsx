import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowUpDown, Trash2, Pencil } from "lucide-react";
import { auth } from "../../../firebaseConfig";


function RCButton({ children, variant = "default", size = "md", className = "", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
      : variant === "ghost"
        ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
        : "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50";

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
      : "px-4 py-2 rounded-md text-sm font-medium";

  return (
    <button className={`${base} ${sizeCls} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Simple Input
function RCInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full  ${className}`}
      {...props}
    />
  );
}

// Simple Card
function RCCard({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

// Simple Table Components
function RCTable({ children }) {
  return <table className="min-w-full text-sm text-left divide-y divide-gray-200">{children}</table>;
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
  return <th className={`px-6 py-3 font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}
function RCTableCell({ children, className = "" }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}

import { FreelancerService } from "../../../services/freelancerService";

// ... (existing imports)

export default function RequestedCourses() {
  const { t } = useTranslation();
  const [user, setUser] = useState(auth.currentUser);
  const FREELANCER_ID = user?.uid;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', title: '', price: 0, status: 'pending' });

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

    async function fetchRequested() {
      try {
        setLoading(true);
        const list = await FreelancerService.getRequestedCourses(FREELANCER_ID);

        const mapped = list.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category || c.title, // Fallback if category missing
          // Keep raw fields to persist back
          rawStatus: c.status || 'pending',
          price: typeof c.price === 'number' ? c.price : 0,
          requestedAtSeconds: c.requestDate?.seconds ?? null,
          status: (c.status || 'pending').toLowerCase() === 'confirmed' ? t('requested_courses_page.modals.edit.status_options.approved') || 'Approved' : t('requested_courses_page.modals.edit.status_options.under_review') || 'Under Review',
          requestDate: c.requestDate ? new Date(c.requestDate.seconds ? c.requestDate.seconds * 1000 : c.requestDate).toLocaleDateString() : '-'
        }));
        if (isMounted) setCourses(mapped);
      } catch (e) {
        if (isMounted) setError("Failed to load requested courses");
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRequested();
    return () => { isMounted = false; };
  }, [FREELANCER_ID]);

  // Note: persistCourses is replaced by direct service calls

  const handleDelete = async (id) => {
    try {
      await FreelancerService.deleteRequestedCourse(FREELANCER_ID, id);
      setCourses(prev => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError('Failed to delete course');
      console.error(e);
    }
  };

  const handleEdit = (id) => {
    const c = courses.find((x) => x.id === id);
    if (!c) return;
    setEditForm({ id: c.id, title: c.title, price: c.price || 0, status: (c.rawStatus || 'pending') });
    setEditOpen(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('requested_courses_page.title')}</h1>
      <RCCard className="p-4 md:p-6">
        {loading && <div className="mb-4">{t('requested_courses_page.loading') || 'Loading...'}</div>}
        {error && !loading && <div className="mb-4 text-red-600">{error}</div>}
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput placeholder={t('requested_courses_page.search_placeholder')} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead className="min-w-[150px]">
                  <div className="flex items-center gap-1">
                    {t('requested_courses_page.table.course_title')} <ArrowUpDown className="h-4 w-4" />
                  </div>
                </RCTableHead>
                <RCTableHead className="min-w-[120px]">{t('requested_courses_page.table.category')}</RCTableHead>
                <RCTableHead className="min-w-[100px]">{t('requested_courses_page.table.status')}</RCTableHead>
                <RCTableHead className="min-w-[120px]">{t('requested_courses_page.table.request_date')}</RCTableHead>
                <RCTableHead className="min-w-[100px]">{t('requested_courses_page.table.actions')}</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {courses.map((course) => (
                <RCTableRow key={course.id}>
                  <RCTableCell className="font-medium">{course.title}</RCTableCell>
                  <RCTableCell>{course.category}</RCTableCell>
                  <RCTableCell>
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${(course.status === "Approved" || course.status === t('requested_courses_page.modals.edit.status_options.approved'))
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${(course.status === "Approved" || course.status === t('requested_courses_page.modals.edit.status_options.approved')) ? "bg-green-500" : "bg-orange-500"
                          }`}
                      />
                      {course.status}
                    </div>
                  </RCTableCell>
                  <RCTableCell>{course.requestDate}</RCTableCell>
                  <RCTableCell>
                    <div className="flex items-center gap-2">
                      <RCButton variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </RCButton>
                      <RCButton variant="ghost" size="icon" onClick={() => handleEdit(course.id)}>
                        <Pencil className="h-4 w-4" />
                      </RCButton>
                    </div>
                  </RCTableCell>
                </RCTableRow>
              ))}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
          <RCButton variant="outline">{t('requested_courses_page.pagination.previous')}</RCButton>
          <span className="text-sm text-gray-500">{t('requested_courses_page.pagination.page_info', { current: 1, total: 10 })}</span>
          <RCButton>{t('requested_courses_page.pagination.next')}</RCButton>
        </div>
      </RCCard>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">{t('requested_courses_page.modals.edit.title')}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">{t('requested_courses_page.modals.edit.course_title')}</label>
                <input
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('requested_courses_page.modals.edit.price')}</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('requested_courses_page.modals.edit.status')}</label>
                <select
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="pending">{t('requested_courses_page.modals.edit.status_options.pending') || 'Pending'}</option>
                  <option value="confirmed">{t('requested_courses_page.modals.edit.status_options.confirmed') || 'Confirmed'}</option>
                  <option value="rejected">{t('requested_courses_page.modals.edit.status_options.rejected') || 'Rejected'}</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <RCButton variant="outline" onClick={() => setEditOpen(false)}>{t('requested_courses_page.modals.edit.cancel')}</RCButton>
              <RCButton
                onClick={async () => {
                  try {
                    const updatedData = {
                      title: editForm.title,
                      category: editForm.title, // or strict category field
                      price: editForm.price,
                      status: editForm.status
                    };

                    await FreelancerService.updateRequestedCourse(FREELANCER_ID, editForm.id, updatedData);

                    const next = courses.map((c) => c.id === editForm.id
                      ? {
                        ...c,
                        ...updatedData,
                        rawStatus: editForm.status,
                        status: editForm.status === 'confirmed' ? (t('requested_courses_page.modals.edit.status_options.approved') || 'Approved') : (t('requested_courses_page.modals.edit.status_options.under_review') || 'Under Review')
                      }
                      : c
                    );
                    setCourses(next);
                    setEditOpen(false);
                  } catch (e) {
                    setError('Failed to save changes');
                    console.error(e);
                  }
                }}
              >
                {t('requested_courses_page.modals.edit.save')}
              </RCButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}