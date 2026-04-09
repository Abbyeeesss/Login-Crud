import axios from "./axios.js";

export const getTasksRequest = () => axios.get("/tasks");

export const getTaskRequest = (id) =>
  axios.get(`/tasks/${encodeURIComponent(String(id))}`);

export const createTaskRequest = (data) => axios.post("/tasks", data);

export const updateTaskRequest = (id, data) =>
  axios.put(`/tasks/${encodeURIComponent(String(id))}`, data);

export const deleteTaskRequest = (id) =>
  axios.delete(`/tasks/${encodeURIComponent(String(id))}`);
