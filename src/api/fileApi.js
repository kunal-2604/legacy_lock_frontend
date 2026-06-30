import { api } from "./client.js";

export const fileApi = {
  upload(capsuleId, file) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/api/capsules/${capsuleId}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  list(capsuleId) {
    return api.get(`/api/capsules/${capsuleId}/files`);
  },

  remove(capsuleId, fileId) {
    return api.delete(`/api/capsules/${capsuleId}/files/${fileId}`);
  },
};
