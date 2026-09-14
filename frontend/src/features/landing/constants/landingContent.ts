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
    title: 'Elige el siguiente reto',
    description:
      'Filtros claros, dificultad visible y problemas que puedes retomar sin perder contexto.',
    icon: 'git-branch',
  },
  {
    title: 'Escribe y envía',
    description:
      'Un editor preparado para la función del problema; el servidor ejecuta los casos por ti.',
    icon: 'code2',
  },
  {
    title: 'Mira qué cambió',
    description:
      'Cada envío suma a tu historial para saber qué tema practicar después.',
    icon: 'line-chart',
  },
]

export const roadmapItems: RoadmapItem[] = [
  {
    title: 'Biblioteca viva',
    description:
      'La base V1 para encontrar un reto, abrirlo y empezar a resolver sin pasos extra.',
    status: 'Base V1',
  },
  {
    title: 'Rachas que tienen sentido',
    description:
      'Historial y métricas que conectan tus envíos con el siguiente tema que conviene practicar.',
    status: 'Visión',
  },
  {
    title: 'Contests de la comunidad',
    description:
      'Retos internos para comparar estrategias, aprender de otros y celebrar avances juntos.',
    status: 'Próximamente',
  },
  {
    title: 'Rutas por dominio',
    description:
      'Recorridos por estructuras de datos y algoritmos para pasar de un problema al siguiente con dirección.',
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
  {
    title: 'Legal',
    links: [
      { label: 'Términos de uso', href: '/terms' },
      { label: 'Política de privacidad', href: '/privacy' },
    ],
  },
]
