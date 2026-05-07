import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useStore } from '../state/useStore'
import * as THREE from 'three'

type AvatarModelProps = {
  modelPath?: string
  mousePosition: { x: number; y: number }
}

export function AvatarModel({ modelPath = '/avatar-default.glb', mousePosition }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const headRef = useRef<THREE.Mesh>(null!)
  const mouthRef = useRef<THREE.Mesh>(null!)
  const leftEyeRef = useRef<THREE.Mesh>(null!)
  const rightEyeRef = useRef<THREE.Mesh>(null!)
  const gltfGroupRef = useRef<THREE.Group>(null!)
  
  // Load GLTF model - handled by Suspense in AvatarScene
  const gltf = useGLTF(modelPath) as any
  const [useGeometric] = useState(false) // Reserved for explicit fallback if needed
  
  const { currentViseme, avatarExpression, isAvatarSpeaking } = useStore()
  
  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // GLTF model animations
    if (gltf && gltfGroupRef.current && !useGeometric) {
      // Rotate the entire GLTF model based on mouse
      const targetX = mousePosition.x * 0.3
      const targetY = mousePosition.y * 0.2
      
      gltfGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        gltfGroupRef.current.rotation.y,
        targetX,
        0.05
      )
      gltfGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        gltfGroupRef.current.rotation.x,
        -targetY,
        0.05
      )
      
      // Breathing animation
      gltfGroupRef.current.position.y = Math.sin(time * 2) * 0.02
      
      // Try to animate blend shapes if available
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.morphTargetInfluences) {
          // Lip sync with visemes
          const visemeIndex = Math.floor(currentViseme * child.morphTargetInfluences.length)
          child.morphTargetInfluences.forEach((_: number, index: number) => {
            child.morphTargetInfluences[index] = index === visemeIndex ? currentViseme : 0
          })
        }
      })
      
      return
    }
    
    // Geometric avatar animations (fallback)
    // Head movement - follow mouse
    if (headRef.current) {
      const targetX = mousePosition.x * 0.3
      const targetY = mousePosition.y * 0.2
      
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetX,
        0.05
      )
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -targetY,
        0.05
      )
    }
    
    // Idle breathing animation
    if (groupRef.current && !isAvatarSpeaking) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.02
    }
    
    // Blinking animation
    const blinkSpeed = 0.3
    const blinkCycle = (time * blinkSpeed) % 5
    const blinkValue = blinkCycle < 0.15 ? 1 - (blinkCycle / 0.15) * 0.8 : 1
    
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = blinkValue
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = blinkValue
    }
    
    // Mouth opening (lip sync)
    if (mouthRef.current) {
      const mouthOpenness = currentViseme * 0.5
      mouthRef.current.scale.y = 1 + mouthOpenness
      
      // Reset defaults
      mouthRef.current.scale.x = 1
      mouthRef.current.position.y = -0.3
      if (leftEyeRef.current) leftEyeRef.current.rotation.z = 0
      if (rightEyeRef.current) rightEyeRef.current.rotation.z = 0
      if (leftEyeRef.current) { leftEyeRef.current.scale.x = 1; leftEyeRef.current.scale.z = 1 }
      if (rightEyeRef.current) { rightEyeRef.current.scale.x = 1; rightEyeRef.current.scale.z = 1 }
      
      // Expression-based changes
      if (avatarExpression === 'happy') {
        mouthRef.current.scale.x = 1.2
      } else if (avatarExpression === 'sad') {
        mouthRef.current.scale.x = 0.8
        mouthRef.current.position.y = -0.32
      } else if (avatarExpression === 'surprised') {
        mouthRef.current.scale.x = 0.5
        mouthRef.current.scale.y = 1 + mouthOpenness + 0.3
        if (leftEyeRef.current) { leftEyeRef.current.scale.x = 1.3; leftEyeRef.current.scale.z = 1.3 }
        if (rightEyeRef.current) { rightEyeRef.current.scale.x = 1.3; rightEyeRef.current.scale.z = 1.3 }
      } else if (avatarExpression === 'angry') {
        mouthRef.current.scale.x = 0.9
        if (leftEyeRef.current) leftEyeRef.current.rotation.z = -0.2
        if (rightEyeRef.current) rightEyeRef.current.rotation.z = 0.2
      }
    }
    
    // Speaking animation - subtle head bob
    if (groupRef.current && isAvatarSpeaking) {
      groupRef.current.position.y = Math.sin(time * 8) * 0.01
    }
  })
  
  // Ensure the model is centered and visible
  const modelScale = 1.6
  const modelPosition: [number, number, number] = [0, -1.2, 0]

  // If GLTF loaded successfully
  if (gltf && !useGeometric) {
    return (
      <group ref={gltfGroupRef} position={modelPosition}>
        <primitive object={gltf.scene} scale={modelScale} />
      </group>
    )
  }
  
  // Geometric avatar fallback
  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Left Eye */}
      <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Right Eye */}
      <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.85]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 32]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/avatar-default.glb')
