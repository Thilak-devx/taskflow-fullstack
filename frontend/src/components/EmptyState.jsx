const EmptyState = ({ title, description, action }) => (
  <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-slate-950/45 p-12 text-center shadow-glass">
    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
    {description ? <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">{description}</p> : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
