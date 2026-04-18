'use client'

import { useEffect, useRef, useMemo } from 'react'

const AI_VERDICTS = [
  "Shows promise but questionable decision-making. Like a golden retriever with a flamethrower. 🐕🔥",
  "Statistically impressive for someone who chose HARD three times in a row. Medically concerning.",
  "The AI has seen things. You specifically. It needs therapy now.",
  "Your chaos energy is unstable. We recommend deep breaths and avoiding sharp objects.",
  "Performance: chaotic. Commitment: unhinged. Overall: oddly inspiring.",
]

const BADGES = [
  { emoji: '🔥', label: 'Day Streak', color: '#ff4d00' },
  { emoji: '👑', label: 'First Hard Win', color: '#ffd60a' },
  { emoji: '🤡', label: 'Pro Clown', color: '#ff00aa' },
  { emoji: '🐔', label: 'Chicken x5', color: '#39ff14' },
  { emoji: '💀', label: 'Death Wish', color: '#ff1744' },
  { emoji: '🎯', label: 'Sniper', color: '#00e5ff' },
  { emoji: '🌀', label: 'Chaos Agent', color: '#bf5fff' },
]

interface DashboardScreenProps {
  score: number
  tasksCompleted: number
  passedTasks: number
  hardFails: number
  recentActivity: { type: 'approved' | 'rejected' | 'spin'; text: string; points: number; time: string }[]
}

export default function DashboardScreen({ 
  score, 
  tasksCompleted, 
  passedTasks, 
  hardFails,
  recentActivity 
}: DashboardScreenProps) {
  const sparklineRef = useRef<HTMLCanvasElement>(null)
  const passRate = tasksCompleted > 0 ? Math.round((passedTasks / tasksCompleted) * 100) : 0
  const masteryLevel = Math.min(100, Math.round(score / 14.2)) // Max at ~1420 points
  
  const masteryTier = useMemo(() => {
    if (masteryLevel <= 30) return { name: 'Absolute Beginner 🥚', color: '#666' }
    if (masteryLevel <= 50) return { name: 'Mild Inconvenience 🌧️', color: '#00e5ff' }
    if (masteryLevel <= 70) return { name: 'Controlled Disaster 🌪️', color: '#bf5fff' }
    if (masteryLevel <= 90) return { name: 'Certified Menace 🔥', color: '#ff4d00' }
    return { name: 'CHAOS INCARNATE 💀', color: '#ff1744' }
  }, [masteryLevel])
  
  const randomVerdict = useMemo(() => AI_VERDICTS[Math.floor(Math.random() * AI_VERDICTS.length)], [])
  
  // Draw sparkline
  useEffect(() => {
    const canvas = sparklineRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth * 2
    canvas.height = 120
    ctx.scale(2, 1)
    
    const width = canvas.offsetWidth
    const height = 60
    const points = 7
    const data = Array.from({ length: points }, () => Math.random() * 40 + 10)
    
    // Draw gradient line
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, '#ff4d00')
    gradient.addColorStop(0.25, '#ff00aa')
    gradient.addColorStop(0.5, '#bf5fff')
    gradient.addColorStop(0.75, '#00e5ff')
    gradient.addColorStop(1, '#39ff14')
    
    ctx.beginPath()
    ctx.moveTo(0, height - data[0])
    data.forEach((val, i) => {
      const x = (i / (points - 1)) * width
      const y = height - val
      ctx.lineTo(x, y)
    })
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw dots
    data.forEach((val, i) => {
      const x = (i / (points - 1)) * width
      const y = height - val
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    })
    
    // X-axis labels
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#666'
    days.forEach((day, i) => {
      const x = (i / (points - 1)) * width
      ctx.fillText(day, x - 10, height + 15)
    })
  }, [])
  
  const categories = [
    { name: 'Selfie', completed: 2, total: 5, color: '#ff4d00' },
    { name: 'Action', completed: 3, total: 5, color: '#ff00aa' },
    { name: 'Object', completed: 1, total: 5, color: '#bf5fff' },
    { name: 'Food', completed: 0, total: 5, color: '#39ff14' },
  ]
  
  return (
    <div className="flex flex-col px-4 pt-20 pb-24 gap-4">
      {/* Heading */}
      <div className="text-center mb-2">
        <h2 className="font-display text-3xl tracking-wider animate-chromatic animate-glitch">
          YOUR CHAOS STATS
        </h2>
        <p className="text-[#666] text-sm">
          The AI has been watching. It&apos;s concerned.
        </p>
      </div>
      
      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
          <div className="text-[10px] text-[#666] uppercase mb-1">Total Points</div>
          <div className="font-display text-3xl animate-chromatic">{score}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
          <div className="text-[10px] text-[#666] uppercase mb-1">Pass Rate</div>
          <div className="font-display text-3xl text-[#39ff14]">{passRate}%</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
          <div className="text-[10px] text-[#666] uppercase mb-1">Tasks Done</div>
          <div className="font-display text-3xl text-[#bf5fff]">{tasksCompleted}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
          <div className="text-[10px] text-[#666] uppercase mb-1">Hard Fails</div>
          <div className="font-display text-3xl text-[#ff1744]">💀 x{hardFails}</div>
        </div>
      </div>
      
      {/* Chaos Mastery Bar */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#666] uppercase">Chaos Mastery Level</span>
          <span className="font-display text-sm" style={{ color: masteryTier.color }}>
            {masteryLevel}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-[#1a1a1a] overflow-hidden mb-2">
          <div 
            className="h-full rounded-full gradient-primary animate-[fill-bar_1s_ease-out]"
            style={{ width: `${masteryLevel}%` }}
          />
        </div>
        <div className="text-xs text-center" style={{ color: masteryTier.color }}>
          {masteryTier.name}
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
        <div className="text-xs text-[#666] uppercase mb-3">Category Breakdown</div>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>{cat.name}</span>
                <span style={{ color: cat.color }}>{cat.completed}/{cat.total}</span>
              </div>
              <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${(cat.completed / cat.total) * 100}%`,
                    backgroundColor: cat.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mood Graph */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
        <div className="text-xs text-[#666] uppercase mb-2">Your chaos energy over time</div>
        <canvas ref={sparklineRef} className="w-full h-[60px]" />
      </div>
      
      {/* AI Verdict */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border-l-4 border-[#ff4d00] border-r border-t border-b border-r-[#222] border-t-[#222] border-b-[#222]">
        <div className="text-4xl mb-2">&ldquo;</div>
        <p className="text-sm text-[#888] italic leading-relaxed -mt-6 pl-4">
          {randomVerdict}
        </p>
      </div>
      
      {/* Badges */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {BADGES.map((badge, i) => (
          <div 
            key={i}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: badge.color + '22', color: badge.color }}
          >
            <span>{badge.emoji}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
        <div className="text-xs text-[#666] uppercase mb-3">Recent Activity</div>
        <div className="flex flex-col gap-2">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-[#444] italic">No activity yet. Start playing!</p>
          ) : (
            recentActivity.slice(0, 5).map((activity, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span>
                  {activity.type === 'approved' ? '✅' : activity.type === 'rejected' ? '❌' : '⚡'}
                </span>
                <span className="flex-1 truncate text-[#888]">{activity.text}</span>
                <span className={activity.type === 'approved' ? 'text-[#39ff14]' : activity.type === 'rejected' ? 'text-[#ff1744]' : 'text-[#ffd60a]'}>
                  {activity.points > 0 ? `+${activity.points}pts` : activity.text}
                </span>
                <span className="text-[#444]">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
