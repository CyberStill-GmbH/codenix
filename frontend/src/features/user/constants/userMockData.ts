import type {
  DifficultyProgress,
  Submission,
  User,
  UserStats,
} from '@/features/user/types/user.types'

// TODO: API - GET /api/users/me
export const mockUser: User = {
  id: 'usr_codenix_001',
  name: 'Camila Torres',
  username: 'camitorres',
  avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Camila%20Torres',
  degree: 'Ingenieria de Sistemas',
  githubUrl: 'https://github.com/camitorres',
  linkedinUrl: 'https://www.linkedin.com/in/camitorres',
  memberSince: 'junio 2026',
}

// TODO: API - GET /api/users/me/stats
export const mockUserStats: UserStats = {
  problemsSolved: 6,
  totalProblems: 42,
  submissionsCount: 269,
  mostUsedLanguage: 'Python',
  currentStreak: 3,
}

// TODO: API - GET /api/users/me/progress
export const mockDifficultyProgress: DifficultyProgress = {
  easy: {
    solved: 2,
    total: 18,
  },
  medium: {
    solved: 3,
    total: 17,
  },
  hard: {
    solved: 1,
    total: 7,
  },
}

// TODO: API - GET /api/submissions?userId={id}&limit=10
export const mockRecentSubmissions: Submission[] = [
  {
    id: 'sub_001',
    problemId: 1,
    problemName: 'Suma de Pares',
    difficulty: 'easy',
    language: 'Python',
    status: 'accepted',
    submittedAt: '2026-06-16T22:14:00-05:00',
  },
  {
    id: 'sub_002',
    problemId: 2,
    problemName: 'Ruta Minima en Campus',
    difficulty: 'medium',
    language: 'C++',
    status: 'wrong_answer',
    submittedAt: '2026-06-16T21:48:00-05:00',
  },
  {
    id: 'sub_003',
    problemId: 3,
    problemName: 'Inventario Binario',
    difficulty: 'easy',
    language: 'JavaScript',
    status: 'accepted',
    submittedAt: '2026-06-15T19:32:00-05:00',
  },
  {
    id: 'sub_004',
    problemId: 4,
    problemName: 'Torres de Energia',
    difficulty: 'medium',
    language: 'Python',
    status: 'pending',
    submittedAt: '2026-06-15T18:57:00-05:00',
  },
  {
    id: 'sub_005',
    problemId: 5,
    problemName: 'Compresion de Rutas',
    difficulty: 'hard',
    language: 'C++',
    status: 'accepted',
    submittedAt: '2026-06-14T23:08:00-05:00',
  },
  {
    id: 'sub_006',
    problemId: 6,
    problemName: 'Cola de Prioridad UNI',
    difficulty: 'medium',
    language: 'Java',
    status: 'accepted',
    submittedAt: '2026-06-14T20:41:00-05:00',
  },
  {
    id: 'sub_007',
    problemId: 7,
    problemName: 'Matriz de Laboratorio',
    difficulty: 'easy',
    language: 'Python',
    status: 'accepted',
    submittedAt: '2026-06-13T17:25:00-05:00',
  },
  {
    id: 'sub_008',
    problemId: 8,
    problemName: 'Segmentos en Competencia',
    difficulty: 'medium',
    language: 'C++',
    status: 'wrong_answer',
    submittedAt: '2026-06-12T22:36:00-05:00',
  },
  {
    id: 'sub_009',
    problemId: 9,
    problemName: 'Frecuencia de Codigos',
    difficulty: 'easy',
    language: 'JavaScript',
    status: 'accepted',
    submittedAt: '2026-06-12T21:03:00-05:00',
  },
  {
    id: 'sub_010',
    problemId: 10,
    problemName: 'Camino de Entrenamiento',
    difficulty: 'easy',
    language: 'Python',
    status: 'accepted',
    submittedAt: '2026-06-11T20:18:00-05:00',
  },
]
