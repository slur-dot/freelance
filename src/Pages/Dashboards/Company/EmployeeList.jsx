import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, Trash2, Pencil, Check, X, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompanyService } from "../../../services/companyService";
import { auth } from "../../../firebaseConfig";

// Reusable Button
function RCButton({ children, variant = "default", size = "md", className = "", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
      : variant === "ghost"
        ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
        : "bg-green-700 text-white hover:bg-green-800";

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

// Table Components
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

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    equipment: "",
    training: ""
  });
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    role: "Employee",
    equipment: "",
    training: ""
  });
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real data from CompanyService
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        const employeesData = await CompanyService.getEmployees(user.uid);

        // Transform the data to match the expected table format
        const transformedEmployees = (employeesData || []).map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email || `${emp.name?.toLowerCase().replace(' ', '.')}@fatoumata-sarl.com`,
          status: emp.status || "Active",
          joiningDate: new Date((emp.createdAt?.seconds ? emp.createdAt.seconds * 1000 : emp.createdAt) || Date.now()).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          role: emp.role || "Employee",
          equipment: emp.equipment || "No equipment assigned",
          training: emp.training || "No training assigned"
        }));

        setEmployees(transformedEmployees);

      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(`Failed to load employees: ${err.message}`);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  const handleEdit = (employee) => {
    setEditId(employee.id);
    setEditForm({ ...employee });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({ name: "", email: "", role: "", equipment: "", training: "" });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await CompanyService.updateEmployee(user.uid, editId, editForm);

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editId ? { ...emp, ...editForm } : emp))
      );
      setEditId(null);
    } catch (err) {
      alert('Failed to update employee: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !window.confirm('Delete this employee?')) return;
    try {
      await CompanyService.deleteEmployee(user.uid, id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    try {
      const newEmployee = await CompanyService.addEmployee(user.uid, createForm);

      setEmployees(prev => [{
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        status: 'Active',
        joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        role: newEmployee.role,
        equipment: newEmployee.equipment || 'No equipment assigned',
        training: newEmployee.training || 'No training assigned'
      }, ...prev]);

      setShowCreate(false);
      setCreateForm({ name: '', email: '', role: 'Employee', equipment: '', training: '' });
    } catch (err) {
      alert(err.message);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-lg text-gray-700">Loading employees...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading employees</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Employee List</h1>
          <RCButton onClick={() => setShowCreate(true)}>
            Add New Employee
          </RCButton>
        </div>

        <RCCard className="p-4 md:p-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <RCInput placeholder="Search" />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <RCTable>
              <RCTableHeader>
                <RCTableRow>
                  <RCTableHead className="min-w-[150px]">
                    <div className="flex items-center gap-1">
                      Employee Name <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </RCTableHead>
                  <RCTableHead className="min-w-[120px]">Role</RCTableHead>
                  <RCTableHead className="min-w-[200px]">Email</RCTableHead>
                  <RCTableHead className="min-w-[150px]">Equipment</RCTableHead>
                  <RCTableHead className="min-w-[150px]">Training</RCTableHead>
                  <RCTableHead className="min-w-[100px]">Status</RCTableHead>
                  <RCTableHead className="min-w-[100px]">Actions</RCTableHead>
                </RCTableRow>
              </RCTableHeader>
              <RCTableBody>
                {employees.map((emp) => (
                  <RCTableRow key={emp.id}>
                    {editId === emp.id ? (
                      <>
                        <RCTableCell>
                          <RCInput name="name" value={editForm.name} onChange={handleChange} />
                        </RCTableCell>
                        <RCTableCell>
                          <RCInput name="role" value={editForm.role} onChange={handleChange} />
                        </RCTableCell>
                        <RCTableCell>
                          <RCInput name="email" value={editForm.email} onChange={handleChange} />
                        </RCTableCell>
                        <RCTableCell>
                          <RCInput name="equipment" value={editForm.equipment} onChange={handleChange} />
                        </RCTableCell>
                        <RCTableCell>
                          <RCInput name="training" value={editForm.training} onChange={handleChange} />
                        </RCTableCell>
                        <RCTableCell>
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full"
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                          </select>
                        </RCTableCell>
                        <RCTableCell>
                          <div className="flex items-center gap-2">
                            <RCButton variant="ghost" size="icon" onClick={handleSave}>
                              <Check className="h-4 w-4 text-green-600" />
                            </RCButton>
                            <RCButton variant="ghost" size="icon" onClick={handleCancel}>
                              <X className="h-4 w-4 text-red-500" />
                            </RCButton>
                          </div>
                        </RCTableCell>
                      </>
                    ) : (
                      <>
                        <RCTableCell className="font-medium">{emp.name}</RCTableCell>
                        <RCTableCell className="text-sm text-gray-600">{emp.role}</RCTableCell>
                        <RCTableCell>{emp.email}</RCTableCell>
                        <RCTableCell className="text-sm text-gray-600">{emp.equipment}</RCTableCell>
                        <RCTableCell className="text-sm text-gray-600">{emp.training}</RCTableCell>
                        <RCTableCell>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${emp.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                                }`}
                            />
                            {emp.status}
                          </span>
                        </RCTableCell>
                        <RCTableCell>
                          <div className="flex items-center gap-2">
                            <RCButton variant="ghost" size="icon" onClick={() => handleEdit(emp)}>
                              <Pencil className="h-4 w-4" />
                            </RCButton>
                            <RCButton variant="ghost" size="icon" onClick={() => handleDelete(emp.id)}>
                              <Trash2 className="h-4 w-4" />
                            </RCButton>
                          </div>
                        </RCTableCell>
                      </>
                    )}
                  </RCTableRow>
                ))}
              </RCTableBody>
            </RCTable>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {employees.map((emp) => (
              <div key={emp.id} className="border rounded-lg p-4 bg-white shadow-sm">
                {editId === emp.id ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <RCInput name="name" value={editForm.name} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <RCInput name="email" value={editForm.email} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Equipment</label>
                      <RCInput name="equipment" value={editForm.equipment} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Training</label>
                      <RCInput name="training" value={editForm.training} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2">
                      <RCButton variant="ghost" size="icon" onClick={handleSave}>
                        <Check className="h-4 w-4 text-green-600" />
                      </RCButton>
                      <RCButton variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4 text-red-500" />
                      </RCButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-gray-600">{emp.email}</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${emp.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                      />
                      {emp.status}
                    </span>
                    <p className="text-sm text-gray-500">{emp.joiningDate}</p>
                    <div className="flex gap-2">
                      <RCButton variant="ghost" size="icon" onClick={() => handleEdit(emp)}>
                        <Pencil className="h-4 w-4" />
                      </RCButton>
                      <RCButton variant="ghost" size="icon" onClick={() => handleDelete(emp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </RCButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 flex-wrap gap-4 border-t border-gray-300">
            <RCButton variant="outline">Previous</RCButton>
            <span className="text-sm text-gray-500">Page 1 of 1</span>
            <RCButton variant="outline">Next</RCButton>
          </div>
        </RCCard>
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                <RCInput
                  placeholder="Enter employee name"
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <RCInput
                  placeholder="Enter email address"
                  value={createForm.email}
                  onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full"
                  value={createForm.role}
                  onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                <RCInput
                  placeholder="Enter equipment assigned"
                  value={createForm.equipment}
                  onChange={e => setCreateForm({ ...createForm, equipment: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training</label>
                <RCInput
                  placeholder="Enter training courses"
                  value={createForm.training}
                  onChange={e => setCreateForm({ ...createForm, training: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <RCButton variant="outline" onClick={() => setShowCreate(false)}>Cancel</RCButton>
              <RCButton onClick={handleCreate}>Create</RCButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
