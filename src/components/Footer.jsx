function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

          <div>
            <h2 className="text-lg font-bold">MJPCSU</h2>
            <p className="mt-1 text-sm text-slate-400">
              Modern Jurassic Park Central Student's Union
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 MJPCSU. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;