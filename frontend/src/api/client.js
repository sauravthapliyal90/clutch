import axios from "axios";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_CLIENT_API}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// One shared refresh operation for the whole app.
// AuthProvider and the Axios interceptor both use this.
let refreshPromise = null;

export async function refreshAccessToken() {
  // If another refresh request is already running,
  // wait for that same request instead of creating another one.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      return null;
    }

    try {
      // IMPORTANT:
      // Use plain axios here, not `client`.
      // Otherwise a 401 from /auth/refresh could trigger
      // the interceptor recursively.
      const res = await axios.post(
        `${import.meta.env.VITE_CLIENT_API}/api/v1/auth/refresh`,
        { refreshToken }
      );

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refresh", res.data.refreshToken);

      return res.data;
    } catch (error) {
      // Refresh token is invalid, expired, or already revoked.
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      throw error;
    } finally {
      // After this refresh finishes, a future refresh is allowed.
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Add the current access token to every normal API request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If an API request gets 401:
// 1. Refresh the access token.
// 2. Retry the original request once.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      try {
        // This is shared with AuthProvider.
        // Multiple callers will wait for the same refresh request.
        const data = await refreshAccessToken();

        if (data?.accessToken) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.accessToken}`;

          return client(original);
        }
      } catch {
        // Refresh failed. Reject the original request below.
      }
    }

    return Promise.reject(error);
  }
);

export default client;































// import axios from "axios";

// const client = axios.create({
//   baseURL: `${import.meta.env.VITE_CLIENT_API}/api/v1`,
//   headers: { "Content-Type": "application/json" },
// });

// client.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // On a 401, try refreshing once, then retry the original request.
// let refreshPromise = null;

// client.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;

//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;

//       try {
//         if (!refreshPromise) {
//           refreshPromise = refreshAccessToken();
//         }
//         const newToken = await refreshPromise;
//         refreshPromise = null;

//         if (newToken) {
//           original.headers.Authorization = `Bearer ${newToken}`;
//           return client(original);
//         }
//       } catch {
//         // fall through to reject below
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// async function refreshAccessToken() {
//   const refreshToken = localStorage.getItem("refresh");
//   if (!refreshToken) return null;

//   try {
//     const res = await axios.post(
//       `${import.meta.env.VITE_CLIENT_API}/api/v1/auth/refresh`,
//       { refreshToken }
//     );
//     console.log("res======>",res);
    
//     localStorage.setItem("token", res.data.accessToken);
//     localStorage.setItem("refresh", res.data.refreshToken);
//     return res.data.accessToken;
//   } catch {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refresh");
//     return null;
//   }
// }

// export default client;













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