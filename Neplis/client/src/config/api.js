import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export default axiosInstance;

// 호출 시에는 index.js 파일의 상단에 networkService를 import 한다.

export const networkService = {
  setupInterceptors: () => {
    // request
    axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = localStorage.getItem("access-token");
        console.log("잘됨");
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // // response
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },

      (error) => {
        console.log("error ::", error);

        return Promise.reject(error);
      }
    );
  },
};