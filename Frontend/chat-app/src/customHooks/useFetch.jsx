import axios from "axios";
import { useState } from "react";

const useFetchApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchApi = async (url, body) => {
    setLoading(true);

    try {
      const response = await axios.post(url, body);

      if (!response) {
        throw new Error("something went wrong");
      }
      setData(response.data);
    } catch (err) {
      setError(err.response);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, fetchApi, setError };
};

export default useFetchApi;
