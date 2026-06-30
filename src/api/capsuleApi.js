import { api } from "./client.js";

export const capsuleApi = {
  create(body) {
    return api.post("/api/capsules", body);
  },

  list() {
    return api.get("/api/capsules");
  },

  get(capsuleId) {
    return api.get(`/api/capsules/${capsuleId}`);
  },

  update(capsuleId, body) {
    return api.put(`/api/capsules/${capsuleId}`, body);
  },

  activate(capsuleId) {
    return api.patch(`/api/capsules/${capsuleId}/activate`);
  },

  remove(capsuleId) {
    return api.delete(`/api/capsules/${capsuleId}`);
  },

  assignReceiver(capsuleId, receiverId) {
    return api.post(`/api/capsules/${capsuleId}/receivers/${receiverId}`);
  },

  listAssignedReceivers(capsuleId) {
    return api.get(`/api/capsules/${capsuleId}/receivers`);
  },

  removeAssignedReceiver(capsuleId, receiverId) {
    return api.delete(`/api/capsules/${capsuleId}/receivers/${receiverId}`);
  },
};
