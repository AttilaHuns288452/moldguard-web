import { navigate } from '../lib/route'

/**
 * A real not-found page. Before this, pageFromLocation() fell back to 'home', so
 * https://moldguard-web.vercel.app/anything served the home page with HTTP 200 -
 * a soft 404 that looked fine to the visitor and told a crawler nothing was wrong.
 *
 * Two exits, and the nav still works: a mistyped URL should not dead-end.
 */
export default function NotFound() {
  return (
    <section id="not-found" className="shell flex min-h-[62vh] flex-col justify-center py-20">
      <p className="measure text-[12px] font-[650] tracking-[0.12em] text-ink-3 uppercase">404</p>
      <h1 className="mt-3 max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.03em] text-deep">
        That page isn’t here.
      </h1>
      <p className="lede mt-4 max-w-[46ch]">
        The link may be out of date, or the address may have a typo. Everything about
        MoldGuard is one click away.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex min-h-11 items-center rounded-btn bg-accent-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-deep"
        >
          Back to home
        </button>
        <button
          type="button"
          onClick={() => navigate('download')}
          className="inline-flex min-h-11 items-center rounded-btn border border-line-hi bg-card px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3"
        >
          Get the app
        </button>
      </div>
    </section>
  )
}
