const FormInput = ({ label, error, className = "", inputClassName = "", ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-2.5 block text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</span>
    <input
      className={`h-12 w-full rounded-2xl border px-4 text-[0.95rem] text-slate-100 outline-none transition ${
        error
          ? "border-rose-500/70 bg-rose-950/20 focus:border-rose-400"
          : "border-white/10 bg-slate-950/75 focus:border-brand-400 focus:bg-slate-950/95"
      } ${inputClassName}`}
      aria-invalid={Boolean(error)}
      {...props}
    />
    {error ? <span className="mt-2 block text-sm text-rose-400">{error}</span> : null}
  </label>
);

export default FormInput;
