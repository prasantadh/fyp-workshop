import axios from "axios";

export const guestInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 1000,
});
