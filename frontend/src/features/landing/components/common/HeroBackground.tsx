export function HeroBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* Base profunda con identidad azul/cian */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_18%_18%,rgba(11,127,195,0.24),transparent_58%),radial-gradient(ellipse_70%_55%_at_86%_12%,rgba(56,189,248,0.1),transparent_54%),radial-gradient(ellipse_80%_70%_at_50%_100%,rgba(2,6,23,0.96),transparent_72%)]" />

            {/* Aurora premium */}
            <div className="absolute left-1/2 top-[-18rem] h-[44rem] w-[78rem] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,rgba(11,127,195,0.18),rgba(56,189,248,0.12),rgba(96,165,250,0.08))] opacity-90 blur-3xl motion-safe:animate-[codenix-aurora_18s_ease-in-out_infinite]" />

            {/* Campo de estrellas premium */}
            <div className="codenix-starfield absolute inset-0" />
            <div className="codenix-starfield-soft absolute inset-0" />

            {/* Meteoros: pocos, lentos, elegantes */}
            <span className="codenix-meteor codenix-meteor-one" />
            <span className="codenix-meteor codenix-meteor-two" />
            <span className="codenix-meteor codenix-meteor-three" />

            {/* Señales diagonales muy sutiles */}
            <div className="absolute left-[7%] top-[20%] h-px w-[34rem] rotate-[-12deg] bg-gradient-to-r from-transparent via-[rgba(11,127,195,0.18)] to-transparent" />
            <div className="absolute right-[3%] top-[34%] h-px w-[28rem] rotate-[10deg] bg-gradient-to-r from-transparent via-[rgba(56,189,248,0.14)] to-transparent" />

            {/* Pulso superior */}
            <div className="absolute left-1/2 top-0 h-px w-[78rem] -translate-x-1/2 overflow-hidden opacity-75">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] motion-safe:animate-[codenix-data-pulse_4s_linear_infinite]" />
            </div>

            {/* Capas de marca */}
            <div className="absolute -left-28 top-4 h-[32rem] w-[32rem] rounded-full bg-[rgba(11,127,195,0.23)] blur-3xl motion-safe:animate-[codenix-orbit-a_20s_ease-in-out_infinite]" />
            <div className="absolute -right-32 top-8 h-[30rem] w-[30rem] rounded-full bg-[rgba(56,189,248,0.1)] blur-3xl motion-safe:animate-[codenix-orbit-b_24s_ease-in-out_infinite]" />

            {/* Halo inferior */}
            <div className="absolute bottom-0 left-1/2 h-px w-[66rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(11,127,195,0.24)] to-transparent" />
            <div className="absolute bottom-[-18rem] left-1/2 h-[28rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(11,127,195,0.12),transparent_68%)] blur-3xl" />

            {/* Viñeta final para legibilidad */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_24%,transparent,rgba(2,6,23,0.8)_84%)]" />
        </div>
    )
}
