import { useEffect } from "react";
import { X } from "lucide-react";
import BrandMark from "./BrandMark";

const ModalShell = ({ open, onClose, title, subtitle, children, width = "max-w-2xl" }) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-xl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`modal-pop glass-panel w-full ${width} rounded-[2rem] p-6 sm:p-7`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <BrandMark compact className="mb-5" />
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
            {subtitle ? <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
