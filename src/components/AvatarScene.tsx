import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { AvatarModel } from './AvatarModel'

export function AvatarScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event
    const { width, height } = currentTarget.getBoundingClientRect()
    
    const x = (clientX / width) * 2 - 1
    const y = -(clientY / height) * 2 + 1
    
    setMousePosition({ x, y })
  }

  return (
    <div 
      className="avatar-scene"
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4a90e2" />
        <pointLight position={[5, 3, 5]} intensity={0.5} color="#e24a90" />
        
        {/* Avatar */}
        <Suspense fallback={null}>
          <AvatarModel mousePosition={mousePosition} />
        </Suspense>
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* Controls - disable for production, enable for testing */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  )
}
