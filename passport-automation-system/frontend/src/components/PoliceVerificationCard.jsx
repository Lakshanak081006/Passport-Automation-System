import { formatFriendlyDate, getDaysUntil } from "../utils/format";

export default function PoliceVerificationCard({ verification }) {
  if (!verification) return null;

  const daysLeft = getDaysUntil(verification.verificationDate);
  const isPast = daysLeft !== null && daysLeft < 0;

  return (
    <div className="card verification-card">
      <div className="verification-card-header">
        <div>
          <span className="badge-verification-header">
            {verification.status === "COMPLETED"
              ? "✓ Verification Completed"
              : verification.status === "CANCELLED"
              ? "✗ Verification Cancelled"
              : "✓ Appointment Scheduled"}
          </span>
          <h3 className="verification-card-title">POLICE VERIFICATION</h3>
        </div>
        <div className="appointment-id-pill">
          <span className="pill-label">Appointment ID</span>
          <span className="pill-val">{verification.appointmentNumber}</span>
        </div>
      </div>

      {/* Countdown / Status Banner */}
      {verification.status === "SCHEDULED" || verification.status === "RESCHEDULED" ? (
        isPast ? (
          <div className="verification-alert alert-warning">
            ⚠️ <strong>Verification Appointment Passed</strong>
            <p>If you attended the appointment, status will be updated soon by the station officer.</p>
          </div>
        ) : daysLeft === 0 ? (
          <div className="verification-alert alert-today">
            🔔 <strong>Your police verification appointment is TODAY!</strong>
            <p>Please report to the police station at {verification.verificationTime}.</p>
          </div>
        ) : (
          <div className="verification-alert alert-scheduled">
            📅 <strong>Your police verification is scheduled in {daysLeft} day{daysLeft > 1 ? "s" : ""}</strong>
          </div>
        )
      ) : verification.status === "COMPLETED" ? (
        <div className="verification-alert alert-success">
          ✅ <strong>Police Verification Completed Successfully</strong>
        </div>
      ) : verification.status === "CANCELLED" ? (
        <div className="verification-alert alert-error">
          ❌ <strong>Police Verification Appointment Cancelled</strong>
        </div>
      ) : null}

      <div className="verification-grid">
        <div className="verification-item station-box">
          <label>📍 Police Station</label>
          <p className="station-name">{verification.policeStationName}</p>
          <p className="station-address">{verification.policeStationAddress}</p>
        </div>

        <div className="verification-item date-time-box">
          <div className="dt-row">
            <div className="dt-col">
              <label>📅 Date</label>
              <p className="highlight-val">{formatFriendlyDate(verification.verificationDate)}</p>
            </div>
            <div className="dt-col">
              <label>⏰ Time</label>
              <p className="highlight-val">{verification.verificationTime}</p>
            </div>
          </div>
        </div>
      </div>

      {verification.instructions && (
        <div className="verification-instructions">
          <label>📋 Instructions</label>
          <p>{verification.instructions}</p>
        </div>
      )}
    </div>
  );
}
