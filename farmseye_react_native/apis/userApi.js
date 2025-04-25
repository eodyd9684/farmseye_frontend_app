import axios from "axios"
import { Platform } from "react-native";
import { axiosInstance } from "./axiosInstance";

//회원 목록 조회
export const api_user_list = () => {
  const response = axiosInstance.get(`/users/check`);
  return response;
}

//회원가입시 경로 호출
export const api_join = (joinData) => {
  const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
  const response = axios.post(`${baseURL}/users/join`, joinData);
  return response;
}

//로그인시 호출
export const api_login = (loginData) => {
  const response = axiosInstance.post(`/user/login`, loginData);
  return response;
}
