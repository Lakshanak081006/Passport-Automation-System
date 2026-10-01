import api from "./api";

// ---- Applicant ----
export const getProfile = () => api.get("/applicant/profile").then((r) => r.data);

// Returns the application, or null when the applicant has not applied yet (HTTP 204)
export const getMyApplication = () =>
  api.get("/applicant/application").then((r) => (r.data ? r.data : null));

export const submitApplication = (data) =>
  api.post("/applicant/application", data).then((r) => r.data);

export const getMyHistory = () => api.get("/applicant/application/history").then((r) => r.data);

export const getMyVerification = () =>
  api.get("/verification/my-appointment").then((r) => r.data).catch(() => null);

// ---- Status changer / Admin ----
export const getStats = () => api.get("/status-changer/stats").then((r) => r.data);

export const getAllApplications = (search = "") =>
  api.get("/status-changer/applications", { params: search ? { search } : {} }).then((r) => r.data);

export const getApplicationById = (id) =>
  api.get(`/status-changer/applications/${id}`).then((r) => r.data);

export const updateStatus = (id, newStatus, remarks) =>
  api.put(`/status-changer/applications/${id}/status`, { newStatus, remarks }).then((r) => r.data);

export const getApplicationHistory = (id) =>
  api.get(`/status-changer/applications/${id}/history`).then((r) => r.data);

// ---- Verification APIs ----
export const scheduleVerification = (data) =>
  api.post("/verification", data).then((r) => r.data);

export const getVerificationByApplicationId = (applicationId) =>
  api.get(`/verification/application/${applicationId}`).then((r) => r.data).catch(() => null);

export const rescheduleVerification = (id, data) =>
  api.put(`/verification/${id}/reschedule`, data).then((r) => r.data);

export const completeVerification = (id, remarks) =>
  api.put(`/verification/${id}/complete`, { remarks }).then((r) => r.data);

export const cancelVerification = (id, reason) =>
  api.put(`/verification/${id}/cancel`, { reason }).then((r) => r.data);
