import { useState, useEffect } from "react";
import { getFetch } from "./fetchUtils";

export default (initialUrl, initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
  
      try {
        const response = await getFetch(url);
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith("application/json")) {
          setData(await response.json());
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      }
  
      setIsLoading(false);
    };
  
    useEffect(() => {
      fetchData();
    }, [url]);
  
    const doGet = (url) => {
      setUrl(url);
    };
  
    return { data, isLoading, isError, doGet };
  };