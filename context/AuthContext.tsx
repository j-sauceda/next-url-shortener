"use client";

import { createContext, ReactNode, useState } from "react";

interface IUser {
  id: string;
  email: string;
}

interface IAuthContext {
  authError: string | null;
  getAccessToken: () => string;
  getIsAuthenticated: () => string;
  getRefreshToken: () => string;
  user: IUser | null;
  setAccessToken: (token: string) => void;
  setAuthError: (authError: string | null) => void;
  setIsAuthenticated: (isAuthenticated: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
  authError: null,
  getAccessToken: () => "",
  getIsAuthenticated: () => "false",
  getRefreshToken: () => "",
  user: null,
  setAccessToken: () => {},
  setAuthError: () => {},
  setIsAuthenticated: () => {},
  setRefreshToken: () => "",
  setUser: (user: IUser | null) => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const getIsAuthenticated = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("isAuthenticated") || "false";
    }
    return "false";
  };

  const getAccessToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("accessToken") || "";
    }
    return "";
  };

  const getRefreshToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("refreshToken") || "";
    }
    return "";
  };

  const setIsAuthenticated = (isAuth: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("isAuthenticated", isAuth);
    }
  };

  const setAccessToken = (newToken: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("accessToken", newToken);
    }
  };

  const setRefreshToken = (newToken: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("refreshToken", newToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authError,
        getAccessToken,
        getIsAuthenticated,
        getRefreshToken,
        user,
        setAccessToken,
        setAuthError,
        setIsAuthenticated,
        setRefreshToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
