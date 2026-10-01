export const STATUS_FLOW = [
  "SUBMITTED",
  "DOCUMENT_VERIFICATION",
  "VERIFICATION",
  "POLICE_VERIFICATION_SCHEDULED",
  "POLICE_VERIFICATION_COMPLETED",
  "PASSPORT_PROCESSING",
  "PASSPORT_APPROVED",
  "PASSPORT_ISSUED",
];

export const ALL_STATUSES = [
  "SUBMITTED",
  "DOCUMENT_VERIFICATION",
  "VERIFICATION",
  "POLICE_VERIFICATION_SCHEDULED",
  "POLICE_VERIFICATION_COMPLETED",
  "PASSPORT_PROCESSING",
  "PASSPORT_APPROVED",
  "PASSPORT_ISSUED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "PASSPORT_DISPATCHED",
  "COMPLETED",
];

export const statusLabel = (s) => {
  if (!s) return "-";
  switch (s) {
    case "POLICE_VERIFICATION_SCHEDULED":
      return "Police Verification Scheduled";
    case "POLICE_VERIFICATION_COMPLETED":
      return "Police Verification Completed";
    case "DOCUMENT_VERIFICATION":
      return "Document Verification";
    case "PASSPORT_PROCESSING":
      return "Passport Processing";
    case "PASSPORT_APPROVED":
      return "Passport Approved";
    case "PASSPORT_ISSUED":
      return "Passport Issued";
    case "PASSPORT_DISPATCHED":
      return "Passport Dispatched";
    default:
      return s.replaceAll("_", " ");
  }
};

const pad = (n) => String(n).padStart(2, "0");

// DD-MM-YYYY
export function formatDate(value) {
  if (!value) return "-";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  const d = new Date(value);
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

// Friendly Date (e.g. 15 October 2026)
export function formatFriendlyDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const options = { day: "numeric", month: "long", year: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

// DD-MM-YYYY HH:mm
export function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  return `${formatDate(value)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Countdown string calculator
export function getDaysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
