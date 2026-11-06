import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Pointer = { x: number; y: number }

function Clay({ color, roughness = 0.7 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
}

function AvatarModel({ pointer }: { pointer: React.MutableRefObject<Pointer> }) {
  const head = useRef<THREE.Group>(null)
  const pupilL = useRef<THREE.Mesh>(null)
  const pupilR = useRef<THREE.Mesh>(null)
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const lx = THREE.MathUtils.clamp(pointer.current.x * 0.5, -0.5, 0.5)
    const ly = THREE.MathUtils.clamp(pointer.current.y * 0.32, -0.32, 0.32)

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, lx * 0.5, 7, delta)
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -ly * 0.32, 7, delta)
    }

    look.set(lx * 2.2, ly * 1.4 + 0.1, 2)
    const max = 0.075
    for (const pupil of [pupilL.current, pupilR.current]) {
      if (!pupil?.parent) continue
      const local = pupil.parent.worldToLocal(look.clone())
      pupil.position.x = THREE.MathUtils.damp(
        pupil.position.x,
        THREE.MathUtils.clamp(local.x * 0.07, -max, max),
        12,
        delta,
      )
      pupil.position.y = THREE.MathUtils.damp(
        pupil.position.y,
        THREE.MathUtils.clamp(local.y * 0.07, -max, max),
        12,
        delta,
      )
    }
  })

  return (
    <group position={[0, -0.7, 0]}>
      {/* hoodie */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <capsuleGeometry args={[0.78, 0.95, 10, 20]} />
        <Clay color="#2c3036" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.12, 0.02]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[0.58, 0.2, 18, 36]} />
        <Clay color="#353a41" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.22, 0.16]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.28]} />
        <Clay color="#121417" roughness={0.92} />
      </mesh>
      {/* drawstrings */}
      <mesh position={[-0.12, -0.05, 0.55]}>
        <capsuleGeometry args={[0.018, 0.28, 4, 8]} />
        <Clay color="#1a1d22" />
      </mesh>
      <mesh position={[0.12, -0.05, 0.55]}>
        <capsuleGeometry args={[0.018, 0.28, 4, 8]} />
        <Clay color="#1a1d22" />
      </mesh>

      <group ref={head} position={[0, 1.05, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.74, 64, 64]} />
          <Clay color="#efc2a7" roughness={0.58} />
        </mesh>
        <mesh position={[0, -0.12, 0]} scale={[1.01, 0.9, 0.96]}>
          <sphereGeometry args={[0.72, 48, 48]} />
          <Clay color="#efc2a7" roughness={0.58} />
        </mesh>

        {/* ears */}
        <mesh position={[-0.7, 0.02, -0.02]} scale={[0.26, 0.36, 0.2]}>
          <sphereGeometry args={[1, 24, 24]} />
          <Clay color="#e6b396" />
        </mesh>
        <mesh position={[0.7, 0.02, -0.02]} scale={[0.26, 0.36, 0.2]}>
          <sphereGeometry args={[1, 24, 24]} />
          <Clay color="#e6b396" />
        </mesh>

        {/* hair */}
        <mesh position={[0, 0.38, -0.08]} scale={[1.05, 0.72, 1.05]}>
          <sphereGeometry args={[0.74, 48, 48]} />
          <Clay color="#151515" roughness={0.92} />
        </mesh>
        <mesh position={[-0.18, 0.72, 0.18]} rotation={[0.45, -0.45, -0.55]} scale={[0.52, 0.32, 0.42]}>
          <sphereGeometry args={[1, 36, 36]} />
          <Clay color="#101010" roughness={0.92} />
        </mesh>
        <mesh position={[0.18, 0.58, 0.22]} rotation={[0.25, 0.25, 0.15]} scale={[0.34, 0.24, 0.28]}>
          <sphereGeometry args={[1, 28, 28]} />
          <Clay color="#121212" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.18, -0.58]} scale={[0.95, 0.72, 0.42]}>
          <sphereGeometry args={[0.72, 28, 28]} />
          <Clay color="#0f0f0f" roughness={0.94} />
        </mesh>

        {/* brows */}
        <mesh position={[-0.24, 0.28, 0.64]} rotation={[0.15, 0, 0.05]}>
          <capsuleGeometry args={[0.04, 0.15, 4, 8]} />
          <Clay color="#1d1d1d" />
        </mesh>
        <mesh position={[0.24, 0.28, 0.64]} rotation={[0.15, 0, -0.05]}>
          <capsuleGeometry args={[0.04, 0.15, 4, 8]} />
          <Clay color="#1d1d1d" />
        </mesh>

        {/* nose */}
        <mesh position={[0, -0.02, 0.7]} scale={[0.13, 0.13, 0.15]}>
          <sphereGeometry args={[1, 20, 20]} />
          <Clay color="#e4ae90" />
        </mesh>

        {/* mouth */}
        <mesh position={[0, -0.3, 0.66]} rotation={[1.15, 0, 0]}>
          <torusGeometry args={[0.11, 0.015, 8, 24, Math.PI]} />
          <Clay color="#c57d6c" roughness={0.45} />
        </mesh>

        {/* eyes */}
        <group position={[-0.24, 0.1, 0.64]}>
          <mesh>
            <sphereGeometry args={[0.125, 28, 28]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
          </mesh>
          <mesh ref={pupilL} position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.065, 20, 20]} />
            <meshStandardMaterial color="#111" roughness={0.35} />
          </mesh>
          <mesh position={[-0.02, 0.025, 0.13]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.35} />
          </mesh>
        </group>
        <group position={[0.24, 0.1, 0.64]}>
          <mesh>
            <sphereGeometry args={[0.125, 28, 28]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
          </mesh>
          <mesh ref={pupilR} position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.065, 20, 20]} />
            <meshStandardMaterial color="#111" roughness={0.35} />
          </mesh>
          <mesh position={[-0.02, 0.025, 0.13]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.35} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export function CartoonAvatar() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })

  return (
    <div
      className="relative mx-auto h-[58vh] max-h-[620px] w-full"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        pointer.current = {
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
        }
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 }
      }}
    >
      <Canvas
        camera={{ position: [0, 0.45, 3.35], fov: 30 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.4, 3.2, 2.2]} intensity={1.15} color="#fff1e6" />
        <directionalLight position={[-2.8, 1.4, 1.2]} intensity={0.45} color="#8eb7ff" />
        <directionalLight position={[1.2, 0.8, -2.4]} intensity={0.28} color="#c48cff" />
        <AvatarModel pointer={pointer} />
      </Canvas>
    </div>
  )
}
