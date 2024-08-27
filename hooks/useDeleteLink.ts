import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const useDeleteLink = () => {
  const { getAccessToken } = useContext(AuthContext);

  const deleteLink = async (urlId: string) => {
    try {
      const token = getAccessToken();
      const body = { urlId };
      const authHeaders = new Headers();
      authHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      await response.json();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { deleteLink };
};

export default useDeleteLink;
