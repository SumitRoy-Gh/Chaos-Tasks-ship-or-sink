'use client'

interface HeaderProps {
  score: number
}

export default function Header({ score }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060606]/90 backdrop-blur-sm">
      <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="font-display text-xl tracking-wider animate-chromatic animate-glitch">
          CHAOS TASKS
        </h1>
        
        {/* Score */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 animate-rborder bg-[#0d0d0d]">
          <span className="text-lg">⚡</span>
          <span className="font-display text-lg animate-chromatic neon-glow">
            {score}
          </span>
        </div>
      </div>
      
      {/* Rainbow divider */}
      <div className="rainbow-line" />
    </header>
  )
}
