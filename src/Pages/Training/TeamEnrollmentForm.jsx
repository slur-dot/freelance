import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { File, X } from "lucide-react";

export default function TeamEnrollmentForm() {
  const { t } = useTranslation();
  // 'csv' or 'manual'
  const [uploadMethod, setUploadMethod] = useState("csv");

  // Manual mode state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // Default 3 employees (as in your original manual mock)
  const [enrolledEmployees, setEnrolledEmployees] = useState([
    { name: "Some Employee", email: "employee1@example.com" },
    { name: "Some Employee", email: "employee2@example.com" },
    { name: "Some Employee", email: "employee3@example.com" },
  ]);

  // CSV ref & handler
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Uploaded file: ${file.name}`);
      // TODO: parse CSV & populate enrolledEmployees if desired
    }
  };

  // Manual add/remove handlers
  const handleAddEmployee = () => {
    if (!fullName.trim() || !email.trim()) return;
    setEnrolledEmployees((prev) => [...prev, { name: fullName.trim(), email: email.trim() }]);
    setFullName("");
    setEmail("");
  };

  const handleRemoveEmployee = (indexToRemove) => {
    setEnrolledEmployees((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Final submit (works for either mode)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploadMethod === "manual") {
      console.log("Enrolling team (manual):", enrolledEmployees);
    } else {
      console.log("Enrolling team (csv) — see uploaded file above.");
    }
    alert("Team Enrolled! Check console for data.");
    // Optional: clear state
    // setEnrolledEmployees([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* Outer Card */}
      <div className="w-full max-w-2xl bg-white p-8 shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">{t('training.forms.enroll.title')}</h1>
        <p className="text-gray-600 mb-6">
          {t('training.forms.enroll.subtitle')}
        </p>

        {/* Toggle Buttons */}
        <div className="flex space-x-2 mb-6">
          <button
            type="button"
            className={`px-6 py-2 text-sm font-medium transition-colors ${uploadMethod === "csv"
              ? "bg-[#228B22] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setUploadMethod("csv")}
          >
            {t('training.forms.enroll.tab_csv')}
          </button>

          <button
            type="button"
            className={`px-6 py-2 text-sm font-medium transition-colors ${uploadMethod === "manual"
              ? "bg-[#228B22] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setUploadMethod("manual")}
          >
            {t('training.forms.enroll.tab_manual')}
          </button>
        </div>

        {/* CSV MODE -------------------------------------------------- */}
        {uploadMethod === "csv" && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{t('training.forms.enroll.tab_csv')}</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <p className="text-gray-600 md:w-2/5">
                {t('training.forms.enroll.upload_text')}
              </p>
              <div
                onClick={handleUploadClick}
                className="flex-1 w-full md:w-56 h-40 border border-gray-400 bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-center cursor-pointer hover:bg-gray-200 transition"
                style={{ marginLeft: "12px" }} // slight right gap
              >
                <File className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium">{t('training.forms.enroll.tab_csv')}</span>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Submit Button for CSV mode */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="bg-[#228B22] text-white py-2 px-8 rounded-full font-semibold text-base hover:bg-green-700 transition-colors"
              >
                {t('training.forms.enroll.submit')}
              </button>
            </div>
          </div>
        )}

        {/* MANUAL MODE -------------------------------------------------- */}
        {uploadMethod === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="flex items-center">
              <label
                htmlFor="fullName"
                className="w-1/3 text-lg font-medium text-gray-700"
              >
                {t('training.forms.enroll.manual_name')}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder={t('training.forms.enroll.placeholders.name')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#228B22] bg-gray-100"
              />
            </div>

            {/* Email */}
            <div className="flex items-center">
              <label
                htmlFor="email"
                className="w-1/3 text-lg font-medium text-gray-700"
              >
                {t('training.forms.enroll.manual_email')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('training.forms.enroll.placeholders.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#228B22] bg-gray-100"
              />
            </div>



            {/* Enrolled Employees Chips */}
            {enrolledEmployees.length > 0 && (
              <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-3 ml-20">
                  {enrolledEmployees.map((employee, index) => (
                    <div
                      key={index}
                      className="relative flex items-center bg-[#228B22] text-white px-4 py-2 rounded-lg pr-6 text-sm"
                    >
                      <span>{employee.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmployee(index)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-600 transition-colors"
                        aria-label={`Remove ${employee.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button (Manual Mode) */}
            <button
              type="submit"
              className="w-fit mx-auto block bg-[#228B22] text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {t('training.forms.enroll.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
