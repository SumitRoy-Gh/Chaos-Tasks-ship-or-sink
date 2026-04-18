'use client'

import dynamic from 'next/dynamic'

const HomeBackground = dynamic(() => import('@/components/three/HomeBackground'), { ssr: false })

interface HomeScreenProps {
  onStartGame: () => void
  onSpinFirst: () => void
}

export default function HomeScreen({ onStartGame, onSpinFirst }: HomeScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-20 pb-24">
      <HomeBackground />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-[400px] mx-auto">
        {/* Explosion emoji */}
        <span className="text-[72px] animate-bounce-subtle">💥</span>
        
        {/* CHAOS */}
        <h1 className="font-display text-[5rem] leading-none animate-chromatic animate-glitch tracking-wider">
          CHAOS
        </h1>
        
        {/* TASKS */}
        <h1 className="font-display text-[5rem] leading-none text-[#ffd60a] neon-glow animate-bounce-subtle tracking-wider">
          TASKS
        </h1>
        
        {/* Rainbow divider */}
        <div className="w-full my-4 rainbow-line" />
        
        {/* Subtitle */}
        <p className="text-sm text-[#666] leading-relaxed mb-6">
          Weird tasks. Real proof. Sarcastic AI judge. Also we will randomly break your screen. You&apos;re welcome.
        </p>
        
        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          className="w-full py-3 rounded-xl gradient-primary chaos-btn text-2xl text-white mb-3"
        >
          START GAME →
        </button>
        
        {/* Spin First Button */}
        <button
          onClick={onSpinFirst}
          className="w-full py-3 rounded-xl bg-[#1a1a1a] border border-[#333] chaos-btn text-lg text-[#888] hover:text-white hover:border-[#555]"
        >
          🎡 Spin the Wheel First
        </button>
        
        {/* Warning card */}
        <div className="mt-6 p-4 rounded-xl bg-[#0d0d0d] border border-[#ff4d00]/30">
          <p className="text-xs text-[#666] leading-relaxed">
            ⚠️ This app may randomly show you your deepest fears, question your relationship status, or just go black. We are deeply unrepentant.
          </p>
        </div>
        
        {/* Footer */}
        <p className="mt-6 text-[10px] text-[#444]">
          Chaos Tasks © 2026 | Built for pure audacity
        </p>
      </div>
    </div>
  )
}
