import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

console.log(process.env.REACT_APP_API_URL);

export default api;
