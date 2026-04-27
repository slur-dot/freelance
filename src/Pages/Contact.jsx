import React, { useState } from "react";
import { Send, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Plus, AlertCircle, Calendar, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import LiveChatWidget from "../components/Support/LiveChatWidget";
import SupportTickets from "../components/Support/SupportTickets";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("contact");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [callDetails, setCallDetails] = useState({
    name: "",
    email: "",
    company: "",
    purpose: ""
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      <header className="max-w-7xl mx-auto px-2 py-4 text-sm text-gray-600">
        <nav>
          <a href="#" className="hover:underline">
            {t('contact.home_breadcrumb')}
          </a>{" "}
          {">"}{" "}
          <a href="#" className="text-blue-400 hover:underline">
            {t('contact.contact_breadcrumb')}
          </a>
        </nav>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("contact")}
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === "contact"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {t('contact.contact_form_tab')}
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === "support"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {t('contact.support_tickets_tab')}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "contact" && (
          <div className="border border-gray-300 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Form Section */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{t('contact.title')}</h1>
                    <p className="text-gray-600">{t('contact.subtitle')}</p>
                  </div>
                </div>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">
                        {t('contact.full_name')}
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">
                        {t('contact.company_name')}
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        placeholder="Supreme Workers and Co."
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">
                      Job Title / Position
                    </label>
                    <select
                      id="jobTitle"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 appearance-none pr-8"
                    >
                      <option value="">Select an Option</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="123 Street"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="123@gmail.com"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 sm:w-32 flex-shrink-0 sm:mt-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      placeholder="Write your message here"
                      className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md bg-gray-100"
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-4 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        // Trigger the existing LiveChatWidget to open
                        const chatButton = document.querySelector('[data-chat-trigger]');
                        if (chatButton) {
                          chatButton.click();
                        }
                      }}
                      className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full transition-colors duration-200"
                    >
                      Message Us Now
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCalendar(true)}
                      className="w-fit px-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-full transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <Calendar className="w-5 h-5" />
                      Schedule a Call
                    </button>
                  </div>
                </form>

                {/* Google Map Section - Conakry */}
                <section className="mt-8 w-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{t('contact.our_location')}</h3>
                    </div>
                    <iframe
                      className="w-full h-64 rounded-lg shadow-md"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.123456789!2d-13.6667!3d9.5500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzMnMDAuMCJOIDEzwrA0MCcwMC4wIlc!5e0!3m2!1sen!2sgn!4v1234567890123!5m2!1sen!2sgn"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Conakry Location Map"
                    ></iframe>
                    <p className="text-sm text-gray-600">{t('contact.location_details')}</p>
                  </div>
                </section>
              </section>

              {/* Chat Section */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold">{t('contact.chat_with_us')}</h2>
                <div className="bg-gray-100 border border-gray-300 rounded-xl shadow-lg p-8">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <MessageCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-800">{t('contact.need_instant_help')}</h3>
                      <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                        {t('contact.support_team_desc')}
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-300">
                      <div className="flex items-center justify-center gap-3 text-sm font-medium text-gray-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>{t('contact.support_online')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-semibold">{t('contact.response_time')}</span>
                          <span>{t('contact.approx_time')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-semibold">{t('contact.available')}</span>
                          <span>{t('contact.available_24_7')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          // Trigger the existing LiveChatWidget to open
                          const chatButton = document.querySelector('[data-chat-trigger]');
                          if (chatButton) {
                            chatButton.click();
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <MessageCircle className="w-6 h-6" />
                        {t('contact.start_live_chat')}
                      </button>

                      <p className="text-xs text-gray-500">
                        {t('contact.no_registration')}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Social Media Icons */}
            <footer className="mt-8 lg:mt-12 flex justify-start pl-4 text-gray-600 gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="bg-[#E6E6FA] p-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="bg-[#E6E6FA] p-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="bg-[#E6E6FA] p-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="bg-[#E6E6FA] p-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </footer>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === "support" && (
          <div className="border border-gray-300 rounded-lg">
            <SupportTickets />
          </div>
        )}
      </main>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <FaWhatsapp className="w-6 h-6 text-white" />
      </a>

      {/* Live Chat Widget */}
      <LiveChatWidget />

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('contact.schedule_call')}</h2>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                {/* Personal Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.full_name')} *
                  </label>
                  <input
                    type="text"
                    value={callDetails.name}
                    onChange={(e) => setCallDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.email_address')} *
                  </label>
                  <input
                    type="email"
                    value={callDetails.email}
                    onChange={(e) => setCallDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.company_name')}
                  </label>
                  <input
                    type="text"
                    value={callDetails.company}
                    onChange={(e) => setCallDetails(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.select_purpose')}
                  </label>
                  <select
                    value={callDetails.purpose}
                    onChange={(e) => setCallDetails(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('contact.select_purpose')}</option>
                    <option value="business_inquiry">{t('contact.business_inquiry')}</option>
                    <option value="partnership">{t('contact.partnership')}</option>
                    <option value="consultation">{t('contact.consultation')}</option>
                    <option value="support">{t('contact.technical_support')}</option>
                    <option value="other">{t('contact.other')}</option>
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.preferred_date')}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.preferred_time')}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('contact.select_time')}</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('contact.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!callDetails.name || !callDetails.email || !selectedDate || !selectedTime) {
                        alert(t('contact.fill_required'));
                        return;
                      }

                      // Here you would typically send the data to your backend
                      console.log('Call scheduled:', { callDetails, selectedDate, selectedTime });
                      alert(t('contact.call_scheduled_success'));

                      // Reset form and close modal
                      setCallDetails({ name: "", email: "", company: "", purpose: "" });
                      setSelectedDate("");
                      setSelectedTime("");
                      setShowCalendar(false);
                    }}
                    className="flex-1 px-4 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-colors font-medium"
                  >
                    {t('contact.schedule_call')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
