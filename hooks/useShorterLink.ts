import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const useShorterLink = () => {
  const { getAccessToken } = useContext(AuthContext);

  const shortenLink = async (originalUrl: string) => {
    try {
      const token = getAccessToken();
      const body = { originalUrl };
      const authHeaders = new Headers();
      authHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch("/api/short", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { shortenLink };
};

export default useShorterLink;
