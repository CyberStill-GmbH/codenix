export type NavItem = {
  label: string
  href: string
  isExternal?: boolean
  badge?: string
}

export type HeroStat = {
  value: string
  label: string
}

export type PreviewProblem = {
  title: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  tag: string
}

export type FeatureIconKey = 'code2' | 'bar-chart3' | 'trophy' | 'book-open'

export type FeatureItem = {
  title: string
  description: string
  icon: FeatureIconKey
  status?: string
}

export type VisionIconKey = 'git-branch' | 'code2' | 'line-chart'

export type VisionCard = {
  title: string
  description: string
  icon: VisionIconKey
}

export type RoadmapStatus = 'Base V1' | 'Visión' | 'Próximamente'

export type RoadmapItem = {
  title: string
  description: string
  status: RoadmapStatus
}

export type FooterLink = {
  label: string
  href: string
  badge?: string
}

export type FooterGroup = {
  title: string
  links: FooterLink[]
}
