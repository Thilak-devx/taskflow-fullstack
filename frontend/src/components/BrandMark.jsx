const BrandMark = ({ compact = false, muted = false, className = "" }) => {
  const textColor = muted ? "text-slate-200" : "text-white";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/10 bg-slate-950/90 shadow-glass">
        <div className="absolute inset-[1px] rounded-[1rem] bg-[radial-gradient(circle_at_top,rgba(34,201,122,0.24),transparent_48%),linear-gradient(160deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))]" />
        <div className="relative flex items-center gap-1">
          <span className="h-4 w-1 rounded-full bg-brand-400 shadow-[0_0_18px_rgba(34,201,122,0.42)]" />
          <span className="h-6 w-1 rounded-full bg-white/90" />
          <span className="h-3.5 w-1 rounded-full bg-sky-300/80" />
        </div>
      </div>

      {!compact ? (
        <div className="leading-none">
          <div className={`text-[1.02rem] font-semibold tracking-[-0.03em] ${textColor}`}>TaskFlow</div>
        </div>
      ) : null}
    </div>
  );
};

export default BrandMark;
