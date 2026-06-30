import { api } from "./client.js";

export const checkInApi = {
  create(body = {}) {
    return api.post("/api/check-ins", body);
  },

  list() {
    return api.get("/api/check-ins");
  },

  latest() {
    return api.get("/api/check-ins/latest");
  },
};
