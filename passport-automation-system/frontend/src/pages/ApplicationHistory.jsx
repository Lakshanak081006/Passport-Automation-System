import { useEffect, useState } from "react";
import HistoryTable from "../components/HistoryTable";
import Loading from "../components/Loading";
import { getMyHistory } from "../services/applicationService";
import { errorMessage } from "../services/api";

export default function ApplicationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyHistory()
      .then(setHistory)
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="page-title">Application History</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <HistoryTable history={history} />
      </div>
    </div>
  );
}
