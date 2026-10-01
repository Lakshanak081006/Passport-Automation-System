import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../utils/format";

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return <p className="muted">No history available yet.</p>;
  }
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Previous Status</th>
            <th>New Status</th>
            <th>Changed By</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id}>
              <td>{formatDateTime(h.changedAt)}</td>
              <td>{h.previousStatus ? <StatusBadge status={h.previousStatus} /> : "-"}</td>
              <td><StatusBadge status={h.newStatus} /></td>
              <td>{h.changedBy}</td>
              <td>{h.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
