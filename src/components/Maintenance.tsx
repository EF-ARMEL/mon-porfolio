export default function Maintenance() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a090f] px-6 text-center text-white">
      <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF6A00]">
        Nousdev
      </span>
      <h1 className="mt-6 font-[family-name:var(--font-archivo)] text-[clamp(2.5rem,10vw,6rem)] uppercase leading-[0.9]">
        Site en<br />maintenance
      </h1>
      <p className="mt-6 max-w-md text-white/60">
        Je peaufine quelque chose. Reviens très vite — le portfolio sera de retour en ligne dans
        quelques instants.
      </p>
      <div className="mt-10 h-px w-40 bg-gradient-to-r from-[#FF6A00] to-[#FFD000]" aria-hidden />
    </main>
  );
}
