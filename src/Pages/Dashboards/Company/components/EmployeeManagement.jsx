import React from "react";
import { useNavigate } from "react-router-dom";

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}
function Button({ children, className = "", variant = "default", ...props }) {
  const baseStyles = variant === 'outline' ? 'border border-gray-300 text-gray-500 bg-transparent hover:bg-gray-100' : 'bg-green-600 hover:bg-green-700 text-white';
  return <button className={`px-4 py-2 rounded-md text-sm font-medium transition ${baseStyles} ${className}`} {...props}>{children}</button>;
}

export default function EmployeeManagement({ employees }) {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/company/dashboard/emplolyee-list');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Employee Management</h3>
        <Button onClick={handleAddEmployee} className="text-sm">Add Employee</Button>
      </div>
      {employees && employees.length > 0 ? (
        <div className="space-y-3">
          {employees.map((employee, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-600">{employee.role}</p>
                {employee.assignedDevice && (<p className="text-xs text-blue-600">Device: {employee.assignedDevice}</p>)}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{employee.email}</p>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{employee.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No employees found</p>
          <p className="text-sm">Add your first employee to get started</p>
        </div>
      )}
    </Card>
  );
}


