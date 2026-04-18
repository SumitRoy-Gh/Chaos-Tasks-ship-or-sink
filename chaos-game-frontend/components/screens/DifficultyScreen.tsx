'use client'

interface DifficultyScreenProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void
}

const difficulties = [
  {
    id: 'easy' as const,
    emoji: '&#129393;',
    label: 'EASY',
    tagline: 'For cowards and grandmas',
    color: '#39ff14',
    bgAlpha: 'rgba(57,255,20,0.05)',
    glowAlpha: 'rgba(57,255,20,0.08)',
  },
  {
    id: 'medium' as const,
    emoji: '&#128548;',
    label: 'MEDIUM',
    tagline: 'Getting spicy',
    color: '#ff4d00',
    bgAlpha: 'rgba(255,77,0,0.05)',
    glowAlpha: 'rgba(255,77,0,0.08)',
  },
  {
    id: 'hard' as const,
    emoji: '&#128128;',
    label: 'HARD',
    tagline: 'You will regret this',
    color: '#ff1744',
    bgAlpha: 'rgba(255,23,68,0.05)',
    glowAlpha: 'rgba(255,23,68,0.08)',
    glitch: true,
  },
]

export default function DifficultyScreen({ onSelect }: DifficultyScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Heading */}
        <h2 
          className="text-center text-4xl mb-8 animate-glitch text-[#f5f5f5]"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
        >
          PICK YOUR PAIN
        </h2>
        
        {/* Difficulty cards */}
        <div className="flex flex-col gap-4">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => onSelect(diff.id)}
              className="relative w-full p-5 rounded-xl border-2 animate-rborder text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: diff.bgAlpha,
                boxShadow: `inset 0 0 30px ${diff.glowAlpha}`,
              }}
            >
              {/* Left strip */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ background: diff.color }}
              />
              
              <div className="flex items-center gap-4 pl-3">
                <span 
                  className="text-[32px]" 
                  dangerouslySetInnerHTML={{ __html: diff.emoji }}
                />
                <div>
                  <h3 
                    className={`text-2xl ${diff.glitch ? 'animate-glitch' : ''}`}
                    style={{ 
                      fontFamily: 'Bangers, cursive', 
                      letterSpacing: '0.06em',
                      color: diff.color 
                    }}
                  >
                    {diff.label}
                  </h3>
                  <p className="text-sm text-[#666]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {diff.tagline}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
