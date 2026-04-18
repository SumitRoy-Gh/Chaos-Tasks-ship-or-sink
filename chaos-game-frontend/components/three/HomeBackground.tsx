'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = ['#ff4d00', '#ff00aa', '#bf5fff', '#00e5ff', '#39ff14']

function Icosahedron() {
  const meshRef = useRef<THREE.LineSegments>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { size } = useThree()
  
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 1)
    return new THREE.EdgesGeometry(geo)
  }, [])
  
  const colors = useMemo(() => {
    const edgeCount = geometry.attributes.position.count
    const colorArray = new Float32Array(edgeCount * 3)
    for (let i = 0; i < edgeCount; i++) {
      const color = new THREE.Color(COLORS[i % COLORS.length])
      colorArray[i * 3] = color.r
      colorArray[i * 3 + 1] = color.g
      colorArray[i * 3 + 2] = color.b
    }
    return colorArray
  }, [geometry])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    meshRef.current.rotation.x = time * 0.1 + mouseRef.current.y * 0.3
    meshRef.current.rotation.y = time * 0.15 + mouseRef.current.x * 0.3
    
    // Update colors cycling
    const positions = geometry.attributes.position.count
    const colorAttr = meshRef.current.geometry.attributes.color
    if (colorAttr) {
      for (let i = 0; i < positions; i++) {
        const colorIndex = Math.floor((i + time * 2) % COLORS.length)
        const color = new THREE.Color(COLORS[colorIndex])
        colorAttr.setXYZ(i, color.r, color.g, color.b)
      }
      colorAttr.needsUpdate = true
    }
  })
  
  // Mouse tracking
  if (typeof window !== 'undefined') {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
      mouseRef.current.x = (clientX / size.width - 0.5) * 2
      mouseRef.current.y = (clientY / size.height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)
  }
  
  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[geometry.attributes.position.array, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.8} />
    </lineSegments>
  )
}

function Particles({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const [positions, particleColors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      cols[i * 3] = color.r
      cols[i * 3 + 1] = color.g
      cols[i * 3 + 2] = color.b
    }
    
    return [pos, cols]
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position
    
    for (let i = 0; i < count; i++) {
      posAttr.setY(i, posAttr.getY(i) + 0.01)
      if (posAttr.getY(i) > 5) {
        posAttr.setY(i, -5)
      }
    }
    posAttr.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.4} />
    </points>
  )
}

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Icosahedron />
        <Particles count={300} />
      </Canvas>
    </div>
  )
}
