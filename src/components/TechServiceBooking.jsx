import React, { useState } from "react";

const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded-md ${className}`} {...props}>
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`block font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export default function TechServiceBooking() {
  const [servicePriority, setServicePriority] = useState("medium");

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      {/* White Card Container */}
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8">
        {/* Heading aligned to left */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Booking Form</h1>
        <p className="text-black text-sm mb-8">
          Complete the booking form to complete your booking
        </p>

        <form className="space-y-6">
          {/* Company Name */}
          <FormRow label="Company Name" id="company-name" placeholder="John Doe" />

          {/* Contact Email */}
          <FormRow label="Contact Email" id="contact-email" type="email" placeholder="someone@gmail.com" />

          {/* Phone Number */}
          <FormRow label="Phone Number" id="phone-number" type="tel" placeholder="+1 123 1234567" />

          {/* Service Type */}
          <FormRowSelect
            label="Urgency"
            id="service-type"
            options={[
              { value: "", label: "Select an Option" },
              { value: "consultation", label: "Consultation" },
              { value: "development", label: "Development" },
              { value: "support", label: "Support" }
            ]}
          />

          {/* Service Priority */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6 gap-y-2 md:gap-y-0">
            <Label>Service Priority</Label>
            <div className="flex flex-wrap space-x-2 bg-gray-100 p-1 rounded-md w-full md:w-fit">
              {["low", "medium", "high"].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setServicePriority(priority)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors mb-2 md:mb-0 ${
                    servicePriority === priority
                      ? "bg-[#228B22] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Taxpayer Identification Number */}
          <FormRow label="Taxpayer Identification Number" id="tax-id" placeholder="13212313133312" />

          {/* Full Name */}
          <FormRow label="Full Name" id="full-name" placeholder="John Doe" />

          {/* Permanent Address */}
          <FormRow label="Permanent Address" id="permanent-address" placeholder="123 Street" />

          {/* City */}
          <FormRow label="City" id="city" placeholder="New York" />

          {/* Email */}
          <FormRow label="Email" id="email" type="email" placeholder="johndoe@gmail.com" />

          {/* Type of ID Verification */}
          <FormRowSelect
            label="Type of ID Verification"
            id="id-verification-type"
            options={[
              { value: "", label: "Select an Option" },
              { value: "passport", label: "Passport" },
              { value: "driver-license", label: "Driver's License" },
              { value: "national-id", label: "National ID" }
            ]}
          />

          {/* ID Expiry Date */}
          <FormRow label="ID Expiry Date (if applicable)" id="id-expiry-date" placeholder="MM/DD/YYYY" />

          {/* Upload your ID */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6 gap-y-2 md:gap-y-0">
            <Label htmlFor="upload-id">Upload your ID</Label>
            <Button
              type="button"
              className="bg-[#228B22] hover:bg-green-700 text-white px-4 py-2 w-full md:w-40 rounded-full"
            >
              Upload from Files
            </Button>
          </div>

          {/* I'm not a robot (centered) */}
          <RecaptchaRow />

          {/* Submit Button (centered, rounded) */}
          <div className="mt-8 text-center">
            <Button
              type="submit"
              className="bg-[#228B22] hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg"
            >
              Submit your Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

const FormRow = ({ label, id, type = "text", placeholder }) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6 gap-y-2 md:gap-y-0">
    <Label htmlFor={id} className="text-gray-700">{label}</Label>
    <Input id={id} type={type} placeholder={placeholder} />
  </div>
);

const FormRowSelect = ({ label, id, options }) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6 gap-y-2 md:gap-y-0">
    <Label htmlFor={id}>{label}</Label>
    <select
      id={id}
      className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* Centered reCAPTCHA-style row */
const RecaptchaRow = () => (
  <div className="mt-6 flex flex-col items-center w-full px-4 sm:px-0">
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 border border-gray-300 rounded-md bg-gray-50 px-4 py-3 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <input type="checkbox" id="not-robot" className="w-4 h-4" />
        <Label htmlFor="not-robot" className="m-0 text-base font-normal">I'm not a robot</Label>
      </div>
      <img
        src="/placeholder.svg"
        alt="reCAPTCHA logo"
        width={24}
        height={24}
        className="sm:ml-auto"
      />
    </div>
    <div className="mt-2 text-[10px] text-gray-500 text-center">
      Privacy • Terms
    </div>
  </div>
);
