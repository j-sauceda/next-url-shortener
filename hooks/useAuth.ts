import { useContext, useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthContext } from "@/context/AuthContext";

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface ITokenPayload extends JwtPayload {
  email: string;
}

interface IUserCredentials {
  email: string;
  password: string;
}

const useAuth = () => {
  const {
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
  } = useContext(AuthContext);

  const signup = async (credentials: IUserCredentials) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      const data = (await response.json()) satisfies ILoginResponse;

      if (data.error) {
        return Promise.reject(data.error);
      }

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const decodedToken = jwtDecode<ITokenPayload>(accessToken);

      setUser({ id: decodedToken.sub!, email: decodedToken.email });
      setIsAuthenticated("true");

      return Promise.resolve();
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError(JSON.stringify(error));
      setIsAuthenticated("false");

      return Promise.reject(error);
    }
  };

  const login = async (credentials: IUserCredentials) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      const data = (await response.json()) satisfies ILoginResponse;

      if (data.error) {
        return Promise.reject(data.error);
      }

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const decodedToken = jwtDecode<ITokenPayload>(accessToken);

      setUser({ id: decodedToken.sub!, email: decodedToken.email });
      setIsAuthenticated("true");

      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(JSON.stringify(error));
      setIsAuthenticated("false");

      return Promise.reject(error);
    }
  };

  const logout = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const authHeaders = new Headers();
    authHeaders.append("Authorization", `Bearer ${refreshToken}`);
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: authHeaders,
    });

    const data = await response.json();
    if (data.error) {
      setAuthError(data.error);
    }

    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    setIsAuthenticated("false");
  };

  const refresh = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const authHeaders = new Headers();
        authHeaders.append("Authorization", `Bearer ${refreshToken}`);
        const response = await fetch("/api/refresh", {
          method: "POST",
          headers: authHeaders,
        });

        const data = (await response.json()) satisfies Partial<ILoginResponse>;

        if (data.error) {
          return Promise.reject(data.error);
        }

        const newToken = data.accessToken;
        const decodedToken = jwtDecode<ITokenPayload>(newToken);

        setAccessToken(newToken);
        setUser({ id: decodedToken.sub!, email: decodedToken.email });
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      setAuthError(JSON.stringify(error));
      setIsAuthenticated("false");

      return Promise.reject(error);
    }
  };

  return {
    signup,
    login,
    logout,
    refresh,
  };
};

export default useAuth;
