import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function TechServicesSolutions() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-16 mx-2 sm:mx-4 md:mx-8 lg:mx-16">
      {/* Breadcrumbs */}
      <div className="container mx-auto mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm text-gray-500">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <Link to="/tech-services" className="text-blue-500 hover:underline">
          Tech Services
        </Link>
      </div>

      {/* Main Heading */}
      <div className="container mx-auto mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug sm:leading-tight">
          Comprehensive Tech Solutions for Guinean Businesses, NGOs, Companies & Organizations
        </h1>
      </div>

      {/* Sections */}
      <ServiceSection
        title="ERP/SAP Solutions"
        description="Implement, optimize, and customize SAP/ERP systems for industries like mining, agriculture, and tech."
        buttonText="Book ERP Service"
        cards={[
          {
            title: "SAP Implementation",
            description: "Full setup and integration for your business processes.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">SAP Implementation – Full Setup and Integration for Your Business Processes in Guinea</p>
                <p>
                  At Freelance-224, we provide end-to-end SAP implementation services tailored to businesses in Guinea.
                  We help streamline operations, improve efficiency, and deliver real-time visibility through a single
                  integrated system.
                </p>
                <p className="font-semibold">Our SAP services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Business Process Analysis & Consulting</span> – Study finance, HR, sales, supply chain, logistics, and align with best practices.
                  </li>
                  <li>
                    <span className="font-medium">Full SAP Setup</span> – Installation, configuration, and module selection (FI, MM, SD, HR, etc.) to match your size and sector.
                  </li>
                  <li>
                    <span className="font-medium">Data Migration & Integration</span> – Secure transfer of existing data and connection with CRM, e‑commerce, and cloud services.
                  </li>
                  <li>
                    <span className="font-medium">Customization & Localization</span> – Adapt SAP to the Guinean environment, including local tax and regulatory compliance.
                  </li>
                  <li>
                    <span className="font-medium">Training & Change Management</span> – On‑site or remote training to empower staff to fully leverage SAP.
                  </li>
                  <li>
                    <span className="font-medium">Ongoing Support & Maintenance</span> – Continuous monitoring, updates, and troubleshooting.
                  </li>
                </ul>
                <p className="font-semibold">Why SAP for Guinea?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Centralizes all business operations into one platform.</li>
                  <li>Reduces manual processes and errors.</li>
                  <li>Provides clear reporting for better decisions.</li>
                  <li>Helps businesses compete regionally and internationally.</li>
                  <li>Adapts to SMEs and large corporations in Guinea.</li>
                </ul>
                <p>
                  With full SAP integration, your company can move from fragmented tools and manual processes to a modern
                  digital ERP system that supports growth and competitiveness in the Guinean market.
                </p>
              </div>
            ),
          },
          {
            title: "ERP Optimization",
            description: "Fine-tune ERP performance and efficiency.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">ERP Optimization – Full Setup and Integration for Your Business Processes</p>
                <p>
                  At Freelance-224, we specialize in ERP optimization, helping businesses in Guinea move from manual
                  processes and scattered tools to an integrated system that streamlines operations across departments.
                </p>
                <p className="font-semibold">Our ERP services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Process Analysis & Consulting</span> – Map finance, HR, logistics, inventory, sales, and supply chain.
                  </li>
                  <li>
                    <span className="font-medium">ERP Selection & Setup</span> – Choose and implement the right ERP for your size, industry, and budget.
                  </li>
                </ul>
                <div>
                  <p className="font-medium">We work with many ERP platforms:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>SAP – Robust for medium/large enterprises.</li>
                    <li>Oracle NetSuite – Cloud ERP for finance and global ops.</li>
                    <li>Microsoft Dynamics 365 – Flexible, integrates with Microsoft tools.</li>
                    <li>Odoo – Open‑source, cost‑effective for SMEs in Guinea.</li>
                    <li>Zoho ERP / Zoho One – Affordable cloud ERP with CRM/HR/finance.</li>
                    <li>Tally ERP – Popular for accounting/finance management.</li>
                    <li>QuickBooks Enterprise – For SMEs focused on accounting.</li>
                    <li>Infor ERP – Strong in manufacturing and logistics.</li>
                    <li>ERPNext – Open‑source tailored for SMBs.</li>
                    <li>Custom ERP Solutions – When off‑the‑shelf does not fit.</li>
                  </ul>
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Data Migration & Integration</span> – Import history and connect ERP to e‑commerce, CRM, POS, cloud.
                  </li>
                  <li>
                    <span className="font-medium">Customization & Localization</span> – Configure for Guinean tax, accounting, and legal needs.
                  </li>
                  <li>
                    <span className="font-medium">User Training & Adoption</span> – Enable teams to use ERP effectively.
                  </li>
                  <li>
                    <span className="font-medium">Continuous Support & Optimization</span> – Updates, troubleshooting, and scaling as you grow.
                  </li>
                </ul>
                <p className="font-semibold">Why ERP in Guinea?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Automates financial, operational, and administrative processes.</li>
                  <li>Real‑time insights for better decisions.</li>
                  <li>Improves supply chain and logistics efficiency.</li>
                  <li>Reduces costs by minimizing errors and duplication.</li>
                  <li>Supports both SMEs and large corporations.</li>
                </ul>
                <p>
                  With the right ERP setup and optimization, companies in Guinea gain transparency, reduce
                  inefficiencies, and compete effectively in local and international markets.
                </p>
              </div>
            ),
          },
          {
            title: "Custom Solutions",
            description: "Tailored ERP configurations for your industry.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Custom Solutions – Tailored ERP Configurations for Your Industry</p>
                <p>
                  At Freelance-224, we understand that every business is unique. That’s why we provide custom ERP
                  configurations designed for the specific needs of your industry in Guinea. We help streamline
                  operations, improve efficiency, and give you better control over critical processes.
                </p>
                <p className="font-semibold">Industries and businesses that benefit in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Retail & E-commerce – Inventory, POS, online store integration, CX optimization.</li>
                  <li>Logistics & Transportation – Fleet, parcel tracking, route optimization, supply chain.</li>
                  <li>Import & Export / Trade – Customs docs, warehouse management, financial reporting.</li>
                  <li>Banking & Microfinance – Finance, loan processing, customer data integration.</li>
                  <li>Telecommunications – Billing, CRM, service monitoring.</li>
                  <li>Healthcare & Pharmaceuticals – Patient records, admin, inventory, compliance.</li>
                  <li>Education & Training – E-learning, student management, HR, finance.</li>
                  <li>Construction & Real Estate – Project management, planning, accounting, assets.</li>
                  <li>Agriculture & Agribusiness – Farm planning, production tracking, distribution, sales.</li>
                  <li>Manufacturing & Industry – Scheduling, supply chain, quality control, maintenance.</li>
                  <li>Hospitality & Tourism – Hotel management, bookings, HR, customer service.</li>
                  <li>Public Sector & NGOs – Administration, project monitoring, budget control, reporting.</li>
                </ul>
                <p className="font-semibold">Our tailored ERP solutions include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Customized Modules – Finance, HR, supply chain, CRM, and more.</li>
                  <li>Integration with Local Systems – Tax, payroll, and compliance for Guinea.</li>
                  <li>Scalable Architecture – From startups/SMEs to large enterprises.</li>
                  <li>Training & Support – Equip teams to manage and maximize ERP value.</li>
                </ul>
                <p>
                  With Freelance-224, your ERP becomes a strategic tool adapted to your industry and business reality in
                  Guinea.
                </p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title="IT Support"
        description="Reliable IT support for hardware, software, and network issues, ensuring minimal downtime."
        buttonText="Get IT Support"
        cards={[
          {
            title: "24/7 Support",
            description: "On-demand assistance for IT issues.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">24/7 IT Support – On-Demand Assistance for All Your IT Issues</p>
                <p>
                  At Freelance-224, we know how critical technology is for running a business in today’s digital world.
                  That’s why we provide 24/7 IT support, ensuring that your systems remain secure, reliable, and
                  efficient—anytime you need help.
                </p>
                <p className="font-semibold">Our IT support services cover:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-medium">Network Troubleshooting</span> – Connectivity, routers, firewalls, and VPNs.</li>
                  <li><span className="font-medium">Server & Cloud Management</span> – Setup, monitoring, and maintenance.</li>
                  <li><span className="font-medium">Hardware & Software Support</span> – Diagnostics, repair, installation, configuration.</li>
                  <li><span className="font-medium">Cybersecurity Monitoring</span> – Protection against malware, phishing, and intrusions.</li>
                  <li><span className="font-medium">Email & Collaboration Tools</span> – Microsoft 365, Google Workspace, and business apps.</li>
                  <li><span className="font-medium">ERP & Business Applications</span> – SAP, Odoo, Microsoft Dynamics, and more.</li>
                  <li><span className="font-medium">Backup & Data Recovery</span> – Safeguard critical information in incidents.</li>
                  <li><span className="font-medium">User Training & Helpdesk</span> – Help staff resolve everyday IT challenges.</li>
                </ul>
                <p className="font-semibold">Why 24/7 Support matters for Guinea?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Frequent disruptions from unstable networks, power outages, and system failures.</li>
                  <li>Round-the-clock support keeps operations running and avoids costly downtime.</li>
                  <li>Fast response helps startups, SMEs, and enterprises seize opportunities.</li>
                </ul>
                <p>
                  With Freelance-224’s 24/7 support, you focus on your business while we handle technical issues—
                  quickly, efficiently, and professionally.
                </p>
              </div>
            ),
          },
          {
            title: "Hardware Troubleshooting",
            description: "Fix laptops, smartphones, and desktops.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Hardware Troubleshooting – Professional Repairs for Laptops, Smartphones, and Desktops</p>
                <p>
                  At Freelance-224, we provide fast and reliable hardware troubleshooting services to keep your devices
                  running smoothly. Whether you are an individual, a startup, or a large business in Guinea, our team
                  ensures your IT equipment is always in top condition.
                </p>
                <p className="font-semibold">Our hardware support services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Laptop Repairs</span> – Screen replacement, battery issues, keyboard faults, overheating, software reinstallation.
                  </li>
                  <li>
                    <span className="font-medium">Smartphone Repairs</span> – Screen and touch repairs, charging problems, battery replacement, system resets, and app issues.
                  </li>
                  <li>
                    <span className="font-medium">Desktop & Workstation Support</span> – Power supply issues, hardware upgrades, virus removal, and optimization.
                  </li>
                  <li>
                    <span className="font-medium">Peripheral Devices</span> – Printers, scanners, monitors, and external drives troubleshooting.
                  </li>
                  <li>
                    <span className="font-medium">Preventive Maintenance</span> – Regular check-ups to reduce breakdowns and extend lifespan.
                  </li>
                  <li>
                    <span className="font-medium">Data Backup & Recovery</span> – Protect and restore important files in case of hardware failure.
                  </li>
                  <li>
                    <span className="font-medium">On-site & Remote Support</span> – Assistance at your office, home, or via remote diagnostic tools.
                  </li>
                </ul>
                <p className="font-semibold">Why this service matters for Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Businesses rely heavily on laptops and smartphones for daily operations.</li>
                  <li>Fast, reliable troubleshooting reduces downtime and prevents productivity loss.</li>
                  <li>Affordable maintenance keeps devices functional without frequent replacements.</li>
                </ul>
                <p>
                  With Freelance-224, you get professional hardware troubleshooting and repair services that extend the
                  life of your devices and keep your business running without interruptions.
                </p>
              </div>
            ),
          },
          {
            title: "Network Management",
            description: "Optimize network performance and security.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Network Management – Optimize Performance and Strengthen Security</p>
                <p>
                  At Freelance-224, we help businesses and organizations in Guinea design, manage, and secure their IT
                  networks to ensure smooth and reliable connectivity. A strong network is the backbone of every modern
                  business, and we make sure yours is always performing at its best.
                </p>
                <p className="font-semibold">Our network management services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Network Setup & Configuration</span> – Routers, switches, firewalls, and wireless access points.
                  </li>
                  <li>
                    <span className="font-medium">Performance Optimization</span> – Monitor bandwidth, reduce downtime, and improve speed.
                  </li>
                  <li>
                    <span className="font-medium">Cybersecurity Protection</span> – Firewalls, IDS/IPS, VPNs, and anti-malware solutions.
                  </li>
                  <li>
                    <span className="font-medium">LAN & WAN Solutions</span> – Networks tailored for offices, schools, and enterprises.
                  </li>
                  <li>
                    <span className="font-medium">Wi‑Fi Deployment</span> – Reliable and secure wireless for businesses, hotels, and institutions.
                  </li>
                  <li>
                    <span className="font-medium">Cloud & Remote Access</span> – Secure VPNs and cloud integration for remote work.
                  </li>
                  <li>
                    <span className="font-medium">Troubleshooting & Maintenance</span> – Rapid response to outages and connectivity issues.
                  </li>
                  <li>
                    <span className="font-medium">Network Audits</span> – Regular analysis to detect vulnerabilities and improve performance.
                  </li>
                </ul>
                <p className="font-semibold">Why it matters in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Unstable internet and security challenges are common across Conakry and beyond.</li>
                  <li>Poorly managed networks cause downtime, productivity loss, and security risks.</li>
                  <li>Optimized, secure networks improve efficiency, protect data, and customer service.</li>
                </ul>
                <p>
                  With Freelance-224’s network management expertise, you get a secure, stable, high‑performing network
                  infrastructure that supports your growth.
                </p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title="IT Solution Integration"
        description="Seamlessly integrate IT solutions (e.g., CRM, ERP, cloud systems) to enhance business operations."
        buttonText="Integrate Now"
        cards={[
          {
            title: "System Integration",
            description: "Connect disparate systems for unified workflows.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">System Integration – Connect Disparate Systems for Unified Workflows</p>
                <p>
                  At Freelance-224, we help businesses in Guinea eliminate inefficiencies caused by disconnected tools
                  and platforms. Our system integration services ensure that your different IT solutions work together
                  seamlessly, creating unified workflows that save time, reduce errors, and boost productivity.
                </p>
                <p className="font-semibold">Our system integration services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">ERP Integration</span> – Connect SAP, Odoo, Microsoft Dynamics, Oracle NetSuite with your apps.
                  </li>
                  <li>
                    <span className="font-medium">Accounting & Finance Integration</span> – Link QuickBooks, Tally, or Sage with sales, inventory, and banking.
                  </li>
                  <li>
                    <span className="font-medium">CRM & Sales Integration</span> – Sync Zoho, Salesforce, HubSpot with marketing, e-commerce, and comms tools.
                  </li>
                  <li>
                    <span className="font-medium">E-commerce Integration</span> – Connect Shopify, WooCommerce, Magento with payments, delivery APIs, inventory.
                  </li>
                  <li>
                    <span className="font-medium">Communication Tools</span> – Integrate email, WhatsApp Business, Microsoft Teams, or Slack with workflows.
                  </li>
                  <li>
                    <span className="font-medium">API Development & Connectivity</span> – Build custom APIs to link internal and external systems.
                  </li>
                  <li>
                    <span className="font-medium">Data Synchronization</span> – Ensure real-time data consistency across platforms.
                  </li>
                  <li>
                    <span className="font-medium">Cloud & On-Premise Integration</span> – Securely connect local servers with AWS, Azure, Google Cloud.
                  </li>
                </ul>
                <p className="font-semibold">Why system integration matters in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Many businesses rely on separate tools (Excel, local accounting apps, manual processes).
                  </li>
                  <li>This causes inefficiency, duplicated work, and errors.</li>
                  <li>Integrating systems saves time, cuts costs, and improves visibility.</li>
                </ul>
                <p>
                  With Freelance-224’s system integration expertise, your tools no longer work in isolation—they become
                  a cohesive digital ecosystem that drives efficiency and growth.
                </p>
              </div>
            ),
          },
          {
            title: "Cloud Integration",
            description: "Integrate with AWS, Azure, and other cloud platforms.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Cloud Integration – Seamless Connection with AWS, Azure, and Other Cloud Platforms</p>
                <p>
                  At Freelance-224, we help businesses in Guinea leverage the power of cloud computing to improve
                  scalability, security, and efficiency. Our cloud integration services connect your existing systems,
                  applications, and data to leading cloud platforms such as AWS, Microsoft Azure, Google Cloud, and
                  more, ensuring seamless operation and accessibility.
                </p>
                <p className="font-semibold">Our cloud integration services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Cloud Migration</span> – Move applications, databases, and infrastructure to the cloud with minimal
                    disruption.
                  </li>
                  <li>
                    <span className="font-medium">Hybrid Cloud Solutions</span> – Combine local servers with cloud services for performance, cost, and
                    reliability.
                  </li>
                  <li>
                    <span className="font-medium">Application Integration</span> – Connect ERP, CRM, HR, and e-commerce to cloud services for real-time
                    access and automation.
                  </li>
                  <li>
                    <span className="font-medium">Data Storage & Backup</span> – Secure data on cloud storage with automated backups and disaster recovery.
                  </li>
                  <li>
                    <span className="font-medium">Collaboration Tools Integration</span> – Implement Microsoft 365, Google Workspace, Teams for remote work.
                  </li>
                  <li>
                    <span className="font-medium">API & SaaS Integration</span> – Link existing systems with cloud-hosted applications for a unified
                    ecosystem.
                  </li>
                  <li>
                    <span className="font-medium">Security & Compliance</span> – Ensure data protection and compliance with international standards.
                  </li>
                </ul>
                <p className="font-semibold">Why cloud integration is critical for businesses in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Local servers are costly to maintain and vulnerable to failure.</li>
                  <li>Remote access, secure collaboration, and business continuity in the digital economy.</li>
                  <li>Scalable growth without heavy infrastructure investments for SMEs and enterprises.</li>
                </ul>
                <p>
                  With Freelance-224, your business can fully embrace the cloud, making operations more agile,
                  efficient, and future-ready.
                </p>
              </div>
            ),
          },
          {
            title: "Custom API Development",
            description: "Build APIs for tailored integrations.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Custom API Development – Tailored Integrations for Your Business</p>
                <p>
                  At Freelance-224, we specialize in building custom APIs that allow your business applications,
                  platforms, and services to communicate seamlessly. Whether you operate in Conakry or across Guinea,
                  our APIs help automate processes, enhance efficiency, and enable new digital services.
                </p>
                <p className="font-semibold">Our custom API development services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">API Design & Architecture</span> – Robust, scalable, and secure APIs tailored to your needs.
                  </li>
                  <li>
                    <span className="font-medium">System Integration</span> – Connect ERP, CRM, e-commerce, payment gateways, logistics, and IoT.
                  </li>
                  <li>
                    <span className="font-medium">Mobile & Web API Development</span> – Real-time data for apps, websites, and platforms.
                  </li>
                  <li>
                    <span className="font-medium">Third-Party Integrations</span> – Integrate with services like Vercel, payment providers, cloud, and logistics.
                  </li>
                  <li>
                    <span className="font-medium">API Maintenance & Support</span> – Keep APIs secure, up-to-date, and fully functional.
                  </li>
                  <li>
                    <span className="font-medium">Data Security & Compliance</span> – Protect sensitive data and meet standards.
                  </li>
                </ul>
                <p className="font-semibold">Industries that benefit in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>E-commerce & Retail – Automate inventory, orders, and delivery tracking.</li>
                  <li>Banking & Fintech – Connect payment gateways and financial platforms.</li>
                  <li>Logistics & Delivery – Integrate with courier and real-time tracking.</li>
                  <li>Healthcare & Education – Streamline records, learning platforms, and workflows.</li>
                  <li>Agriculture & Industry – Monitor production, supply chains, and equipment remotely.</li>
                </ul>
                <p>
                  By leveraging Freelance-224’s custom APIs, businesses optimize operations, improve customer
                  experiences, and unlock new digital opportunities tailored to the Guinean market.
                </p>
              </div>
            ),
          },
        ]}
      />

      <ServiceSection
        title="Outsourcing with Freelance-224"
        description="Outsource IT tasks to our expert team for cost efficiency and scalability."
        buttonText="Outsource Now"
        cards={[
          {
            title: "IT Operations",
            description: "Outsource server management, backups, and updates.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">IT Operations – Comprehensive Outsourced Management for Your Business</p>
                <p>
                  At Freelance-224, we provide full IT operations management for businesses across Conakry and
                  throughout Guinea. Our services allow you to focus on your core business while we ensure that your IT
                  infrastructure is secure, reliable, and always up-to-date.
                </p>
                <p className="font-semibold">Our IT operations services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Server Management</span> – Installation, configuration, monitoring, and optimization of physical and
                    virtual servers.
                  </li>
                  <li>
                    <span className="font-medium">System Backups & Disaster Recovery</span> – Regular automated backups, recovery planning, and quick
                    restoration of critical business data.
                  </li>
                  <li>
                    <span className="font-medium">Software & Security Updates</span> – Keeping operating systems, applications, and security solutions
                    up-to-date to prevent vulnerabilities.
                  </li>
                  <li>
                    <span className="font-medium">Network Monitoring & Optimization</span> – Ensuring high performance, stability, and security across
                    networks.
                  </li>
                  <li>
                    <span className="font-medium">Cloud Operations Management</span> – Managing AWS, Azure, and Google Cloud for scalability and efficiency.
                  </li>
                  <li>
                    <span className="font-medium">24/7 Support & Troubleshooting</span> – Immediate assistance for server or system issues to minimize
                    downtime.
                  </li>
                </ul>
                <p className="font-semibold">Industries that benefit in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Banks & Financial Institutions – Secure and reliable management for sensitive data.</li>
                  <li>E-commerce & Retail – Uninterrupted service and real-time inventory updates.</li>
                  <li>Healthcare & Education – Maintain patient records, learning platforms, and systems.</li>
                  <li>Manufacturing & Industrial – Monitor production systems, databases, and IoT devices.</li>
                  <li>SMEs & Startups – Cost-effective IT support without in-house teams.</li>
                </ul>
                <p>
                  By entrusting your IT operations to Freelance-224, businesses gain peace of mind, improved
                  efficiency, and reduced operational risks, all while leveraging cutting-edge IT management tailored to
                  the Guinean market.
                </p>
              </div>
            ),
          },
          {
            title: "Software Development",
            description: "Outsource app development and maintenance.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Software Development – Outsourced App Development and Maintenance</p>
                <p>
                  At Freelance-224, we provide end-to-end software development services for businesses across Conakry
                  and throughout Guinea. Whether you need custom web applications, mobile apps, or enterprise software,
                  we deliver robust, scalable, and user-friendly solutions tailored to your industry.
                </p>
                <p className="font-semibold">Our software development services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Custom Web Applications</span> – Build responsive and secure websites and platforms for
                    e-commerce, services, and internal processes.
                  </li>
                  <li>
                    <span className="font-medium">Mobile App Development</span> – Design and develop iOS and Android apps to enhance engagement and
                    operational efficiency.
                  </li>
                  <li>
                    <span className="font-medium">Enterprise Software Solutions</span> – Develop and maintain ERP, CRM, and management systems tailored to
                    your needs.
                  </li>
                  <li>
                    <span className="font-medium">Software Maintenance & Upgrades</span> – Ongoing updates, bug fixes, performance optimization, and
                    feature enhancements.
                  </li>
                  <li>
                    <span className="font-medium">Integration with Existing Systems</span> – Connect apps with ERP, CRM, or other tools for unified workflows.
                  </li>
                  <li>
                    <span className="font-medium">Cloud-Based Applications</span> – Deploy scalable solutions on AWS, Azure, and Google Cloud.
                  </li>
                </ul>
                <p className="font-semibold">Industries that benefit in Guinea:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>E-commerce & Retail – Custom platforms for sales and customer experience.</li>
                  <li>Banking & Finance – Secure apps for transactions, reporting, and client management.</li>
                  <li>Healthcare – Patient management, telemedicine, and clinic operations.</li>
                  <li>Education & E-learning – Digital learning for schools, universities, and corporate training.</li>
                  <li>Logistics & Transportation – Delivery tracking and fleet management apps.</li>
                  <li>SMEs & Startups – Affordable, scalable solutions for growth.</li>
                </ul>
                <p>
                  Outsourcing your software development to Freelance-224 ensures cost efficiency, high-quality
                  solutions, and timely delivery, empowering your business to thrive in Guinea’s digital landscape.
                </p>
              </div>
            ),
          },
          {
            title: "Support Services",
            description: "Outsource helpdesk and customer support.",
            flipContent: (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2 pr-1">
                <p className="font-semibold">Support Services – Outsource Helpdesk and Customer Support</p>
                <p>
                  At Freelance-224, we provide professional outsourced helpdesk and customer support services to
                  businesses across Conakry and all of Guinea. Our solutions are designed to enhance customer
                  satisfaction, streamline operations, and reduce operational costs, allowing companies to focus on
                  their core business.
                </p>
                <p className="font-semibold">Our support services include:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-medium">Multi-Channel Customer Support</span> – Assistance via phone, email, live chat, WhatsApp, and social media.
                  </li>
                  <li>
                    <span className="font-medium">Technical Helpdesk</span> – Troubleshooting software, hardware, and IT system issues for businesses and end-users.
                  </li>
                  <li>
                    <span className="font-medium">Ticket Management & Tracking</span> – Log, prioritize, and resolve customer issues with professional workflows.
                  </li>
                  <li>
                    <span className="font-medium">24/7 Availability</span> – Round-the-clock support to meet expectations and maintain continuity.
                  </li>
                  <li>
                    <span className="font-medium">Performance Reporting & Analytics</span> – Insights on queries, response times, and satisfaction metrics.
                  </li>
                  <li>
                    <span className="font-medium">Customized Support Solutions</span> – Tailored for industries such as e-commerce, logistics, banking, healthcare, education, and SMEs in Guinea.
                  </li>
                </ul>
                <p>
                  Outsourcing your helpdesk and customer support to Freelance-224 ensures high-quality assistance,
                  improved client retention, and enhanced operational efficiency, empowering your business to grow in
                  Guinea’s digital and service-driven market.
                </p>
              </div>
            ),
          },
        ]}
      />

      {/* Google Map Section */}
      <div className="container mx-auto mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Nearby IT Consultants in Conakry
        </h2>
        <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 h-72 sm:h-96 rounded-lg overflow-hidden shadow-md mx-auto border border-gray-400">
          <iframe
            title="Conakry IT Consultants Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63624.05563747121!2d-13.725108300000001!3d9.641185050920002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xefdc292f2ed6d7af%3A0xe4e0ccbe67276dbf!2sConakry%2C%20Guinea!5e0!3m2!1sen!2s!4v1699964059000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

