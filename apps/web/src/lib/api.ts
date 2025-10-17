import axios from "axios";

// Use environment variable for API URL, fallback to relative for development proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", // Empty for dev proxy, set in production
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for Better Auth cookies
});

export const todoApi = {
  getTodos: async () => {
    const response = await api.get("/api/todos");
    return response.data;
  },

  createTodo: async (todo: { title: string }) => {
    const response = await api.post("/api/todos", todo);
    return response.data;
  },

  updateTodo: async (
    id: string,
    updates: { completed?: boolean; title?: string }
  ) => {
    const response = await api.put(`/api/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await api.delete(`/api/todos/${id}`);
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/api/auth/sign-in/email", credentials);
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await api.post("/api/auth/sign-up/email", userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/api/auth/sign-out");
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/api/auth/session");
    return response.data?.user;
  },
};
