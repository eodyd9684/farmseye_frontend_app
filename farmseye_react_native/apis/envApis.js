import { axiosInstance } from "./axiosInstance";


export const now_env = () => {
  const response = axiosInstance.get(`/farms/now`);
  return response;
}