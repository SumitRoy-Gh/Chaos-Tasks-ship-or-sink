'use client'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        {/* Outer ring - orange */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff4d00]"
          style={{ animation: 'spin-ring 1s linear infinite' }}
        />
        {/* Middle ring - pink */}
        <div 
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#ff00aa]"
          style={{ animation: 'spin-ring 0.8s linear infinite reverse' }}
        />
        {/* Inner ring - cyan */}
        <div 
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-[#00e5ff]"
          style={{ animation: 'spin-ring 0.6s linear infinite' }}
        />
      </div>
      <p className="text-base animate-chromatic" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {message}
      </p>
    </div>
  )
}
