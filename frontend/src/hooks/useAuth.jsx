import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [phone, setPhone] = useState(null)
  const [profileToken, setProfileToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null);

  const setTokenFun = useCallback((next) => {
    if (next) localStorage.setItem("token", next)
    else localStorage.removeItem("token")
    setToken(next)
  }, [])

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setUser(null)
      setIsLoading(false);
      return;
    }
    setIsLoading(true)
    console.log("inside useEffect", setIsLoading)
    client
      .get('/users/me')
      .then(({ data }) => {
        if (cancelled) return;
        
        setUser(data)
        console.log("data - ",data);
        
      })
      .catch(() => {
        if (cancelled) return
        setTokenFun(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true;
    }
  }, [token, setTokenFun])

  const requestOtpAuth = useCallback(async (phone) => {
    console.log("phone", phone)
    const { data } = await client.post("/auth/otp/request", { phone });
    console.log("data", data)
    setPhone(phone);
    return data;
  })

  const verifyOtpAuth = useCallback(async (otp) => {
    console.log("phone, otp:", phone, otp);

    const { data } = await client.post("/auth/otp/verify", { phone, otp });

     if (data.status === 'LOGGED_IN') {
       console.log("profile completed", data)     
       setTokenFun(data.tokens.accessToken)
      return data;
    }
   setProfileToken(data.pendingProfileToken)
    return data;
  }, [ phone])

  const completeProfile = useCallback(async ({name, email}) => {
    console.log("profileToken changed:", profileToken);
    const { data } = await client.post("/auth/complete-profile", { name, email }, {
      headers: {
        Authorization: `Bearer ${profileToken}`,
      },
    })
    setTokenFun(data.accessToken)
    return data;
  },[ profileToken, setTokenFun])


  return (
    <AuthContext.Provider value={{ token, user, setUser, isLoading, profileToken, requestOtpAuth, verifyOtpAuth, completeProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}