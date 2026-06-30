import { api } from "./client.js";

export const receiverCapsuleApi = {
  listReleasedCapsules() {
    return api.get("/api/receiver/capsules");
  },

  getCapsule(capsuleId) {
    return api.get(`/api/receiver/capsules/${capsuleId}`);
  },

  listFiles(capsuleId) {
    return api.get(`/api/receiver/capsules/${capsuleId}/files`);
  },

  downloadFile(capsuleId, fileId) {
    return api.get(`/api/receiver/capsules/${capsuleId}/files/${fileId}/download`, {
      responseType: "blob",
    });
  },

  acknowledge(accessGrantId, body = {}) {
    return api.post(`/api/receiver/access-grants/${accessGrantId}/acknowledgement`, body);
  },

  getAcknowledgement(accessGrantId) {
    return api.get(`/api/receiver/access-grants/${accessGrantId}/acknowledgement`);
  },
};
