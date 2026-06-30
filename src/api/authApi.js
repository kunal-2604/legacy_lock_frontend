import { api } from "./client";

export const authApi = {
  register(body) {
    return api.post("/api/auth/register", body);
  },

  verifyEmail(token) {
    return api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  login(body) {
    return api.post("/api/auth/login", body);
  },

  forgotPassword(body) {
    return api.post("/api/auth/forgot-password", body);
  },

  resetPassword(body) {
    return api.post("/api/auth/reset-password", body);
  },

  refresh(body) {
    return api.post("/api/auth/refresh", body);
  },

  logout(body) {
    return api.post("/api/auth/logout", body);
  },

  googleLoginUrl() {
    return `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/oauth2/authorization/google`;
  },
};
