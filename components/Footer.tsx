export function Footer() {
  return (
    <footer className="mt-10 border-t border-[oklch(0.928_0.006_264.531)]/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-sm text-neutral-800">
        <div className="text-center text-neutral-700">© 2025 Book Trace · An Open Dev Society Project</div>
        <div className="mt-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="text-neutral-700">🌍 Knowledge belongs to everyone.</div>
          <nav className="flex flex-col md:flex-row md:items-center gap-4 text-neutral-800">
            <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://github.com/opendev-society" target="_blank" rel="noreferrer">GitHub</a>
            <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://discord.gg/" target="_blank" rel="noreferrer">Discord</a>
            <a className="relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:w-0 after:transition-all after:duration-300" href="https://x.com/" target="_blank" rel="noreferrer">Twitter</a>
            <a className="relative items-center justify-center px-2 w-auto py-2 rounded border bg-black text-white text-sm hover:opacity-90" href="#sponsor-us">Sponsor Us</a>
          </nav>
        </div>
        <div className="mt-10 text-xs text-neutral-600">
          Book Trace is an open-source project under Open Dev Society. We connect readers to knowledge — not files.
        </div>
      </div>
    </footer>
  );
}
