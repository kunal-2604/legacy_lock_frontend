import { api } from "./client.js";

export const receiverApi = {
  create(body) {
    return api.post("/api/receivers", body);
  },

  list() {
    return api.get("/api/receivers");
  },

  get(receiverId) {
    return api.get(`/api/receivers/${receiverId}`);
  },

  update(receiverId, body) {
    return api.put(`/api/receivers/${receiverId}`, body);
  },

  remove(receiverId) {
    return api.delete(`/api/receivers/${receiverId}`);
  },
};
