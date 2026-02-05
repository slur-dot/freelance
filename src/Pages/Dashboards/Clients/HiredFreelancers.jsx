import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { ClientService } from "../../../services/clientService";
import { auth } from "../../../firebaseConfig";

// Reusable components
function RCButton({ children, variant = "default", size = "md", className = "", ...props }) {
  const base =
    variant === "outline"
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

function RCInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full ${className}`}
      {...props}
    />
  );
}

function RCCard({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

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

export default function HiredFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const hired = await ClientService.getHiredFreelancers(user.uid);
          setFreelancers(hired);
        } catch (error) {
          console.error("Error fetching hired freelancers:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireForm, setHireForm] = useState({
    name: "",
    project: "",
    status: "In progress",
    completionDate: "",
    amount: ""
  });

  const openHire = () => setShowHireModal(true);
  const closeHire = () => setShowHireModal(false);

  const handleHireSubmit = (e) => {
    e.preventDefault();
    // Frontend-only add (no Firestore write as requested)
    const newFreelancer = {
      id: Date.now(),
      name: hireForm.name || "Unnamed",
      project: hireForm.project || "New Project",
      status: hireForm.status || "In progress",
      completionDate: hireForm.completionDate || new Date().toLocaleDateString(),
      amount: hireForm.amount || "0 GNF"
    };
    setFreelancers((prev) => [newFreelancer, ...prev]);
    setHireForm({ name: "", project: "", status: "In progress", completionDate: "", amount: "" });
    closeHire();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Hired Freelancers</h1>
        <button onClick={openHire} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full md:w-auto">
          Hire New Freelancer
        </button>
      </div>

      <RCCard className="p-4 md:p-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput placeholder="Search freelancer or project..." />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead className="min-w-[160px]">
                  <div className="flex items-center gap-1">
                    Freelancer Name <ArrowUpDown className="h-4 w-4" />
                  </div>
                </RCTableHead>
                <RCTableHead className="min-w-[160px]">Project</RCTableHead>
                <RCTableHead className="min-w-[120px]">Status</RCTableHead>
                <RCTableHead className="min-w-[140px]">Completion Date</RCTableHead>
                <RCTableHead className="min-w-[100px]">Amount</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {freelancers.map((freelancer) => (
                <RCTableRow key={freelancer.id}>
                  <RCTableCell className="font-medium">{freelancer.name}</RCTableCell>
                  <RCTableCell>{freelancer.project}</RCTableCell>
                  <RCTableCell>
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${freelancer.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${freelancer.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                      />
                      {freelancer.status}
                    </div>
                  </RCTableCell>
                  <RCTableCell>{freelancer.completionDate}</RCTableCell>
                  <RCTableCell>{freelancer.amount}</RCTableCell>
                </RCTableRow>
              ))}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-medium text-gray-900">{freelancer.name}</div>
              <div className="text-gray-600 text-sm">{freelancer.project}</div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${freelancer.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${freelancer.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                  />
                  {freelancer.status}
                </span>
                <span className="text-sm text-gray-500">{freelancer.amount}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Completion: {freelancer.completionDate}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <RCButton variant="outline" className="w-full sm:w-auto">Previous</RCButton>
          <span className="text-sm text-gray-500">Page 1 of 1</span>
          <RCButton className="w-full sm:w-auto">Next</RCButton>
        </div>
      </RCCard>

      {showHireModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Hire Freelancer</h3>
            </div>
            <form onSubmit={handleHireSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Freelancer Name</label>
                <input
                  value={hireForm.name}
                  onChange={(e) => setHireForm({ ...hireForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Project</label>
                <input
                  value={hireForm.project}
                  onChange={(e) => setHireForm({ ...hireForm, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter project"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    value={hireForm.status}
                    onChange={(e) => setHireForm({ ...hireForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>In progress</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Completion Date</label>
                  <input
                    type="text"
                    value={hireForm.completionDate}
                    onChange={(e) => setHireForm({ ...hireForm, completionDate: e.target.value })}
                    placeholder="e.g., 25 May 2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount (GNF)</label>
                <input
                  type="text"
                  value={hireForm.amount}
                  onChange={(e) => setHireForm({ ...hireForm, amount: e.target.value })}
                  placeholder="e.g., 1760 GNF"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Hire</button>
                <button type="button" onClick={closeHire} className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">Cancel</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Note: This action updates UI only and does not write to Firestore.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
