import { api } from "./client.js";

export const releaseApi = {
  createPolicy(capsuleId, body) {
    return api.post(`/api/capsules/${capsuleId}/release-policy`, body);
  },

  getPolicy(capsuleId) {
    return api.get(`/api/capsules/${capsuleId}/release-policy`);
  },

  updatePolicy(capsuleId, body) {
    return api.put(`/api/capsules/${capsuleId}/release-policy`, body);
  },

  pausePolicy(capsuleId) {
    return api.patch(`/api/capsules/${capsuleId}/release-policy/pause`);
  },

  activatePolicy(capsuleId) {
    return api.patch(`/api/capsules/${capsuleId}/release-policy/activate`);
  },

  getReleaseStatus(capsuleId) {
    return api.get(`/api/owner/capsules/${capsuleId}/release-status`);
  },
};
