import { useState, useEffect, useLayoutEffect, useRef } from "react";

const useFetch = (url, init = {}) => {
  const fetchData = (url, init, signal, setState) => {
    const actualInit = { ...init, signal };

    fetch(url, actualInit)
      .then(rsp =>
        rsp.ok
          ? Promise.resolve(rsp)
          : Promise.reject({
              message: rsp.statusText,
              status: rsp.status
            })
      )
      .then(rsp => rsp.json())
      .then(data => {
        setState(oldState => ({
          ...oldState,
          data,
          loading: oldState.loading - 1
        }));
      })
      .catch(err => {
        const error = err.name !== "AbortError" ? err : null;

        setState(oldState => ({
          ...oldState,
          error,
          loading: oldState.loading - 1
        }));
      });
  };

  const [state, setState] = useState({
    data: null,
    loading: 0,
    error: null,
    controller: null
  });

  const isMounted = useRef(false);
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (url) {
      setState(oldState => ({
        data: null,
        loading: oldState.loading + 1,
        error: null,
        controller
      }));

      fetchData(url, init, controller.signal, state => {
        if (isMounted.current) {
          setState(state);
        }
      });
    }

    return () => controller.abort();
  }, [url]);

  return {
    data: state.data,
    loading: !!state.loading,
    error: state.error,
    abort: () => state.controller && state.controller.abort()
  };
};

export default useFetch;
