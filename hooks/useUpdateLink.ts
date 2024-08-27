import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const useUpdateLink = () => {
  const { getAccessToken } = useContext(AuthContext);

  const updateLink = async (originalUrl: string, urlId: string) => {
    try {
      const token = getAccessToken();
      const body = { urlId, originalUrl };
      const authHeaders = new Headers();
      authHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch("/api/update", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { updateLink };
};

export default useUpdateLink;
