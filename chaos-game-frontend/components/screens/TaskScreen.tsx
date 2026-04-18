'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const Timer3D = dynamic(() => import('@/components/three/Timer3D'), { ssr: false })

interface TaskScreenProps {
  task: { task: string; category: string }
  onComplete: () => void
  onSkip: () => void
}

const TIMER_DURATION = 60

export default function TaskScreen({ task, onComplete, onSkip }: TaskScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onSkip()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [onSkip])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center gap-6">
        {/* Category pill */}
        <div 
          className="px-4 py-2 rounded-full border-2 animate-rborder animate-chromatic uppercase text-sm"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
        >
          {task.category}
        </div>
        
        {/* 3D Timer */}
        <Timer3D timeRemaining={timeRemaining} totalTime={TIMER_DURATION} />
        
        {/* Task card */}
        <div 
          className="w-full p-6 rounded-xl border animate-shimmer hover:animate-rborder transition-all"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <p 
            className="text-center text-[1.2rem] text-[#eee] font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {task.task}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl gradient-success chaos-btn text-[1.8rem] text-[#080808]"
            style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
          >
            {"I DID IT! 📸"}
          </button>
          
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-xl gradient-neutral chaos-btn text-base text-[#666]"
            style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.06em' }}
          >
            skip this task →
          </button>
        </div>
      </div>
    </div>
  )
}
