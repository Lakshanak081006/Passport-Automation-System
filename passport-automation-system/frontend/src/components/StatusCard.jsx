import { STATUS_FLOW, statusLabel } from "../utils/format";

/** Vertical timeline that highlights the current status. */
export default function StatusCard({ status }) {
  const rejected = status === "REJECTED";
  const currentIndex = rejected ? 0 : STATUS_FLOW.indexOf(status);

  return (
    <div className="card">
      <h3 className="card-title">Application Progress</h3>
      {rejected && (
        <div className="alert alert-error">
          Your application has been <strong>REJECTED</strong>. See the remarks below. You may submit a new application.
        </div>
      )}
      <ol className="timeline">
        {STATUS_FLOW.map((step, i) => {
          let state = "pending";
          if (i < currentIndex) state = "done";
          else if (i === currentIndex) state = rejected ? "done" : "current";
          return (
            <li key={step} className={`timeline-item ${state}`}>
              <span className="timeline-dot">{state === "done" ? "✓" : state === "current" ? "●" : "○"}</span>
              <div className="timeline-text">
                <strong>{statusLabel(step)}</strong>
                {state === "current" && <small>Current status</small>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
