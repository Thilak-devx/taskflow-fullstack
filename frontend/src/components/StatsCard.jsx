const StatsCard = ({ icon: Icon, label, value, hint, iconClassName = "text-emerald-300" }) => (
  <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5 shadow-glass backdrop-blur-xl transition hover:border-white/16 hover:bg-slate-950/70">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
        <Icon className={`h-4.5 w-4.5 ${iconClassName}`} />
      </div>
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
    <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">{value}</p>
    {hint ? <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{hint}</p> : null}
  </div>
);

export default StatsCard;
