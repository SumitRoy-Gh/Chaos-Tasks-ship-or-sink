'use client'

interface ScoreScreenProps {
  score: number
  tasksCompleted: number
  onPlayAgain: () => void
}

function getRating(score: number) {
  if (score >= 500) {
    return { emoji: '&#127942;', text: 'CHAOS MASTER', color: '#ffd60a' }
  }
  if (score >= 200) {
    return { emoji: '&#128548;', text: 'DECENT EFFORT', color: '#ff4d00' }
  }
  return { emoji: '&#129393;', text: 'NEEDS PRACTICE', color: '#00e5ff' }
}

export default function ScoreScreen({ score, tasksCompleted, onPlayAgain }: ScoreScreenProps) {
  const rating = getRating(score)
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center gap-6">
        {/* Game controller emoji */}
        <span className="text-[48px]">&#127918;</span>
        
        {/* Heading */}
        <h2 
          className="text-4xl animate-glitch text-[#f5f5f5]"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
        >
          SESSION OVER
        </h2>
        
        {/* Score card */}
        <div 
          className="w-full p-8 rounded-2xl border-2 animate-rborder flex flex-col items-center gap-4"
          style={{ background: '#0f0f0f' }}
        >
          {/* Total score label */}
          <p 
            className="text-xs uppercase tracking-[0.2em] text-[#666]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            TOTAL SCORE
          </p>
          
          {/* Score number */}
          <div 
            className="text-[5rem] leading-none animate-chromatic neon-glow"
            style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
          >
            {score}
          </div>
          
          {/* Tasks completed */}
          <p 
            className="text-sm text-[#666]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {tasksCompleted} tasks completed
          </p>
          
          {/* Divider */}
          <div className="w-full my-2 rainbow-line" />
          
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span 
              className="text-3xl" 
              dangerouslySetInnerHTML={{ __html: rating.emoji }}
            />
            <span 
              className="text-2xl neon-glow"
              style={{ 
                fontFamily: 'Bangers, cursive', 
                letterSpacing: '0.06em',
                color: rating.color
              }}
            >
              {rating.text}
            </span>
          </div>
        </div>
        
        {/* Play again button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl gradient-primary chaos-btn text-[2rem] text-[#080808]"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
        >
          {"PLAY AGAIN 🔥"}
        </button>
      </div>
    </div>
  )
}
