import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store'


export const axiosInstance = axios.create({
  // OS에 따라서 경로 지정 (android는 10.0.2.2:8080임)
  baseURL : Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
});

//요청시 실행할 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {

    config.headers.clientType = 'app';

    const token = await SecureStore.getItemAsync('accessToken');

    if(token){
      config.headers.Authorization = token;
    }
    return config
  },
  error => Promise.reject(error)
);
