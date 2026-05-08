import BrandMark from "./BrandMark";

const AuthShell = ({ title, subtitle, children, asideTitle, asideCopy }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
    <div className="pointer-events-none absolute inset-0 subtle-grid opacity-25" />
    <div className="pointer-events-none absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-brand-400/12 blur-[100px]" />
    <div className="pointer-events-none absolute bottom-[-6%] right-[-4%] h-72 w-72 rounded-full bg-sky-400/10 blur-[110px]" />

    <div className="page-fade-in grid w-full max-w-6xl overflow-hidden rounded-[2rem] glass-panel lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden p-12 lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,201,122,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(160deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
        <div className="pointer-events-none absolute inset-0 subtle-grid opacity-20" />
        <div className="relative">
          <BrandMark className="mb-10" muted />
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.04] tracking-[-0.06em] text-white">
            {asideTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{asideCopy}</p>
        </div>
      </section>

      <section className="relative p-7 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="relative">
          <BrandMark className="lg:hidden" muted />
          <h2 className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white lg:mt-2">{title}</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">{subtitle}</p>
        </div>
        <div className="relative z-10 mt-8">{children}</div>
      </section>
    </div>
  </div>
);

export default AuthShell;
