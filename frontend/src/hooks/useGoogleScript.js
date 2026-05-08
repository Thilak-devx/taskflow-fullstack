import { useEffect, useState } from "react";

const GOOGLE_SCRIPT_ID = "taskflow-google-script";

const useGoogleScript = () => {
  const [loaded, setLoaded] = useState(Boolean(window.google?.accounts?.id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setLoaded(true);
      return undefined;
    }

    let cancelled = false;
    let script = document.getElementById(GOOGLE_SCRIPT_ID);

    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      if (!cancelled) {
        setLoaded(true);
      }
    };

    const handleError = () => {
      if (!cancelled) {
        setError("Google sign-in could not be loaded right now.");
      }
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, []);

  return { loaded, error };
};

export default useGoogleScript;
