import axios from "axios";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_CLIENT_API}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try refreshing once, then retry the original request.
let refreshPromise = null;

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }
        const newToken = await refreshPromise;
        refreshPromise = null;

        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        }
      } catch {
        // fall through to reject below
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) return null;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_CLIENT_API}/api/v1/auth/refresh`,
      { refreshToken }
    );
    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("refresh", res.data.refreshToken);
    return res.data.accessToken;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    return null;
  }
}

export default client;













// import axios from "axios";


// const client = axios.create({
//     baseURL: `${import.meta.env.VITE_CLIENT_API}/api/v1`,
//     headers: {"Content-Type":"application/json"}
// })

// client.interceptors.request.use((config) =>{
//     const token = localStorage.getItem("token"||"");
//     if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//     return config;
// })

// export default client;