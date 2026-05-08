import { useEffect, useRef } from "react";
import useGoogleScript from "../hooks/useGoogleScript";

const GoogleSignInButton = ({ onCredential, loading }) => {
  const containerRef = useRef(null);
  const { loaded, error } = useGoogleScript();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!loaded || !clientId || !containerRef.current || !window.google?.accounts?.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => onCredential(credential)
    });

    containerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 320
    });
  }, [clientId, loaded, onCredential]);

  if (!clientId) {
    return null;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  return (
    <div className="relative">
      <div className="flex justify-center rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-3 shadow-glass">
        <div ref={containerRef} />
      </div>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/75 text-sm text-slate-200">
          Connecting Google account...
        </div>
      ) : null}
    </div>
  );
};

export default GoogleSignInButton;
