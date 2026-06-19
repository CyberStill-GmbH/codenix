import type {
  FeatureItem,
  FooterGroup,
  HeroStat,
  NavItem,
  PreviewProblem,
  RoadmapItem,
  VisionCard,
} from '@/features/landing/types/landing.types'

export const navItems: NavItem[] = [
  { label: 'Problemas', href: '#problems' },
  { label: 'Visión', href: '#vision' },
  { label: 'Comunidad', href: '#community' },
  { label: 'Contests', href: '#roadmap', badge: 'Próximamente' },
]

export const heroStats: HeroStat[] = [
  { value: 'V1', label: 'Plataforma en desarrollo' },
  { value: 'IEEE', label: 'Computer Society UNI' },
  { value: 'CP', label: 'Práctica algorítmica' },
]

export const previewProblems: PreviewProblem[] = [
  { title: 'Two Sum', difficulty: 'Fácil', tag: 'Arrays' },
  { title: 'Binary Search', difficulty: 'Medio', tag: 'Búsqueda Binaria' },
  { title: 'Dynamic Paths', difficulty: 'Difícil', tag: 'DP' },
]

export const features: FeatureItem[] = [
  {
    title: 'Práctica de problemas',
    description:
      'Explora ejercicios de programación competitiva organizados para entrenar algoritmos, estructuras de datos y resolución de problemas.',
    icon: 'code2',
  },
  {
    title: 'Progreso centralizado',
    description:
      'Codenix busca reunir tu avance, tus envíos y tu constancia en una sola plataforma para que entrenar sea más ordenado.',
    icon: 'bar-chart3',
  },
  {
    title: 'Contests y ranking',
    description:
      'La plataforma está pensada para evolucionar hacia competencias internas, rankings y retos para la comunidad.',
    icon: 'trophy',
    status: 'Próximamente',
  },
  {
    title: 'Aprendizaje estructurado',
    description:
      'La visión de Codenix incluye rutas y cursos para acompañar la práctica con una guía más clara de aprendizaje.',
    icon: 'book-open',
    status: 'Visión',
  },
]

export const visionCards: VisionCard[] = [
  {
    title: 'Plataforma propia',
    description:
      'Un espacio diseñado desde la comunidad, no adaptado de otra herramienta.',
    icon: 'git-branch',
  },
  {
    title: 'Práctica algorítmica',
    description:
      'Resolver problemas, entrenar estructuras de datos y mejorar el razonamiento.',
    icon: 'code2',
  },
  {
    title: 'Progreso técnico',
    description:
      'Centralizar el avance para que entrenar sea constante, no disperso.',
    icon: 'line-chart',
  },
]

export const roadmapItems: RoadmapItem[] = [
  {
    title: 'Problemas y práctica',
    description:
      'Base inicial para explorar ejercicios y construir el flujo principal de entrenamiento.',
    status: 'Base V1',
  },
  {
    title: 'Seguimiento de progreso',
    description:
      'Evolución hacia métricas, historial de avance y una vista más clara del crecimiento técnico.',
    status: 'Visión',
  },
  {
    title: 'Contests y ranking',
    description:
      'La siguiente capa activa: retos internos, ranking y señales de progreso competitivo.',
    status: 'Próximamente',
  },
  {
    title: 'Aprendizaje estructurado',
    description:
      'Rutas y cursos para acompañar la práctica con una guía ordenada por temas.',
    status: 'Visión',
  },
]

export const footerGroups: FooterGroup[] = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Problemas', href: '/problems' },
      { label: 'Contests', href: '#roadmap', badge: 'Próximamente' },
      { label: 'Progreso', href: '#vision', badge: 'Visión' },
    ],
  },
  {
    title: 'Proyecto',
    links: [
      { label: 'Visión', href: '#vision' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Comunidad', href: '#community' },
    ],
  },
  {
    title: 'Comunidad',
    links: [
      { label: 'IEEE CS UNI', href: '#community' },
      { label: 'Prog. competitiva', href: '#problems' },
    ],
  },
]
