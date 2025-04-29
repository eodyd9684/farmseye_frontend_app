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

//회원 정보 수정시 로그인한 회원 정보 가져오는 함수
export const get_user = () => {
  const response = axiosInstance.get('/users/isUsable');
  return response;
}

//회원 이미지 테이블 정보 불러오는 함수
export const get_user_img =() => {
  const response = axiosInstance.get('/users/getImage');
  return response;
}

//회원 중복 검사를 위한 회원 목록 조회
export const get_user_list = () => {
  const response = axiosInstance.get('/users/check');
  return response;
}

export const update_user = (editData) => {
  const response = axiosInstance.put('/users', editData);
  return response;
}
