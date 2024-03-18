import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 300000
  });

export default instance;

const instance2 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL2}`,
  timeout: 300000
});

export {instance2};