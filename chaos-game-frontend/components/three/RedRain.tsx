'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function RainParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    
    return pos
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const posAttr = pointsRef.current.geometry.attributes.position
    
    for (let i = 0; i < count; i++) {
      posAttr.setY(i, posAttr.getY(i) - 0.02)
      if (posAttr.getY(i) < -5) {
        posAttr.setY(i, 5)
        posAttr.setX(i, (Math.random() - 0.5) * 10)
      }
    }
    posAttr.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ff1744" transparent opacity={0.7} />
    </points>
  )
}

export default function RedRain() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <RainParticles count={100} />
      </Canvas>
    </div>
  )
}
