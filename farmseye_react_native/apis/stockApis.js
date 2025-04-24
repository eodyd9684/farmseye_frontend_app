import axios from "axios"
import { Platform } from "react-native"

export const api_stock = (stockInfo) => {
  const baseUrl = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
  const response = axios.get(`${baseUrl}/stock`)
  return response
}

export const api_stockUpdate = (updateInfo) => {
  const baseUrl = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
  const response = axios.put(`${baseUrl}/stock/${stockInfo.stockNum}`, updateInfo)
  return response
}

export const api_stockDelete = (updateInfo) => {
  const baseUrl = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
  const response = axios.delete(`${baseUrl}/stock/${stockInfo.stockNum}`, updateInfo)
  return response
}