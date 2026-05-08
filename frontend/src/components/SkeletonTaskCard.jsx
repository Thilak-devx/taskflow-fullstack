const SkeletonTaskCard = () => (
  <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-panel">
    <div className="h-5 w-24 rounded-full bg-slate-800" />
    <div className="mt-4 h-7 w-3/4 rounded-xl bg-slate-800" />
    <div className="mt-4 h-4 w-full rounded bg-slate-800" />
    <div className="mt-2 h-4 w-5/6 rounded bg-slate-800" />
    <div className="mt-8 flex justify-between">
      <div className="h-4 w-24 rounded bg-slate-800" />
      <div className="h-8 w-20 rounded-full bg-slate-800" />
    </div>
  </div>
);

export default SkeletonTaskCard;
