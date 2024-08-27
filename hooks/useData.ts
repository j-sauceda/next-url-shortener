import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";

export interface IUrl {
  _id: string;
  urlId: string;
  originalUrl: string;
  clicks: number;
  date: string;
  __v?: number;
}

const useData = () => {
  const [data, setData] = useState<Array<IUrl>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const token = getAccessToken();
        const authHeaders = new Headers();
        authHeaders.append("Authorization", `Bearer ${token}`);

        const response = await fetch("/api/links", {
          method: "GET",
          headers: authHeaders,
        });
        const data = await response.json();
        setData(data.items);
      } catch (error) {
        setError(JSON.stringify(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAccessToken]);

  return { data, error, isLoading };
};

export default useData;
