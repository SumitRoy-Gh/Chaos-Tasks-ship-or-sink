'use client'

interface ScoreBarProps {
  score: number
}

export default function ScoreBar({ score }: ScoreBarProps) {
  return (
    <div 
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-xl border-2 animate-rborder"
      style={{ 
        background: 'rgba(15, 15, 15, 0.9)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">&#9889;</span>
        <span 
          className="text-2xl animate-chromatic neon-glow"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
        >
          {score}
        </span>
      </div>
    </div>
  )
}
