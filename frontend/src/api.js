import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL ?? `http://${window.location.hostname}:5000`

 const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true
})
export default api;
