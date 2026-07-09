import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type WorkspaceLayoutState = {
  problemWidthPercent: number
  bottomHeightPx: number
  isCollapsed: boolean
  isFullscreen: boolean
  setProblemWidthPercent: (percent: number) => void
  setBottomHeightPx: (px: number) => void
  setIsCollapsed: (collapsed: boolean) => void
  setIsFullscreen: (fullscreen: boolean) => void
  toggleFullscreen: () => void
}

const WorkspaceContext = createContext<WorkspaceLayoutState | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

const STORAGE_KEY_WIDTH = 'codenix_workspace_problem_width'
const STORAGE_KEY_HEIGHT = 'codenix_workspace_bottom_height'
const STORAGE_KEY_COLLAPSED = 'codenix_workspace_collapsed'

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [problemWidthPercent, setProblemWidthPercentState] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_WIDTH)
    return stored ? Number(stored) : 44
  })
  
  const [bottomHeightPx, setBottomHeightPxState] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_HEIGHT)
    return stored ? Number(stored) : 240
  })

  const [isCollapsed, setIsCollapsedState] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY_COLLAPSED)
    return stored === 'true'
  })

  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handlers with persistence
  const setProblemWidthPercent = (percent: number) => {
    setProblemWidthPercentState(percent)
    window.localStorage.setItem(STORAGE_KEY_WIDTH, String(percent))
  }

  const setBottomHeightPx = (px: number) => {
    setBottomHeightPxState(px)
    window.localStorage.setItem(STORAGE_KEY_HEIGHT, String(px))
  }

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed)
    window.localStorage.setItem(STORAGE_KEY_COLLAPSED, String(collapsed))
  }

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev)

  // Fullscreen escape listener
  useEffect(() => {
    if (!isFullscreen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  return (
    <WorkspaceContext.Provider
      value={{
        problemWidthPercent,
        bottomHeightPx,
        isCollapsed,
        isFullscreen,
        setProblemWidthPercent,
        setBottomHeightPx,
        setIsCollapsed,
        setIsFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
