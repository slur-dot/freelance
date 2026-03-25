// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Pages/Home';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import SmartphoneStore from './Pages/Shop/SmartphoneStore';
import IPhoneProductPage from './Pages/Shop/IPhoneProductPage';
import CartPage from './Pages/Shop/CartPage';
import Shop from './Pages/Shop/Shop';
import Footer from './components/Footer';
import ShippingDetailsPage from './Pages/Shop/ShippingDetailsPage';
import PaymentSuccess from './Pages/Shop/PaymentSuccess';
import DownloadInvoicePage from "./Pages/Shop/DownloadInvoicePage";
import ComputerRentalPage from "./Pages/ComputerRentalPage";
import ComputerBookingForm from './components/ComputerRentalBooking/ComputerBookingForm';
import CourseDetailPage from "./Pages/Training/CourseDetailPage";
import CompanyTrainingRequestForm from "./Pages/Training/CompanyTrainingRequestForm";
import TrainingModulesPage from "./Pages/Training/TrainingModulesPage";
import TeamEnrollmentForm from "./Pages/Training/TeamEnrollmentForm";
import Faq from "./Pages//Faq";
import Blog from './Pages/Blog';
import BlogPost from './Pages/BlogPost';
import LocationHome from "./Pages/LocationHome";
import TechServices from "./Pages/TechServices";
import TechServiceBooking from "./components/TechServiceBooking";
import CorporateSales from './Pages/CorporateSales';
import Contact from './Pages/Contact';
import HireFreelancer from "./Pages/HireFreelancer";
import FreelancerInfo from './Pages/FreelancerInfo';
import JobPostForm from './components/JobPostForm';
import FreelancerSidebar from "./Pages/Dashboards/Freelancers/FreelancerSidebar";
import FreelancerDashboard from "./Pages/Dashboards/Freelancers/FreelancerDashboard";
import TrainingProgress from "./Pages/Dashboards/Freelancers/TrainingProgress";
import RequestedCourses from './Pages/Dashboards/Freelancers/RequestedCourses';
import Earnings from './Pages/Dashboards/Freelancers/Earnings';
import FreelancerProfile from './Pages/Dashboards/Freelancers/Profile';
import ClientProfile from './Pages/Dashboards/Clients/Profile';
import CompanyProfile from './Pages/Dashboards/Company/Profile';
import VendorProfile from './Pages/Dashboards/VendorModule/Profile';
import SellerProfile from './Pages/Dashboards/Sellers/Profile';
import AdminProfilePage from './Pages/Dashboards/Admin/Profile';

import ClientSidebar from './Pages/Dashboards/Clients/ClientSidebar';
import ClientDashboard from './Pages/Dashboards/Clients/ClientDashboard';
import HiredFreelancers from './Pages/Dashboards/Clients/HiredFreelancers';
import Payments from './Pages/Dashboards/Clients/Payments';
import ProjectList from './Pages/Dashboards/Clients/ProjectList';
import CompanySidebar from './Pages/Dashboards/Company/CompanySidebar';
import CompanyDashboard from './Pages/Dashboards/Company/CompanyDashboard';
import UserLogin from "./Pages/Login/UserLogin";
import SuccessfulPage from './Pages/Login/SuccessfulPage';
import VerifyCodePage from './Pages/Login/VerifyCodePage';
import SignUp from './Pages/Login/SignUp';
import ForgetPassword from './Pages/Login/ForgetPassword';
import EmployeeList from './Pages/Dashboards/Company/EmployeeList';
import CompanyTrainingProgress from './Pages/Dashboards/Company/CompanyTrainingProgress';
import TrainingQuotes from './Pages/Dashboards/Company/TrainingQuotes';
import VendorSidebar from './Pages/Dashboards/VendorModule/VendorSidebar';
import Orders from './Pages/Dashboards/VendorModule/Orders';
import VendorDashboard from './Pages/Dashboards/VendorModule/VendorDashboard';
import Listings from './Pages/Dashboards/VendorModule/Listings';
import Payouts from './Pages/Dashboards/VendorModule/Payouts';
import AdsManagement from './Pages/Dashboards/VendorModule/AdsManagement';
import SellerSidebar from './Pages/Dashboards/Sellers/SellerSidebar';
import SellerDashboard from './Pages/Dashboards/Sellers/SellerDashboard';
import SellerListings from './Pages/Dashboards/Sellers/SellerListings';
import SellerOrders from './Pages/Dashboards/Sellers/SellerOrders';
import SellerPayouts from './Pages/Dashboards/Sellers/SellerPayouts';
import SellerAds from './Pages/Dashboards/Sellers/SellerAds';
import SellerNotifications from './Pages/Dashboards/Sellers/SellerNotifications';
import SellerSettings from './Pages/Dashboards/Sellers/SellerSettings';
import AdminSidebar from './Pages/Dashboards/Admin/AdminSidebar';
import AdminDashboard from './Pages/Dashboards/Admin/AdminDashboard';

