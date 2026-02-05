import React, { useState } from "react";

export default function CompanyTrainingRequestForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    lookingFor: "",
    numEmployees: "",
    preferredDuration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Custom Training Request Submitted:", formData);
    alert("Request submitted! We'll contact you soon.");
  };

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl w-full space-y-8 p-8 shadow-lg bg-white">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Training Request</h1>
          <p className="mt-2 text-gray-600">
            Complete this training request form so that we can contact you for detailed courses.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                  Company Name:
                </label>
                <p className="text-xs text-gray-500 mt-1">Enter your company name</p>
              </div>
              <input
                id="company-name"
                name="companyName"
                type="text"
                autoComplete="organization"
                placeholder="Urban Company & Co."
                value={formData.companyName}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 shadow-sm bg-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  Phone Number:
                </label>
              </div>
              <input
                id="phone-number"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="+1 232 123 3213"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 shadow-sm bg-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          {/* Looking for? */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="looking-for" className="block text-sm font-medium text-gray-700">
                  Looking for?:
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the Training request you what looking For
                </p>
              </div>
              <textarea
                id="looking-for"
                name="lookingFor"
                rows={3}
                placeholder="Custom ERP request"
                value={formData.lookingFor}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Number of Employees */}
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="sm:w-48 flex-shrink-0">
                  <label htmlFor="num-employees" className="block text-sm font-medium text-gray-700">
                    Number of Employees:
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the total number of employees in the company
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="num-employees"
                    name="numEmployees"
                    type="number"
                    min="1"
                    placeholder="10000000"
                    value={formData.numEmployees}
                    onChange={handleChange}
                    className="w-28 rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">GNF</span>
                </div>
              </div>
            </div>

            {/* Preferred Duration */}
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="sm:w-32 flex-shrink-0">
                  <label htmlFor="preferred-duration" className="block text-sm font-medium text-gray-700">
                    Preferred Duration:
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose the final date by which the work should be completed
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="preferred-duration"
                    name="preferredDuration"
                    type="number"
                    min="1"
                    placeholder="20"
                    value={formData.preferredDuration}
                    onChange={handleChange}
                    className="w-28 rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="py-2 px-8 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Message Freelancer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
