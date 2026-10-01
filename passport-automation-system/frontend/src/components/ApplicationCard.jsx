import StatusBadge from "./StatusBadge";
import { formatDate, formatDateTime } from "../utils/format";

/** Summary of an application (ID, status, dates, remarks). */
export default function ApplicationCard({ application }) {
  return (
    <div className="card">
      <h3 className="card-title">Application Summary</h3>
      <div className="info-grid">
        <div><label>Application ID</label><p className="big">{application.applicationNumber}</p></div>
        <div><label>Current Status</label><p><StatusBadge status={application.status} /></p></div>
        <div><label>Applicant Name</label><p>{application.fullName}</p></div>
        <div><label>Submitted Date</label><p>{formatDate(application.createdAt)}</p></div>
        <div><label>Last Updated</label><p>{formatDateTime(application.updatedAt)}</p></div>
        <div><label>Remarks</label><p>{application.remarks || "-"}</p></div>
      </div>
    </div>
  );
}
