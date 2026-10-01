import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ApplyPassport from "./pages/ApplyPassport";
import ViewStatus from "./pages/ViewStatus";
import ApplicationHistory from "./pages/ApplicationHistory";
import StatusChangerDashboard from "./pages/StatusChangerDashboard";
import ApplicationReview from "./pages/ApplicationReview";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant only */}
          <Route element={<ProtectedRoute role="APPLICANT"><DashboardLayout /></ProtectedRoute>}>
            <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
            <Route path="/applicant/apply" element={<ApplyPassport />} />
            <Route path="/applicant/status" element={<ViewStatus />} />
            <Route path="/applicant/history" element={<ApplicationHistory />} />
          </Route>

          {/* Status changer only */}
          <Route element={<ProtectedRoute role="STATUS_CHANGER"><DashboardLayout /></ProtectedRoute>}>
            <Route path="/status-changer/dashboard" element={<StatusChangerDashboard />} />
            <Route path="/status-changer/application/:id" element={<ApplicationReview />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
