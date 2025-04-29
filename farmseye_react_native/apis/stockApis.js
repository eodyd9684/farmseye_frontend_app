import axios from "axios"
import { Platform } from "react-native"
import { axiosInstance } from "./axiosInstance"

export const api_stock = () => {
  const response = axiosInstance.get(`/stock`)
  return response
}

export const api_stocInsert = (stockData) => {
  const response = axiosInstance.post(`/stock/join`, stockData)
  return response
}

export const api_stockDetail = (stockNum) =>{
  const response = axiosInstance.get(`/stock/${stockNum}`)
  return response
}

export const api_stockUpdate = (updateInfo) => {
  const response = axiosInstance.put(`/stock/${updateInfo.stockNum}`, updateInfo)
  return response
}

export const api_stockDelete = (updateInfo) => {
  const response = axiosInstance.delete(`/stock/${updateInfo.stockNum}`)
  return response
}