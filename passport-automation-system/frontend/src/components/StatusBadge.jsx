import { statusLabel } from "../utils/format";

/** Color badge for application statuses. */
export default function StatusBadge({ status }) {
  if (!status) return <span>-</span>;
  return (
    <span className={`badge badge-${status}`}>
      {statusLabel(status)}
    </span>
  );
}
