export const landingTokens = {
  color: {
    logo: 'bg-[var(--color-logo-mark)]',
    primaryText: 'text-[var(--color-primary)]',
    accentText: 'text-[var(--color-accent)]',
    successText: 'text-[var(--color-success)]',
    text: 'text-[var(--color-text)]',
    textSoft: 'text-[var(--color-text-soft)]',
    textMuted: 'text-[var(--color-text-muted)]',
    surface: 'bg-[var(--color-surface)]',
    surfaceSoft: 'bg-[var(--color-surface-soft)]',
    surfaceRaised: 'bg-[var(--color-surface-elevated)]',
    borderSoft: 'border-[var(--color-border-soft)]',
    border: 'border-[var(--color-border)]',
    borderStrong: 'border-[var(--color-border-strong)]',
  },
  radius: {
    sm: 'rounded-[var(--radius-sm)]',
    md: 'rounded-[var(--radius-md)]',
    lg: 'rounded-[var(--radius-lg)]',
    xl: 'rounded-[var(--radius-xl)]',
    panel: 'rounded-[var(--radius-2xl)]',
    full: 'rounded-[var(--radius-full)]',
  },
  shadow: {
    card: 'shadow-[var(--shadow-md)]',
    elevated: 'shadow-[var(--shadow-lg)]',
    floating: 'shadow-[var(--shadow-floating)]',
    primaryGlow: 'shadow-[var(--shadow-glow-primary)]',
  },
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
  transition: 'transition duration-200',
  nav: {
    shell:
      'sticky top-0 z-50 border-b border-[var(--color-glass-border)] bg-[var(--color-navbar-bg)] shadow-[var(--shadow-navbar)] backdrop-blur-xl',
    inner:
      'mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8',
    link:
      'flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)]',
    mobileLink:
      'flex w-full items-center justify-between rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
    badge:
      'rounded-[var(--radius-full)] border border-[var(--color-nav-badge-border)] bg-[var(--color-nav-badge-bg)] px-2 py-0.5 text-[0.625rem] font-semibold text-[var(--color-nav-badge-text)]',
    cta:
      'inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-soft)] hover:shadow-[var(--shadow-glow-primary)]',
    mobileCta:
      'inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]',
    menuButton:
      'inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-glass-border)] bg-[var(--color-surface-translucent)] text-[var(--color-text-muted)] transition-colors duration-200 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] md:hidden',
    mobileMenu:
      'border-t border-[var(--color-glass-border)] bg-[var(--color-mobile-menu-bg)] px-4 py-3 backdrop-blur-xl md:hidden',
  },
  hero: {
    section:
      'relative isolate overflow-hidden border-b border-[var(--color-border-soft)]',
    grid:
      'grid items-center gap-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.9fr)] lg:gap-16',
    copyColumn: 'flex max-w-2xl flex-col items-start text-left',
    badge:
      'inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-hero-badge-border)] bg-[var(--color-hero-badge-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)]',
    headline: 'mt-6 max-w-2xl text-balance text-[var(--color-text)]',
    description:
      'mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-soft)] sm:text-[1.0625rem]',
    ctas: 'mt-10 flex flex-col gap-4 sm:flex-row',
    trust:
      'mt-12 inline-flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-full)] border border-[var(--color-border-soft)] bg-[var(--color-trust-bg)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] backdrop-blur',
    trustMark:
      'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]',
    mockupShell:
      'relative mx-auto w-full max-w-[34rem] motion-safe:animate-[codenix-hero-float_5s_ease-in-out_infinite]',
    mockupPerspective: 'relative [transform:perspective(1200px)_rotateX(7deg)_rotateZ(-5deg)]',
    mockupPanel:
      'relative overflow-hidden rounded-[var(--radius-mockup)] border border-[var(--color-glass-border)] bg-[var(--color-mockup-bg)] shadow-[var(--shadow-2xl)] backdrop-blur-xl',
    mockupInner: 'relative p-4 sm:p-5',
    dashboardCard:
      'rounded-[var(--radius-xl)] border border-[var(--color-glass-border)] bg-[var(--color-dashboard-card-bg)] p-3',
    statCard:
      'rounded-[var(--radius-xl)] border border-[var(--color-stat-border)] bg-[var(--color-stat-bg)] p-3 shadow-[var(--shadow-xs)]',
    statIcon:
      'flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-stat-border)] bg-[var(--color-stat-icon-bg)] text-[var(--color-stat-accent)]',
    problemItem:
      'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-problem-row-bg)] px-3 py-2',
    difficultyPill:
      'rounded-[var(--radius-full)] border border-[var(--color-glass-border)] px-2 py-0.5 text-[0.625rem] text-[var(--color-text-muted)]',
    progressTrack:
      'h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-progress-track)]',
    progressFill:
      'h-full rounded-[var(--radius-full)] bg-[var(--color-progress-fill)]',
    floatingBadge:
      'absolute -bottom-5 right-0 rounded-[var(--radius-xl)] border border-[var(--color-glass-border)] bg-[var(--color-floating-badge-bg)] px-4 py-3 shadow-[var(--shadow-floating)] backdrop-blur-xl motion-safe:animate-[codenix-hero-float-soft_6.5s_ease-in-out_infinite]',
  },
  footer: {
    shell:
      'border-t border-[var(--color-border-soft)] bg-[var(--color-footer-bg)]',
    inner:
      'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12',
    grid: 'grid gap-10 lg:grid-cols-[1.1fr_1fr]',
    brand: 'max-w-sm',
    brandLink:
      'inline-flex items-center gap-2 rounded-[var(--radius-md)] outline-none transition-opacity duration-200 hover:opacity-80',
    brandText: 'text-sm font-bold tracking-tight text-[var(--color-text)]',
    description:
      'mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]',
    badgeRow: 'mt-5 flex flex-wrap gap-2',
    badge:
      'inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--color-footer-badge-border)] bg-[var(--color-footer-badge-bg)] px-2.5 py-1 text-[0.6875rem] font-medium text-[var(--color-text-muted)]',
    badgeIcon: 'text-[var(--color-primary)]',
    groupGrid: 'grid gap-6 sm:grid-cols-3',
    heading:
      'text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]',
    list: 'mt-3 space-y-2.5',
    link:
      'inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-primary)]',
    linkBadge:
      'rounded-[var(--radius-full)] border border-[var(--color-footer-badge-border)] bg-[var(--color-footer-badge-bg)] px-1.5 py-0.5 text-[0.5625rem] font-medium text-[var(--color-nav-badge-text)]',
    bottom:
      'mt-10 flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-5 sm:flex-row sm:items-center sm:justify-between',
    bottomText: 'text-xs text-[var(--color-text-subtle)]',
    bottomMeta:
      'flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]',
  },
  auth: {
    page:
      'grid min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] lg:grid-cols-[60%_40%]',
    brandPanel:
      'relative hidden min-h-screen overflow-hidden border-r border-[var(--color-border-soft)] bg-[var(--color-auth-brand-bg)] lg:block',
    brandOverlay:
      'pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,20,0.72)_0%,rgba(5,9,20,0.28)_46%,rgba(5,9,20,0.92)_100%)]',
    brandInner:
      'relative z-10 flex min-h-screen flex-col py-10 pl-[clamp(4rem,11vw,13rem)] pr-12',
    brandLogoLink: 'inline-flex w-fit rounded-[var(--radius-lg)]',
    brandLogo:
      'h-16 w-16 shrink-0 bg-[var(--color-logo-mark)]',
    brandLockupText: 'flex flex-col justify-center',
    brandLockupName: 'text-sm font-bold leading-none text-white',
    brandContent: 'mt-auto mb-[15vh] max-w-[33rem]',
    brandEyebrow:
      'mb-4 text-lg font-semibold text-[rgba(226,232,240,0.76)]',
    brandTitle:
      'text-[2.8rem] font-bold leading-[1.02] tracking-[var(--tracking-tight)] text-white xl:text-[3.25rem]',
    brandEmphasis: 'mt-2 block w-fit',
    brandDescription:
      'mt-6 max-w-[25rem] text-sm leading-6 text-[rgba(203,213,225,0.78)]',
    brandLink:
      'mt-2 inline-flex rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-text)]',
    main:
      'relative flex min-h-screen items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:px-8 xl:px-10',
    mainGlow:
      'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_38%_at_50%_0%,rgba(56,189,248,0.055),transparent_62%)]',
    formWrap: 'relative z-10 w-full max-w-[400px]',
    mobileBrand: 'mb-8 flex justify-center lg:hidden',
    mobileLogoLink: 'inline-flex rounded-[var(--radius-lg)]',
    mobileLogo: 'h-16 w-16 shrink-0 bg-[var(--color-logo-mark)]',
    header: 'mb-8',
    headerCompact: 'mb-6',
    eyebrow:
      'mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]',
    title: 'text-2xl font-bold tracking-tight text-[var(--color-text)]',
    description: 'mt-2 text-sm text-[var(--color-text-muted)]',
    form: 'flex flex-col gap-5',
    formCompact: 'flex flex-col gap-4',
    fieldWrap: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-[var(--color-text)]',
    inputShell:
      'relative flex items-center rounded-[var(--radius-xl)] border bg-[var(--color-auth-input-bg)] transition duration-200',
    inputShellDefault:
      'border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:shadow-[var(--shadow-auth-focus)]',
    inputShellError:
      'border-[var(--color-error)] shadow-[var(--shadow-auth-error)]',
    inputShellDisabled:
      'opacity-60',
    inputIcon:
      'ml-3.5 h-4 w-4 shrink-0 text-[var(--color-auth-icon)] transition-colors',
    inputIconError: 'text-[var(--color-error)]',
    input:
      'h-11 w-full bg-transparent px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-auth-placeholder)] disabled:cursor-not-allowed',
    inputWithAction:
      'h-11 w-full bg-transparent px-3 pr-11 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-auth-placeholder)] disabled:cursor-not-allowed',
    fieldError: 'min-h-[1rem] text-xs text-[var(--color-error)]',
    textLink:
      'rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-primary)] hover:underline',
    iconButton:
      'absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] text-[var(--color-auth-icon)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
    checkboxLabel:
      'flex cursor-pointer items-center gap-2.5 text-sm leading-5 text-[var(--color-text-muted)]',
    checkbox:
      'h-3.5 w-3.5 shrink-0 cursor-pointer rounded-[var(--radius-xs)] border-[var(--color-border)] bg-[var(--color-surface)] accent-[var(--color-primary)]',
    alert:
      'rounded-[var(--radius-xl)] border border-[var(--color-error)] bg-[var(--color-error-soft)] px-4 py-3 text-sm text-[var(--color-error)]',
    primaryButton:
      'relative mt-1 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--gradient-brand)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-auth-button)] transition duration-200 [text-shadow:0_1px_1px_rgba(2,6,23,0.55)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
    primaryButtonOverlay:
      'pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(2,6,23,0.08))]',
    primaryButtonContent: 'relative z-10 inline-flex items-center gap-2',
    divider:
      'my-6 flex items-center gap-3 text-xs text-[var(--color-text-subtle)]',
    dividerCompact:
      'my-5 flex items-center gap-3 text-xs text-[var(--color-text-subtle)]',
    dividerLine: 'h-px flex-1 bg-[var(--color-border-soft)]',
    oauthGrid: 'grid grid-cols-2 gap-3',
    oauthButton:
      'inline-flex h-11 items-center justify-center gap-2.5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-text-soft)] transition duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
    footerText: 'mt-8 text-center text-sm text-[var(--color-text-muted)]',
    footerTextCompact: 'mt-6 text-center text-sm text-[var(--color-text-muted)]',
    footerLink:
      'rounded-[var(--radius-sm)] font-semibold text-[var(--color-primary)] hover:underline',
  },
} as const
