import { Link } from 'react-router-dom'
import logo from '@/assets/icons/logo.png'
import { AUTH_GLOBE_VIDEO_URL, authBrandContent } from '../constants/authContent'

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden border-r border-[var(--color-border-soft)] bg-[#050b14] lg:block">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60 [object-position:center_center]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={AUTH_GLOBE_VIDEO_URL} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.76)_0%,rgba(5,11,20,0.34)_44%,rgba(5,11,20,0.9)_100%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.08)_0%,rgba(5,11,20,0.2)_42%,rgba(5,11,20,0.92)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col py-10 pl-[clamp(4rem,11vw,13rem)] pr-12">
        <Link
          to="/"
          className="inline-flex w-fit"
          aria-label={`Volver al inicio de ${authBrandContent.title}`}
        >
          <span className="flex h-16 w-16 items-center justify-center">
            <img
              src={logo}
              alt=""
              className="h-full w-full scale-[1.28] object-contain"
            />
          </span>
        </Link>

        <section className="mt-auto mb-[15vh] max-w-[33rem]">
          <p className="mb-4 text-lg font-semibold text-[rgba(226,232,240,0.72)]">
            {authBrandContent.eyebrow}
          </p>

          <h2 className="text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-white xl:text-[3.25rem]">
            {authBrandContent.title}
            <br />
            <span className="bg-[linear-gradient(120deg,var(--color-primary),#ff6b00_82%)] bg-clip-text text-transparent">
              {authBrandContent.highlightedTitle}
            </span>
          </h2>

          <p className="mt-6 max-w-[25rem] text-sm leading-6 text-[rgba(203,213,225,0.74)]">
            {authBrandContent.description}
          </p>

          <Link
            to="/"
            className="mt-2 inline-flex text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-text)]"
          >
            {authBrandContent.linkLabel}
          </Link>
        </section>
      </div>
    </aside>
  )
}
