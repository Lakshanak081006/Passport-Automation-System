import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { getAllApplications, getStats } from "../services/applicationService";
import { errorMessage } from "../services/api";
import { formatDate, formatDateTime } from "../utils/format";

const cards = [
  ["TOTAL", "Total Applications"],
  ["SUBMITTED", "Submitted"],
  ["UNDER_REVIEW", "Under Review"],
  ["DOCUMENT_VERIFICATION", "Document Verification"],
  ["APPROVED", "Approved"],
  ["REJECTED", "Rejected"],
  ["COMPLETED", "Completed"],
];

export default function StatusChangerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (term = "") => {
    setLoading(true);
    setError("");
    try {
      const [s, apps] = await Promise.all([getStats(), getAllApplications(term)]);
      setStats(s);
      setApplications(apps);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const clearSearch = () => {
    setSearch("");
    load("");
  };

  return (
    <div>
      <h1 className="page-title">Status Changer Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stat-grid">
        {cards.map(([key, label]) => (
          <div key={key} className={`card stat stat-${key}`}>
            <label>{label}</label>
            <p className="big">{stats[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-header">
          <h3 className="card-title">Applications</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              placeholder="Search by ID, name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary btn-sm">Search</button>
            {search && <button type="button" className="btn btn-secondary btn-sm" onClick={clearSearch}>Clear</button>}
          </form>
        </div>

        {loading ? (
          <Loading />
        ) : applications.length === 0 ? (
          <p className="muted">No applications found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th><th>Applicant Name</th><th>Email</th>
                  <th>Submission Date</th><th>Current Status</th><th>Last Updated</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.applicationNumber}</strong></td>
                    <td>{a.fullName}</td>
                    <td>{a.email}</td>
                    <td>{formatDate(a.createdAt)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>{formatDateTime(a.updatedAt)}</td>
                    <td className="row-actions">
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/status-changer/application/${a.id}`)}>View</button>
                      <button className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/status-changer/application/${a.id}?focus=update`)}>Update Status</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
