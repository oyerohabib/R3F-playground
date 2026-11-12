import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function Box(props: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const { speed } = useControls({ speed: { value: 0.5, min: 0, max: 3 } })

  useFrame((_, dt) => {
    ref.current.rotation.y += speed * dt
    const target = active ? 1.5 : 1
    const s = THREE.MathUtils.damp(ref.current.scale.x, target, 8, dt)
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setActive((a) => !a)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 6], fov: 45 }}>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls makeDefault enableDamping />
      {import.meta.env.DEV && <Perf position="top-left" />}
    </Canvas>
  )
}
