import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import client from "../api/client";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const [phone, setPhone] = useState(null);
  const [profileToken, setProfileToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setOrRemove = useCallback((key, value) => {
    if (value != null) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }, []);

  // Same two keys client.js's interceptor reads/writes on silent refresh -
  // keeping the constants here instead of hardcoded strings in both files
  // is what prevents this exact class of bug from recurring.
  const setAuthTokens = useCallback(
    (accessToken, refreshToken) => {
      setOrRemove(ACCESS_TOKEN_KEY, accessToken);
      setOrRemove(REFRESH_TOKEN_KEY, refreshToken);
      setToken(accessToken);
      return accessToken ? jwtDecode(accessToken) : null;
    },
    [setOrRemove]
  );

  const logout = useCallback(() => {
    setAuthTokens(null, null);
    setUser(null);
    setPhone(null);
    setProfileToken(null);
  }, [setAuthTokens]);

  // Bootstrap runs once on load - separate job from client.js's interceptor,
  // which only reacts to a 401 on an already-in-flight request. This proactively
  // establishes whether there's a valid session at all before anything else runs.
  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      try {
        setIsLoading(true);

        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) return;

        console.log("inside effect");
        
        const { data } = await client.post("/auth/refresh", { refreshToken });
        if (cancelled) return;
         console.log("inside effect data ----->", data);

        setAuthTokens(data.accessToken, data.refreshToken);

        const userResponse = await client.get("/users/me");
        console.log("inside effect userResponse ----->", userResponse);
        if (cancelled) return;

        setUser(userResponse.data);
      } catch (error) {
        if (cancelled) return;
        console.error("Authentication bootstrap failed:", error);
        // logout();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    bootstrapAuth();
    return () => {
      cancelled = true;
    };
  }, [setAuthTokens, logout]);

  // Admin login - your backend's /auth/admin/login returns a plain
  // { accessToken, refreshToken } object, no separate user payload. The
  // decoded JWT is the only identity info available right after login.
  const adminLogin = useCallback(
    async (username, password) => {
      const { data } = await client.post("/auth/admin/login", { username, password });
 console.log("userResponse--->>>>",data);
      const decodedUser = setAuthTokens(data[0].accessToken, data[0].refreshToken);
      setUser(data[1]);
      console.log("userResponse--->>>>",decodedUser);
      

      return decodedUser;
    },
    [setAuthTokens]
  );

  const requestOtpAuth = useCallback(async (phoneNumber) => {
    const { data } = await client.post("/auth/otp/request", { phone: phoneNumber });
    setPhone(phoneNumber);
    return data;
  }, []);

  const verifyOtpAuth = useCallback(
    async (otp) => {
      const { data } = await client.post("/auth/otp/verify", { phone, otp });

      if (data.status === "LOGGED_IN") {
        const decodedUser = setAuthTokens(data.tokens.accessToken, data.tokens.refreshToken);
        setUser(decodedUser);
        setPhone(null);
        return data;
      }

      setProfileToken(data.pendingProfileToken);
      return data;
    },
    [phone, setAuthTokens]
  );

  const completeProfile = useCallback(
    async ({ name, email }) => {
      const { data } = await client.post(
        "/auth/complete-profile",
        { name, email },
        { headers: { Authorization: `Bearer ${profileToken}` } }
      );

      const decodedUser = setAuthTokens(data.accessToken, data.refreshToken);
      setUser(decodedUser);

      setProfileToken(null);
      setPhone(null);

      return data;
    },
    [profileToken, setAuthTokens]
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      requestOtpAuth,
      verifyOtpAuth,
      completeProfile,
      adminLogin,
      logout,
    }),
    [user, isLoading, requestOtpAuth, verifyOtpAuth, completeProfile, adminLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}





















// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import client from "../api/client";

// const AuthContext = createContext(null);

// const ACCESS_TOKEN_KEY = "token";
// const REFRESH_TOKEN_KEY = "refresh";

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() =>
//     localStorage.getItem(ACCESS_TOKEN_KEY)
//   );

//   const [phone, setPhone] = useState(null);
//   const [profileToken, setProfileToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // -----------------------------
//   // Local storage helper
//   // -----------------------------

//   const setOrRemove = useCallback((key, value) => {
//     if (value != null) {
//       localStorage.setItem(key, value);
//     } else {
//       localStorage.removeItem(key);
//     }
//   }, []);

