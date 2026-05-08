import BrandMark from "./BrandMark";

const AppLoader = ({ label = "Loading TaskFlow..." }) => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="w-full max-w-md rounded-[2rem] glass-panel p-8 text-center">
      <div className="flex justify-center">
        <BrandMark compact />
      </div>
      <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-slate-800/90">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-brand-400 via-emerald-300 to-sky-300" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">{label}</h1>
    </div>
  </div>
);

export default AppLoader;
