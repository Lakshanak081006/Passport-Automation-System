import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import HistoryTable from "../components/HistoryTable";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import StatusCard from "../components/StatusCard";
import PoliceVerificationCard from "../components/PoliceVerificationCard";
import PoliceVerificationModal from "../components/PoliceVerificationModal";
import { useToast } from "../context/ToastContext";
import {
  getApplicationById,
  getApplicationHistory,
  getVerificationByApplicationId,
  updateStatus,
} from "../services/applicationService";
import { errorMessage } from "../services/api";
import { ALL_STATUSES, formatDate, formatDateTime, statusLabel } from "../utils/format";

export default function ApplicationReview() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const formRef = useRef(null);

  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const [a, h, v] = await Promise.all([
        getApplicationById(id),
        getApplicationHistory(id),
        getVerificationByApplicationId(id),
      ]);
      setApp(a);
      setHistory(h);
      setVerification(v);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!loading && app && searchParams.get("focus") === "update") {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, app, searchParams]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      toast.error("Select the new status");
      return;
    }
    if (newStatus === "REJECTED" && !remarks.trim()) {
      toast.error("Remarks are required when rejecting an application");
      return;
    }
    setSaving(true);
    try {
      await updateStatus(id, newStatus, remarks);
      toast.success("Status updated. The applicant has been notified by email.");
      setNewStatus("");
      setRemarks("");
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-error">{error} <Link to="/status-changer/dashboard">Back</Link></div>;

  const closed = app.status === "COMPLETED" || app.status === "REJECTED";
  const details = [
    ["Application ID", app.applicationNumber], ["Full Name", app.fullName],
    ["Date of Birth", formatDate(app.dateOfBirth)], ["Gender", app.gender],
    ["Father's Name", app.fatherName], ["Mother's Name", app.motherName],
    ["Marital Status", app.maritalStatus], ["Email", app.email], ["Mobile", app.mobile],
    ["Address", app.address], ["City", app.city], ["State", app.state], ["Pincode", app.pincode],
    ["Passport Type", app.passportType], ["Application Type", app.applicationType],
    ["Previous Passport No.", app.previousPassportNumber || "-"],
    ["Place of Birth", app.placeOfBirth], ["Country of Birth", app.countryOfBirth],
    ["Nationality", app.nationality], ["Submitted", formatDateTime(app.createdAt)],
    ["Last Updated", formatDateTime(app.updatedAt)],
  ];

  return (
    <div>
      <p><Link to="/status-changer/dashboard">← Back to dashboard</Link></p>
      <h1 className="page-title">Review Application {app.applicationNumber}</h1>

      <div className="card">
        <h3 className="card-title">Applicant &amp; Application Details</h3>
        <div className="info-grid">
          {details.map(([label, value]) => (
            <div key={label}><label>{label}</label><p>{value}</p></div>
          ))}
        </div>
      </div>

      {/* Police Verification Management Card */}
      <div className="card police-management-card">
        <div className="card-header-flex">
          <h3 className="card-title">👮 Police Verification Management</h3>
          <button className="btn btn-accent" onClick={() => setShowVerificationModal(true)}>
            {verification ? "Manage Verification Appointment" : "Schedule Police Verification"}
          </button>
        </div>

        {verification ? (
          <PoliceVerificationCard verification={verification} />
        ) : (
          <div className="alert alert-info">
            No police verification appointment scheduled yet for this application. Click <strong>Schedule Police Verification</strong> to set date, time and police station.
          </div>
        )}
      </div>

      {showVerificationModal && (
        <PoliceVerificationModal
          application={app}
          existingVerification={verification}
          onRefresh={load}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      <div className="card" ref={formRef}>
        <h3 className="card-title">Update Status</h3>
        <div className="info-grid">
          <div><label>Application ID</label><p>{app.applicationNumber}</p></div>
          <div><label>Applicant Name</label><p>{app.fullName}</p></div>
          <div><label>Current Status</label><p><StatusBadge status={app.status} /></p></div>
          <div><label>Latest Remarks</label><p>{app.remarks || "-"}</p></div>
        </div>
        {closed ? (
          <div className="alert alert-info">This application is {statusLabel(app.status)} and can no longer be changed.</div>
        ) : (
          <form onSubmit={handleUpdate} className="status-form">
            <div className="form-field">
              <label>New Status <span className="req">*</span></label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="">Select new status</option>
                {ALL_STATUSES.filter((s) => s !== app.status).map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Remarks</label>
              <textarea rows={3} maxLength={500} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                placeholder="Visible to the applicant. Required when rejecting." />
            </div>
            <button className="btn btn-primary" disabled={saving}>{saving ? "Updating..." : "Update Status"}</button>
          </form>
        )}
      </div>

      <StatusCard status={app.status} />

      <div className="card">
        <h3 className="card-title">Status History</h3>
        <HistoryTable history={history} />
      </div>
    </div>
  );
}
