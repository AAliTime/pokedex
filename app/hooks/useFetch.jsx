"use client";

import { useState, useEffect } from "react";

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message || "Error fetching data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}