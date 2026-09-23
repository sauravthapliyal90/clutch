import axios from "axios";


const client = axios.create({
    baseURL: `${import.meta.env.VITE_CLIENT_API}/api/v1`,
    headers: {"Content-Type":"application/json"}
})

client.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token"||"");
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
})

export default client;