import { axiosInstance } from "./axiosInstance"

//내부시설 조회
export const api_envS = () => {
  const response = axiosInstance.get('/farms')
  return response
}

// 내부시설 조회
export const api_env = (userId) => {
  const response = axiosInstance.get(`/farms/${userId}`)
  return response
}

// 내부시설 수정
export const api_envUpdate = (userId, updatedEnv) => {
  return axiosInstance.put(`/farms/${userId}`, updatedEnv);
};
