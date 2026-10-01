import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationCard from "../components/ApplicationCard";
import PoliceVerificationCard from "../components/PoliceVerificationCard";
import Loading from "../components/Loading";
import StatusCard from "../components/StatusCard";
import { getMyApplication, getMyVerification } from "../services/applicationService";
import { errorMessage } from "../services/api";

export default function ViewStatus() {
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
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!application) {
    return (
      <div className="card empty">
        <h3>No application found</h3>
        <Link className="btn btn-primary" to="/applicant/apply">Apply for Passport</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Passport Application Status</h1>

      {verification && (
        <PoliceVerificationCard verification={verification} />
      )}

      <ApplicationCard application={application} />
      <StatusCard status={application.status} />
    </div>
  );
}
