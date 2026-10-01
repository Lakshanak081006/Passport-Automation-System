import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationCard from "../components/ApplicationCard";
import PoliceVerificationCard from "../components/PoliceVerificationCard";
import TravelMarquee from "../components/TravelMarquee";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { getMyApplication, getMyVerification } from "../services/applicationService";
import { errorMessage } from "../services/api";
import { formatDate, formatDateTime } from "../utils/format";

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyApplication(), getMyVerification()])
      .then(([app, ver]) => {
        setApplication(app);
        setVerification(ver);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Dashboard Banner */}
      <div className="dashboard-banner">
        <div className="banner-text">
          <h1>Welcome, {user.name}</h1>
          <p>Track your passport application status, manage verification appointments, and prepare for your international travel.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {application ? (
        <>
          <div className="grid-4">
            <div className="card stat"><label>Application ID</label><p className="big">{application.applicationNumber}</p></div>
            <div className="card stat"><label>Current Status</label><p><StatusBadge status={application.status} /></p></div>
            <div className="card stat"><label>Submitted Date</label><p className="big">{formatDate(application.createdAt)}</p></div>
            <div className="card stat"><label>Last Updated</label><p className="big">{formatDateTime(application.updatedAt)}</p></div>
          </div>

          {/* Police Verification Card */}
          {verification && (
            <PoliceVerificationCard verification={verification} />
          )}

          <ApplicationCard application={application} />

          <div className="actions">
            <Link className="btn btn-primary" to="/applicant/status">View Full Status & Timeline</Link>
            <Link className="btn btn-secondary" to="/applicant/history">Application History</Link>
            {application.status === "REJECTED" && (
              <Link className="btn btn-primary" to="/applicant/apply">Apply Again</Link>
            )}
          </div>
        </>
      ) : (
        !error && (
          <div className="card empty-card-travel">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
              alt="Passport and Travel"
              className="empty-state-img"
            />
            <h3>You have not applied for a passport yet</h3>
            <p>Start your application now. It only takes a few minutes to submit your details online.</p>
            <Link className="btn btn-primary btn-lg" to="/applicant/apply">Apply for Passport Now</Link>
          </div>
        )
      )}

      {/* Marquee Image Ticker Slider */}
      <TravelMarquee />
    </div>
  );
}
