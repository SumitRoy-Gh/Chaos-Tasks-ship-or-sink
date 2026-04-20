'use client'

type Tab = 'home' | 'spin' | 'board' | 'dash'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home', label: 'HOME', emoji: '🏠' },
  { id: 'spin', label: 'SPIN', emoji: '🎡' },
  { id: 'board', label: 'BOARD', emoji: '🏆' },
  { id: 'dash', label: 'DASH', emoji: '📊' },
]

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#060606]/95 backdrop-blur-sm">
      {/* Top gradient line */}
      <div className="rainbow-line" />
      
      <div className="max-w-[480px] mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all
                ${activeTab === tab.id 
                  ? 'gradient-primary text-white' 
                  : 'text-[#666] hover:text-[#888]'
                }
              `}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span className="font-display text-xs tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
