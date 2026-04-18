'use client'

import { useState, useMemo } from 'react'

const SUCCESS_MESSAGES = [
  (value: string) => `Saved '${value}' successfully! Also deleted your other answer. It was for the best.`,
  (value: string) => `Note taken: '${value}'. The rest has been yeeted into the void. ✨`,
  (value: string) => `'${value}' is safe with us. The chaos ate the other one. Delicious.`,
  (value: string) => `We stored '${value}'. Your other input has achieved enlightenment (it's gone).`,
]

const KNOWN_BUGS = [
  '🐛 Placeholder refuses to leave even when you type',
  '🐛 One field randomly erases on submit (it\'s a feature)',
  '🐛 App randomly attacks you every few minutes',
  '🐛 404 because you\'re single (nothing personal bestie)',
  '🐛 Screen goes black. No explanation. It comes back. Probably.',
]

export default function BugZoneScreen() {
  const [name, setName] = useState('')
  const [fear, setFear] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [savedValue, setSavedValue] = useState('')
  const [clearedField, setClearedField] = useState<'name' | 'fear' | null>(null)
  
  const successMessage = useMemo(() => {
    const randomMsg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
    return randomMsg(savedValue)
  }, [savedValue])
  
  const handleSubmit = () => {
    // Randomly clear one of the fields
    const clearName = Math.random() > 0.5
    
    if (clearName) {
      setSavedValue(fear || 'nothing (you left it blank)')
      setName('')
      setClearedField('name')
    } else {
      setSavedValue(name || 'nothing (you left it blank)')
      setFear('')
      setClearedField('fear')
    }
    
    setSubmitted(true)
  }
  
  const handleReset = () => {
    setName('')
    setFear('')
    setSubmitted(false)
    setSavedValue('')
    setClearedField(null)
  }
  
  return (
    <div className="flex flex-col px-4 pt-20 pb-24 gap-4">
      {/* Heading */}
      <div className="text-center mb-2">
        <h2 className="font-display text-3xl tracking-wider animate-chromatic animate-glitch">
          BUG ZONE
        </h2>
        <p className="text-[#666] text-sm">
          Where logic comes to die. Required by the organizers. 🫡
        </p>
      </div>
      
      {/* Buggy Input Card */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border-2 animate-rborder">
        <h3 className="font-display text-lg text-[#ff00aa] mb-4">BUGGY INPUTS</h3>
        
        {/* Input 1 - Name */}
        <div className="relative mb-4">
          <label className="block text-xs text-[#666] mb-1">Your name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#ff4d00]"
            />
            {/* Ghost placeholder that never fully disappears */}
            <span 
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity text-[#666]"
              style={{ opacity: clearedField === 'name' || name === '' ? 0.6 : 0.25 }}
            >
              Your name (it won&apos;t save lol)
            </span>
          </div>
        </div>
        
        {/* Input 2 - Fear */}
        <div className="relative mb-4">
          <label className="block text-xs text-[#666] mb-1">Your biggest fear</label>
          <div className="relative">
            <input
              type="text"
              value={fear}
              onChange={(e) => setFear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#ff4d00]"
            />
            {/* Ghost placeholder that never fully disappears */}
            <span 
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity text-[#666]"
              style={{ opacity: clearedField === 'fear' || fear === '' ? 0.6 : 0.25 }}
            >
              Your biggest fear (this field may vanish)
            </span>
          </div>
        </div>
        
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="chaos-btn w-full py-2.5 rounded-xl text-white gradient-primary font-display tracking-wider"
        >
          SUBMIT (at your own risk) ⚡
        </button>
      </div>
      
      {/* Success/Result card */}
      {submitted && (
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#39ff14] animate-scale-bounce">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✨</span>
            <span className="font-display text-lg text-[#39ff14]">SUBMITTED!</span>
          </div>
          <p className="text-sm text-[#888] leading-relaxed mb-3">
            {successMessage}
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-[#666] hover:text-[#888] underline"
          >
            Try again (it won&apos;t be different)
          </button>
        </div>
      )}
      
      {/* Known Bugs Card */}
      <div className="p-4 rounded-xl bg-[#0d0d0d] border-l-4 border-[#ff00aa] border-r border-t border-b border-r-[#222] border-t-[#222] border-b-[#222]">
        <h3 className="font-display text-lg text-[#ff00aa] mb-3">KNOWN BUGS</h3>
        <ul className="flex flex-col gap-2">
          {KNOWN_BUGS.map((bug, i) => (
            <li key={i} className="text-sm text-[#888]">
              {bug}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Disclaimer */}
      <p className="text-[10px] text-[#444] text-center">
        These bugs are features. We stand by our chaos.
      </p>
    </div>
  )
}
