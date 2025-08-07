import axios from "axios";
import NProgress from "nprogress";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
}, (error) => {
  NProgress.done();
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default instance;