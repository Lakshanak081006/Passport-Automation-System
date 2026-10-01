import { useState } from "react";
import {
  scheduleVerification,
  rescheduleVerification,
  completeVerification,
  cancelVerification,
} from "../services/applicationService";
import { useToast } from "../context/ToastContext";
import { errorMessage } from "../services/api";

export default function PoliceVerificationModal({ application, existingVerification, onRefresh, onClose }) {
  const toast = useToast();
  const [mode, setMode] = useState(existingVerification ? "view" : "schedule"); // schedule, reschedule, complete, cancel, view
  const [loading, setLoading] = useState(false);

  // Form states
  const [stationName, setStationName] = useState(existingVerification?.policeStationName || "");
  const [stationAddress, setStationAddress] = useState(existingVerification?.policeStationAddress || "");
  const [date, setDate] = useState(existingVerification?.verificationDate || "");
  const [time, setTime] = useState(existingVerification?.verificationTime || "10:30 AM");
  const [instructions, setInstructions] = useState(
    existingVerification?.instructions || "Please visit the police station at the scheduled date and time with required original documents."
  );
  const [remarks, setRemarks] = useState("");
  const [reason, setReason] = useState("");

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scheduleVerification({
        applicationId: application.id,
        policeStationName: stationName,
        policeStationAddress: stationAddress,
        verificationDate: date,
        verificationTime: time,
        instructions,
      });
      toast.success("Police verification scheduled and applicant notified!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await rescheduleVerification(existingVerification.id, {
        verificationDate: date,
        verificationTime: time,
        instructions,
      });
      toast.success("Verification rescheduled and applicant notified!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeVerification(existingVerification.id, remarks);
      toast.success("Verification marked as completed!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cancelVerification(existingVerification.id, reason);
      toast.success("Verification appointment cancelled!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>👮 Police Verification Management</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {existingVerification && (
          <div className="modal-tabs">
            <button className={`tab-btn ${mode === "view" ? "active" : ""}`} onClick={() => setMode("view")}>Details</button>
            <button className={`tab-btn ${mode === "reschedule" ? "active" : ""}`} onClick={() => setMode("reschedule")}>Reschedule</button>
            <button className={`tab-btn ${mode === "complete" ? "active" : ""}`} onClick={() => setMode("complete")}>Mark Complete</button>
            <button className={`tab-btn ${mode === "cancel" ? "active" : ""}`} onClick={() => setMode("cancel")}>Cancel</button>
          </div>
        )}

        {mode === "schedule" && (
          <form onSubmit={handleSchedule} className="modal-form">
            <h4>Schedule New Verification</h4>
            <div className="form-field">
              <label>Police Station Name *</label>
              <input type="text" required value={stationName} onChange={(e) => setStationName(e.target.value)} placeholder="e.g. Peelamedu Police Station" />
            </div>
            <div className="form-field">
              <label>Police Station Address *</label>
              <textarea required rows={2} value={stationAddress} onChange={(e) => setStationAddress(e.target.value)} placeholder="Full station address..." />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Verification Date *</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Verification Time *</label>
                <input type="text" required value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:30 AM" />
              </div>
            </div>
            <div className="form-field">
              <label>Instructions</label>
              <textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Scheduling..." : "Schedule Appointment"}</button>
            </div>
          </form>
        )}

        {mode === "view" && existingVerification && (
          <div className="modal-body-view">
            <div className="info-grid">
              <div><label>Appointment ID</label><p className="big">{existingVerification.appointmentNumber}</p></div>
              <div><label>Status</label><p><strong>{existingVerification.status}</strong></p></div>
              <div><label>Police Station</label><p>{existingVerification.policeStationName}</p></div>
              <div><label>Address</label><p>{existingVerification.policeStationAddress}</p></div>
              <div><label>Date</label><p className="big">{existingVerification.verificationDate}</p></div>
              <div><label>Time</label><p className="big">{existingVerification.verificationTime}</p></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        )}

        {mode === "reschedule" && (
          <form onSubmit={handleReschedule} className="modal-form">
            <h4>Reschedule Verification Appointment</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>New Verification Date *</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-field">
                <label>New Verification Time *</label>
                <input type="text" required value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 11:00 AM" />
              </div>
            </div>
            <div className="form-field">
              <label>Updated Instructions</label>
              <textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setMode("view")}>Back</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Rescheduling..." : "Save Rescheduled Appointment"}</button>
            </div>
          </form>
        )}

        {mode === "complete" && (
          <form onSubmit={handleComplete} className="modal-form">
            <h4>Mark Police Verification as Completed</h4>
            <p className="muted">This will advance the passport application to POLICE_VERIFICATION_COMPLETED.</p>
            <div className="form-field">
              <label>Verification Remarks</label>
              <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Identity and address verified successfully by officer." />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setMode("view")}>Back</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Mark Completed"}</button>
            </div>
          </form>
        )}

        {mode === "cancel" && (
          <form onSubmit={handleCancel} className="modal-form">
            <h4>Cancel Verification Appointment</h4>
            <div className="form-field">
              <label>Reason for Cancellation</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Incorrect address provided by applicant." />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setMode("view")}>Back</button>
              <button type="submit" className="btn btn-danger" disabled={loading}>{loading ? "Cancelling..." : "Cancel Appointment"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
