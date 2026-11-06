import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Pointer = { x: number; y: number }

function ClayMaterial({
  color,
  roughness = 0.72,
}: {
  color: string
  roughness?: number
}) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} />
}

function AvatarRig({ pointer }: { pointer: React.MutableRefObject<Pointer> }) {
  const head = useRef<THREE.Group>(null)
  const pupilL = useRef<THREE.Mesh>(null)
  const pupilR = useRef<THREE.Mesh>(null)
  const target = useMemo(() => new THREE.Vector3(), [])
  const { size } = useThree()

  useFrame((_, delta) => {
    const px = pointer.current.x
    const py = pointer.current.y
    const lookX = THREE.MathUtils.clamp(px * 0.55, -0.55, 0.55)
    const lookY = THREE.MathUtils.clamp(py * 0.35, -0.35, 0.35)

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        lookX * 0.55,
        6,
        delta,
      )
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        -lookY * 0.35,
        6,
        delta,
      )
    }

    target.set(lookX * 2.4, lookY * 1.6 + 0.15, 2.2)
    const max = 0.085
    for (const pupil of [pupilL.current, pupilR.current]) {
      if (!pupil) continue
      const local = pupil.parent!.worldToLocal(target.clone())
      pupil.position.x = THREE.MathUtils.damp(
        pupil.position.x,
        THREE.MathUtils.clamp(local.x * 0.08, -max, max),
        10,
        delta,
      )
      pupil.position.y = THREE.MathUtils.damp(
        pupil.position.y,
        THREE.MathUtils.clamp(local.y * 0.08, -max, max),
        10,
        delta,
      )
    }

    void size
  })

  return (
    <group position={[0, -0.55, 0]}>
      {/* hoodie body */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <capsuleGeometry args={[0.72, 0.9, 8, 16]} />
        <ClayMaterial color="#2a2d33" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.05, 0.05]} castShadow>
        <torusGeometry args={[0.55, 0.18, 16, 32]} />
        <ClayMaterial color="#32363d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.15, 0.12]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.55, 0.12, 0.35]} />
        <ClayMaterial color="#15171b" roughness={0.9} />
      </mesh>

      <group ref={head} position={[0, 0.95, 0]}>
        {/* head */}
        <mesh castShadow>
          <sphereGeometry args={[0.72, 48, 48]} />
          <ClayMaterial color="#f0c3a8" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.15, 0]} scale={[1.02, 0.92, 0.95]}>
          <sphereGeometry args={[0.7, 48, 48]} />
          <ClayMaterial color="#f0c3a8" roughness={0.62} />
        </mesh>

        {/* ears */}
        <mesh position={[-0.68, 0.02, 0]} scale={[0.28, 0.38, 0.22]}>
          <sphereGeometry args={[1, 24, 24]} />
          <ClayMaterial color="#e8b498" />
        </mesh>
        <mesh position={[0.68, 0.02, 0]} scale={[0.28, 0.38, 0.22]}>
          <sphereGeometry args={[1, 24, 24]} />
          <ClayMaterial color="#e8b498" />
        </mesh>

        {/* nose */}
        <mesh position={[0, -0.05, 0.68]} scale={[0.14, 0.14, 0.16]}>
          <sphereGeometry args={[1, 20, 20]} />
          <ClayMaterial color="#e4ae92" />
        </mesh>

        {/* brows */}
        <mesh position={[-0.24, 0.28, 0.62]} rotation={[0.1, 0, 0.08]}>
          <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
          <ClayMaterial color="#2b2b2b" />
        </mesh>
        <mesh position={[0.24, 0.28, 0.62]} rotation={[0.1, 0, -0.08]}>
          <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
          <ClayMaterial color="#2b2b2b" />
        </mesh>

        {/* mouth */}
        <mesh position={[0, -0.32, 0.64]} rotation={[1.2, 0, 0]}>
          <torusGeometry args={[0.12, 0.018, 8, 20, Math.PI]} />
          <ClayMaterial color="#c57d6c" roughness={0.5} />
        </mesh>

        {/* hair volume */}
        <mesh position={[0, 0.42, -0.05]} scale={[1.08, 0.7, 1.05]}>
          <sphereGeometry args={[0.72, 40, 40]} />
          <ClayMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.15, 0.7, 0.15]} rotation={[0.4, -0.4, -0.5]} scale={[0.55, 0.35, 0.45]}>
          <sphereGeometry args={[1, 32, 32]} />
          <ClayMaterial color="#141414" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.55, 0.25]} rotation={[0.2, 0.3, 0.2]} scale={[0.35, 0.25, 0.3]}>
          <sphereGeometry args={[1, 28, 28]} />
          <ClayMaterial color="#171717" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, -0.55]} scale={[0.95, 0.75, 0.45]}>
          <sphereGeometry args={[0.7, 28, 28]} />
          <ClayMaterial color="#121212" roughness={0.92} />
        </mesh>

        {/* left eye */}
        <group position={[-0.24, 0.1, 0.62]}>
          <mesh>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color="#f7f7f7" roughness={0.35} />
          </mesh>
          <mesh ref={pupilL} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color="#111111" roughness={0.4} />
          </mesh>
          <mesh position={[-0.025, 0.03, 0.145]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* right eye */}
        <group position={[0.24, 0.1, 0.62]}>
          <mesh>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color="#f7f7f7" roughness={0.35} />
          </mesh>
          <mesh ref={pupilR} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color="#111111" roughness={0.4} />
          </mesh>
          <mesh position={[-0.025, 0.03, 0.145]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export function InteractiveAvatar() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-full select-none"
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
        camera={{ position: [0, 0.35, 3.1], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[2.5, 3.5, 2]} intensity={1.15} color="#fff2e8" />
        <directionalLight position={[-2.5, 1.5, 1]} intensity={0.55} color="#8eb7ff" />
        <directionalLight position={[1.5, 0.5, -2]} intensity={0.35} color="#c48cff" />
        <AvatarRig pointer={pointer} />
      </Canvas>
    </div>
  )
}
