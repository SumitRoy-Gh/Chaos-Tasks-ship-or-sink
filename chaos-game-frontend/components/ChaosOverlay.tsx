'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Chaos Events
const CHAOS_EVENTS = [
  {
    id: 'black-screen',
    title: '...',
    titleColor: '#00e5ff',
    sub: 'The app is thinking about your life choices.',
    body: "This will only take a moment. Or forever. Hard to say.",
  },
  {
    id: 'broken-image',
    title: 'IMAGE_LOAD_FAILED.jpg',
    titleColor: '#888888',
    sub: 'This is fine. Everything is fine.',
    body: "The image that was supposed to go here described your future. Maybe it's better this way.",
    showBrokenImage: true,
  },
  {
    id: '404-single',
    title: '404',
    titleColor: '#ff00aa',
    sub: 'PARTNER NOT FOUND',
    body: "No compatible chaos agent detected in your area. Have you tried lowering your standards? (asking for the AI)",
    largeTitle: true,
  },
  {
    id: 'reality-crashed',
    title: 'REALITY.EXE',
    titleColor: '#39ff14',
    sub: 'SYSTEM FAILURE',
    body: '',
    showTerminal: true,
  },
  {
    id: 'error-69',
    title: 'ERROR 69',
    titleColor: '#bf5fff',
    sub: 'CHAOS LEVELS CRITICAL',
    body: "The AI has become self-aware. It took one look at your score and immediately requested a sabbatical.",
    largeTitle: true,
  },
]

const RECOVERY_MESSAGES = [
  { face: '😂', heading: 'LOL JK', body: "The server is fine. Your panic? Priceless. We have screenshots. 💅" },
  { face: '🤡', heading: 'I WAS JOKING', body: "April Fool! (It's not April. We don't care. Time is a construct.)" },
  { face: '💀', heading: 'TAKE A CHILL PILL', body: "Breathe. In. Out. Count to 10. We'll wait. (we won't. we're impatient.)" },
  { face: '🎭', heading: 'RELAX BESTIE', body: "We just needed a dramatic pause. Very cinematic of us, tbh." },
  { face: '🫢', heading: 'SIKE!', body: "HAHAHA your face though 😭 We're genuinely evil and we love it." },
  { face: '🔥', heading: 'LAUGH. IT\'S NEEDED.', body: "Studies show laughing at fake 404s extends your life by 3 years. (source: we made this up)" },
  { face: '🥸', heading: 'VIBE CHECK: PASSED', body: "You survived the chaos interrupt. The app respects you now. A little." },
  { face: '🧘', heading: 'APRIL FOOL ENERGY', body: "It doesn't have to be April to feel fooled. Embrace the chaos. It's therapeutic." },
]

const TERMINAL_LINES = [
  '> loading reality.exe...',
  '> ERROR: module \'common_sense\' not found',
  '> attempting recovery...',
  '> recovery failed (user is the problem)',
  '> rebooting universe...',
]

interface ChaosOverlayProps {
  triggerOnAction?: boolean
  onTriggerHandled?: () => void
}