/* Section Component */
function ServiceSection({ title, description, cards, buttonText }) {
  return (
    <section className="container mx-auto mb-12 sm:mb-14 md:mb-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-3xl">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {cards.map((card, index) => (
          <ServiceCard
            key={index}
            title={card.title}
            description={card.description}
            flipContent={card.flipContent}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <ServiceButton text={buttonText} />
      </div>
    </section>
  );
}

/* Card Component */
function ServiceCard({ title, description, flipContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flipContent) {
  return (
    <div className="bg-green-50 border border-gray-600 rounded-lg shadow-md p-6 sm:p-8 h-40 sm:h-48 w-full flex flex-col justify-center space-y-2 sm:space-y-3 hover:shadow-lg transition-shadow">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
      </div>
    );
  }

  return (
    <div
      className="h-40 sm:h-48 w-full [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTouchStart={() => setIsFlipped((prev) => !prev)}
      role="button"
      aria-label={`${title} details`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
    >
      <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}` }>
        <div className="absolute inset-0 [backface-visibility:hidden] bg-green-50 border border-gray-600 rounded-lg shadow-md p-6 sm:p-8 h-40 sm:h-48 w-full flex flex-col justify-center space-y-2 sm:space-y-3 hover:shadow-lg transition-shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white border border-gray-600 rounded-lg shadow-md p-4 sm:p-5 h-40 sm:h-48 w-full overflow-hidden">
          <div className="h-full overflow-y-auto pr-2">
            {flipContent}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Button Component */
function ServiceButton({ text }) {
  return (
    <Link
      to="/tech-services/booking"
      className="inline-flex items-center justify-center rounded-full bg-blue-400 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
    >
      {text}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}
