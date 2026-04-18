'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = ['#ffd60a', '#ff4d00', '#ff00aa', '#00e5ff', '#39ff14']

function ExplosionParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array>()
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const vels = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
      
      // Random velocity in all directions
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 0.05 + Math.random() * 0.1
      
      vels[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
      vels[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
      vels[i * 3 + 2] = Math.cos(phi) * speed
      
      const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      cols[i * 3] = color.r
      cols[i * 3 + 1] = color.g
      cols[i * 3 + 2] = color.b
    }
    
    velocitiesRef.current = vels
    return [pos, cols]
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current || !velocitiesRef.current) return
    
    const posAttr = pointsRef.current.geometry.attributes.position
    const vels = velocitiesRef.current
    
    for (let i = 0; i < count; i++) {
      posAttr.setX(i, posAttr.getX(i) + vels[i * 3])
      posAttr.setY(i, posAttr.getY(i) + vels[i * 3 + 1] - 0.002) // gravity
      posAttr.setZ(i, posAttr.getZ(i) + vels[i * 3 + 2])
    }
    posAttr.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
    </points>
  )
}

export default function ParticleExplosion() {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!visible) return null
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-500" 
         style={{ opacity: visible ? 1 : 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ExplosionParticles count={500} />
      </Canvas>
    </div>
  )
}
