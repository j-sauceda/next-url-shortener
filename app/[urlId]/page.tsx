"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export interface IRedirectUrl {
  url: string;
}

const ShortLink: FC = () => {
  const [data, setData] = useState<IRedirectUrl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const { urlId } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/${urlId}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching short link", error);
      }
    };
    fetchData();

    if (data) {
      window.location.href = data.url;
      setIsLoading(false);
    }
  }, [data, urlId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl">Loading... please wait</h1>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">
          Check your Network Connection or refresh the page
        </p>
      </div>
    );
  }

  return null;
};

export default ShortLink;
