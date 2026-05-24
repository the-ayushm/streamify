import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL

if (!serverUrl) {
  throw new Error('VITE_SERVER_URL is required. Set it to your deployed backend URL.')
}

 const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true
})
export default api;