import CourseListing from './Pages/Dashboards/Admin/CourseListing';
import ProductListing from './Pages/Dashboards/Admin/ProductListing';
import TicketListing from './Pages/Dashboards/Admin/TicketListing';
import Productform from './Pages/Dashboards/Admin/Productform';
import Courseform from './Pages/Dashboards/Admin/Courseform';

import ManageBookings from './Pages/Dashboards/Admin/ManageBooking';
import ManageTraining from './Pages/Dashboards/Admin/ManageTraining';
import SubAdminManagement from './Pages/Dashboards/Admin/Sub-AdminManagement';
import AdvertisementManagement from './Pages/Dashboards/Admin/AdvertismentManagement';
import SupportTeamManagement from './Pages/Dashboards/Admin/SupportTeamManagement';
import UserManagement from './Pages/Dashboards/Admin/UserManagement';
import ManagePartnerships from './Pages/Dashboards/Admin/ManagePartnerships';
import VendorProfiles from './Pages/VendorProfiles';
import CompanyHistory from './components/CompanyHistory';
import VendorInfo from './Pages/VendorInfo';
import Partnership from './Pages/Partnership';

import './App.css';
import LiveChatWidget from './components/Support/LiveChatWidget';

function AppContent() {
  const location = useLocation();

  // Routes where Navbar & Footer should be hidden
  const hideNavbarFooterRoutes = [
    '/computer-rental/booking',
    '/training-modules/company/enroll-team',
    '/training-modules/company/custom-request',
    '/tech-services/booking',
    '/hire-freelancers/info/job-post',
    '/freelancer/dashboard',
    '/Clients/dashboard',
    '/company/dashboard',
    '/vendor/dashboard',
    '/seller/dashboard',
    '/admin/dashboard',
    '/login',
    '/signup',
    '/forgot-password',
    '/Listings'
  ];

  // Check if current path matches any of these routes 
  const hideNavbarFooter = hideNavbarFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/product/:id" element={<IPhoneProductPage />} />
          <Route path="/shop/cart" element={<CartPage />} />
          <Route path="/shipping-details" element={<ShippingDetailsPage />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/download-invoice" element={<DownloadInvoicePage />} />
          <Route path="/computer-rental" element={<ComputerRentalPage />} />
          <Route path="/computer-rental/booking" element={<ComputerBookingForm />} />
          <Route path="/faq" element={<Faq />} />


          <Route path="/training-modules" element={<TrainingModulesPage />} />
          <Route path="/training-modules/course/:id" element={<CourseDetailPage />} />
          <Route path="/training-modules/company/custom-request" element={<CompanyTrainingRequestForm />} />
          <Route path="/training-modules/company/enroll-team" element={<TeamEnrollmentForm />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/locations" element={<LocationHome />} />
          <Route path="/tech-services" element={<TechServices />} />
          <Route path="/tech-services/booking" element={<TechServiceBooking />} />
          <Route path="/corporate-sales" element={<CorporateSales />} />
          <Route path="/contact" element={< Contact />} />
          <Route path="/hire-freelancers" element={<HireFreelancer />} />
          <Route path="/hire-freelancers/info" element={<FreelancerInfo />} />
          <Route path="/hire-freelancers/info/job-post" element={<JobPostForm />} />
          <Route path="/vendor-profiles" element={<VendorProfiles />} />
          <Route path="/company-history" element={<CompanyHistory />} />
          <Route path="/vendor-profiles/info" element={<VendorInfo />} />
          <Route path="/partnership" element={<Partnership />} />

          {/* Login Page */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/login/successfull" element={<SuccessfulPage />} />
          <Route path="/login/verifycode" element={<VerifyCodePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />



          {/* Freelancer Dashboard */}

          <Route path="/freelancer/dashboard" element={<ProtectedRoute><FreelancerSidebar /></ProtectedRoute>}>
            <Route index element={<FreelancerDashboard />} />
            <Route path="training-progress" element={<TrainingProgress />} />
            <Route path="requested-courses" element={<RequestedCourses />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<FreelancerProfile />} />
          </Route>

          {/* Client Dashboard */}
          <Route path="/Clients/dashboard" element={<ProtectedRoute><ClientSidebar /></ProtectedRoute>}>
            <Route index element={<ClientDashboard />} />
            <Route path="Hired-Freelancers" element={<HiredFreelancers />} />
            <Route path="Project-List" element={<ProjectList />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>


          {/* Company Dashboard  */}
          <Route path="/company/dashboard" element={<ProtectedRoute><CompanySidebar /></ProtectedRoute>}>
            <Route index element={<CompanyDashboard />} />
            <Route path="emplolyee-list" element={<EmployeeList />} />
            <Route path="training-progress" element={<CompanyTrainingProgress />} />
            <Route path="training-quotes" element={<TrainingQuotes />} />
            <Route path="profile" element={<CompanyProfile />} />
          </Route>

          {/* Vendor Dashboard  */}
          <Route path="/vendor/dashboard" element={<ProtectedRoute><VendorSidebar /></ProtectedRoute>}>
            <Route index element={<VendorDashboard />} />
            <Route path="listings" element={<Listings />}></Route>
            <Route path="orders" element={<Orders />}></Route>
            <Route path="payouts" element={<Payouts />}></Route>
            <Route path="ads" element={<AdsManagement />}></Route>
            <Route path="profile" element={<VendorProfile />}></Route>
          </Route>

          {/* Seller Dashboard  */}
          <Route path="/seller/dashboard" element={<ProtectedRoute><SellerSidebar /></ProtectedRoute>}>
            <Route index element={<SellerDashboard />} />
            <Route path="listings" element={<SellerListings />}></Route>
            <Route path="orders" element={<SellerOrders />}></Route>
            <Route path="payouts" element={<SellerPayouts />}></Route>
            <Route path="ads" element={<SellerAds />}></Route>
            <Route path="notifications" element={<SellerNotifications />}></Route>
            <Route path="settings" element={<SellerSettings />}></Route>
            <Route path="profile" element={<SellerProfile />}></Route>
          </Route>

          {/* Admin Dashboard  */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminSidebar /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="course-listing" element={<CourseListing />} />
            <Route path="product-listing" element={<ProductListing />} />
            <Route path="ticket-listing" element={<TicketListing />} />
            <Route path="product-form" element={<Productform />} />
            <Route path="course-form" element={<Courseform />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="training-requests" element={<ManageTraining />} />
            <Route path="sub-admin" element={<SubAdminManagement />} />
            <Route path="advertisements" element={<AdvertisementManagement />} />
            <Route path="support-team" element={<SupportTeamManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="partnerships" element={<ManagePartnerships />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>


        </Routes>



      </div>
      <Footer />

      {/* Live Chat Widget - Show on all pages except dashboard pages */}
      {!hideNavbarFooter && <LiveChatWidget />}
    </>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <AppContent />
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
