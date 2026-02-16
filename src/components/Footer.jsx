import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Mail,
  Linkedin,
  Instagram,
  Apple,
  Play,
  Monitor,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FaWhatsapp, FaFlag } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would integrate with your email marketing service (e.g., Mailchimp)
      console.log('Newsletter signup:', email);
      alert('Thank you for subscribing to our newsletter!');
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-800 text-gray-300">
      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center md:text-left">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src={logo}
                alt="Freelance-224 Logo"
                className="w-16 h-16 mr-4 object-contain"
              />
              <h3 className="text-white text-xl font-bold">Freelance</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Freelance-224 connects businesses with talented professionals,
              offering flexible, remote collaboration for projects of all sizes.
            </p>

            {/* App download buttons */}
            <div className="flex justify-center md:justify-start space-x-3">
              {[Apple, Play, Monitor].map((Icon, i) => (
                <div
                  key={i}
                  className="bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "What We Do", href: "/what-we-do" },
                { label: "Our Services", href: "#" },
                { label: "User Strategy", href: "#" },
                { label: "Blog", href: "/blog" },
                { label: "FAQs", href: "/faq" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm flex items-center justify-center md:justify-start transition-colors"
                  >
                    <span className="mr-2">›</span> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Freelance", href: "/about-freelance" },
                { label: "Contact & Support", href: "/contact" },
                { label: "Success Stories", href: "/success-stories" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Join the Guinean Chamber of Commerce", href: "#" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm flex items-center justify-center md:justify-start transition-colors"
                  >
                    <span className="mr-2">›</span> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#15803D]" />
                <span>Conakry, Republic of Guinea</span>
              </li>
              <li>
                <a
                  href="mailto:hello@freelance-224.com"
                  className="hover:text-white flex items-center justify-center md:justify-start gap-2"
                >
                  <Mail className="w-4 h-4 text-[#15803D]" />
                  hello@freelance-224.com
                </a>
              </li>
              <li>
                <a href="tel:+224629653636" className="hover:text-white flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4 text-[#15803D]" />
                  +224 629 65 36 36
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/224629653636"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-center md:justify-start gap-2"
                >
                  <FaWhatsapp className="w-4 h-4 text-[#15803D]" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social Media */}
          <div className="flex flex-col items-center md:items-start lg:items-end space-y-4">
            {/* Newsletter Signup */}
            <div className="w-full">
              <h4 className="text-white font-semibold mb-3 text-base text-center lg:text-right">
                Stay Updated – Join Our Newsletter!
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: FaWhatsapp, href: "https://wa.me/224629653636" }
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.includes("wa.me") ? "_blank" : "_self"}
                  rel={href.includes("wa.me") ? "noopener noreferrer" : undefined}
                  className="bg-white text-slate-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="py-4 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <FaFlag className="w-4 h-4 text-[#15803D]" />
            <span>© 2025</span>
            <span className="text-blue-400 font-semibold">FREELANCE-224</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