export default function ChaosOverlay({ triggerOnAction, onTriggerHandled }: ChaosOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [phase, setPhase] = useState<'event' | 'countdown' | 'recovery'>('event')
  const [countdown, setCountdown] = useState(5)
  const [currentEvent, setCurrentEvent] = useState(CHAOS_EVENTS[0])
  const [recoveryMessage, setRecoveryMessage] = useState(RECOVERY_MESSAGES[0])
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Random interval trigger (60-120 seconds)
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 60000 + Math.random() * 60000 // 60-120 seconds
      timerRef.current = setTimeout(() => {
        triggerChaos()
        scheduleNext()
      }, delay)
    }
    
    scheduleNext()
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Handle action triggers (35% chance)
  useEffect(() => {
    if (triggerOnAction && Math.random() < 0.35) {
      triggerChaos()
    }
    onTriggerHandled?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOnAction])
  
  const triggerChaos = useCallback(() => {
    const randomEvent = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]
    const randomRecovery = RECOVERY_MESSAGES[Math.floor(Math.random() * RECOVERY_MESSAGES.length)]
    
    setCurrentEvent(randomEvent)
    setRecoveryMessage(randomRecovery)
    setPhase('event')
    setCountdown(5)
    setTerminalLines([])
    setIsVisible(true)
    
    // Terminal typing effect for reality-crashed
    if (randomEvent.showTerminal) {
      TERMINAL_LINES.forEach((line, i) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line])
        }, i * 600)
      })
    }
    
    // Start countdown after 2-3 seconds
    setTimeout(() => {
      setPhase('countdown')
      let count = 5
      const countdownInterval = setInterval(() => {
        count--
        setCountdown(count)
        if (count <= 0) {
          clearInterval(countdownInterval)
          setPhase('recovery')
        }
      }, 1000)
    }, randomEvent.showTerminal ? 3500 : 2500)
  }, [])
  
  // Draw noise on canvas
  useEffect(() => {
    if (!isVisible) return
    
    const canvas = noiseCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 200
    canvas.height = 200
    
    const animate = () => {
      if (!isVisible) return
      const imageData = ctx.createImageData(200, 200)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const val = Math.random() * 255
        imageData.data[i] = val
        imageData.data[i + 1] = val
        imageData.data[i + 2] = val
        imageData.data[i + 3] = Math.random() * 30
      }
      ctx.putImageData(imageData, 0, 0)
      requestAnimationFrame(animate)
    }
    animate()
  }, [isVisible])
  
  const handleDismiss = () => {
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* CRT Scanline */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: 0.1 }}
      >
        <div 
          className="absolute w-full h-10 bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent"
          style={{ animation: 'scanline 3s linear infinite' }}
        />
      </div>
      
      {/* Noise */}
      <canvas
        ref={noiseCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-5"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="relative z-10 text-center px-6 max-w-[400px]">
        {phase === 'event' && (
          <div className="animate-scale-bounce">
            {/* Broken Image icon */}
            {currentEvent.showBrokenImage && (
              <div className="mb-4 mx-auto w-24 h-24 border-2 border-[#444] rounded-lg flex items-center justify-center bg-[#111]">
                <svg className="w-12 h-12 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Terminal output */}
            {currentEvent.showTerminal && (
              <div className="mb-4 text-left font-mono text-sm text-[#39ff14] bg-black/50 p-4 rounded-lg">
                {terminalLines.map((line, i) => (
                  <div key={i} className="mb-1">{line}</div>
                ))}
                <span className="animate-pulse">▌</span>
              </div>
            )}
            
            {/* Title */}
            <h2 
              className={`font-display tracking-wider mb-2 ${currentEvent.largeTitle ? 'text-6xl animate-chromatic' : 'text-4xl'}`}
              style={{ color: currentEvent.titleColor }}
            >
              {currentEvent.title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg text-[#888] mb-2">{currentEvent.sub}</p>
            
            {/* Body */}
            {currentEvent.body && (
              <p className="text-sm text-[#555] leading-relaxed">{currentEvent.body}</p>
            )}
          </div>
        )}
        
        {phase === 'countdown' && (
          <div 
            className="font-display text-8xl animate-pulse neon-glow"
            style={{ color: currentEvent.titleColor }}
          >
            {countdown}
          </div>
        )}
        
        {phase === 'recovery' && (
          <div className="animate-scale-bounce">
            {/* Face */}
            <div className="text-6xl mb-4 animate-bounce-subtle">
              {recoveryMessage.face}
            </div>
            
            {/* Heading */}
            <h2 className="font-display text-2xl text-[#ffd60a] neon-glow mb-3">
              {recoveryMessage.heading}
            </h2>
            
            {/* Body */}
            <p className="text-sm text-[#555] leading-relaxed mb-6">
              {recoveryMessage.body}
            </p>
            
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="chaos-btn px-6 py-2 rounded-xl text-white gradient-primary font-display tracking-wider"
            >
              ok fine, continue 😮‍💨
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
