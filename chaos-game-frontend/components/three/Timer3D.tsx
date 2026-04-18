'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TorusTimerProps {
  timeRemaining: number
  totalTime: number
}

function Torus({ timeRemaining, totalTime }: TorusTimerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isShaking, setIsShaking] = useState(false)
  
  const getColor = () => {
    const ratio = timeRemaining / totalTime
    if (ratio > 0.5) return '#00e5ff' // cyan
    if (ratio > 0.2) return '#ffd60a' // yellow
    return '#ff1744' // red
  }
  
  useEffect(() => {
    setIsShaking(timeRemaining <= 5 && timeRemaining > 0)
  }, [timeRemaining])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    meshRef.current.rotation.y = time * 2
    
    if (isShaking) {
      meshRef.current.rotation.x = Math.sin(time * 30) * 0.3
      meshRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.1)
    } else {
      meshRef.current.rotation.x = 0
      meshRef.current.scale.setScalar(1)
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshBasicMaterial color={getColor()} wireframe />
    </mesh>
  )
}

interface Timer3DProps {
  timeRemaining: number
  totalTime: number
}

export default function Timer3D({ timeRemaining, totalTime }: Timer3DProps) {
  return (
    <div className="relative w-24 h-24">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <Torus timeRemaining={timeRemaining} totalTime={totalTime} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="font-[var(--font-bangers)] text-[2.5rem] text-[#f5f5f5] neon-glow"
          style={{ fontFamily: 'Bangers, cursive' }}
        >
          {timeRemaining}
        </span>
      </div>
    </div>
  )
}