//   // -----------------------------
//   // Store authentication tokens
//   // -----------------------------

//   const setAuthTokens = useCallback(
//     (accessToken, refreshToken) => {
//       setOrRemove(ACCESS_TOKEN_KEY, accessToken);
//       setOrRemove(REFRESH_TOKEN_KEY, refreshToken);
    
//       setToken(accessToken);
//     },
//     [setOrRemove]
//   );

//   // -----------------------------
//   // Logout
//   // -----------------------------

//   const logout = useCallback(() => {
//     setAuthTokens(null, null);

//     setUser(null);
//     setPhone(null);
//     setProfileToken(null);
//   }, [setAuthTokens]);

//   // -----------------------------
//   // Bootstrap authentication
//   // -----------------------------

//   useEffect(() => {
//     let cancelled = false;

//     const bootstrapAuth = async () => {
//       try {
//         setIsLoading(true);

//         const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

//         // No refresh token -> user is not authenticated
//         if (!refreshToken) {
//           return;
//         }

//         // Get new access token
//         const { data } = await client.post("/auth/refresh", {
//           refreshToken,
//         });

//         if (cancelled) return;

//         // Store new tokens
//         setAuthTokens(
//           data.accessToken,
//           data.refreshToken
//         );

//         // Get current user
//         const userResponse = await client.get("/users/me");

//         if (cancelled) return;

//         setUser(userResponse.data);
//       } catch (error) {
//         if (cancelled) return;

//         console.error("Authentication bootstrap failed:", error);

//         // logout();
//       } finally {
//         if (!cancelled) {
//           setIsLoading(false);
//         }
//       }
//     };

//     bootstrapAuth();

//     return () => {
//       cancelled = true;
//     };
//   }, [setAuthTokens, logout]);

//   // -----------------------------
//   // Admin login
//   // -----------------------------

//   const adminLogin = useCallback(
//     async (username, password) => {
//       const { data } = await client.post("/auth/admin/login", {
//         username,
//         password,
//       });

//       const [tokens, loggedInUser] = data;

//       setAuthTokens(
//         tokens.accessToken,
//         tokens.refreshToken
//       );

//       setUser(loggedInUser);

//       return loggedInUser;
//     },
//     [setAuthTokens]
//   );

//   // -----------------------------
//   // Request OTP
//   // -----------------------------

//   const requestOtpAuth = useCallback(
//     async (phoneNumber) => {
//       const { data } = await client.post(
//         "/auth/otp/request",
//         {
//           phone: phoneNumber,
//         }
//       );

//       setPhone(phoneNumber);

//       return data;
//     },
//     []
//   );

//   // -----------------------------
//   // Verify OTP
//   // -----------------------------

//   const verifyOtpAuth = useCallback(
//     async (otp) => {
//       const { data } = await client.post(
//         "/auth/otp/verify",
//         {
//           phone,
//           otp,
//         }
//       );

//       if (data.status === "LOGGED_IN") {
//         setAuthTokens(
//           data.tokens.accessToken,
//           data.tokens.refreshToken
//         );

//         setPhone(null);

//         return data;
//       }

//       setProfileToken(data.pendingProfileToken);

//       return data;
//     },
//     [phone, setAuthTokens]
//   );

//   // -----------------------------
//   // Complete profile
//   // -----------------------------

//   const completeProfile = useCallback(
//     async ({ name, email }) => {
//       const { data } = await client.post(
//         "/auth/complete-profile",
//         {
//           name,
//           email,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${profileToken}`,
//           },
//         }
//       );

//       setAuthTokens(
//         data.accessToken,
//         data.refreshToken
//       );

//       setProfileToken(null);
//       setPhone(null);

//       return data;
//     },
//     [profileToken, setAuthTokens]
//   );

//   // -----------------------------
//   // Context value
//   // -----------------------------

//   const value = useMemo(
//     () => ({
//       user,
//       setUser,
//       isLoading,
//       requestOtpAuth,
//       verifyOtpAuth,
//       completeProfile,
//       adminLogin,
//       logout,
//     }),
//     [
//       user,
//       isLoading,
//       requestOtpAuth,
//       verifyOtpAuth,
//       completeProfile,
//       adminLogin,
//       logout,
//     ]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error(
//       "useAuth must be used inside AuthProvider"
//     );
//   }

//   return ctx;
// }