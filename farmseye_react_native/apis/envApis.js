import { axiosInstance } from "./axiosInstance";

export const now_env = () => {
  const response = axiosInstance.get(`/farms/now`);
  return response;
}

// 내부시설 조회
export const api_env = () => {
  const response = axiosInstance.get(`/farms/minmax`)
  return response
}

// 내부시설 수정
export const api_envUpdate = ( updatedEnv ) => {
  return axiosInstance.put(`/farms/minmax`, updatedEnv);
};
