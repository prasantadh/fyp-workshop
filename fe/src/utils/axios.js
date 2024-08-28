import axios from "axios";

export const guestInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  // timeout: 1000,
});

// Function to get token from cookies
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const token = getCookie("tokenFromServer");

export const authenticAxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  // timeout: 1000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
