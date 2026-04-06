'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Html } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

function CagePosts() {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 3.5;
        const z = Math.sin(angle) * 3.5;
        return (
          <mesh key={i} position={[x, 1.6, z]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 3.2]} />
            <meshStandardMaterial color="#4f46e5" metalness={0.9} roughness={0.18} />
          </mesh>
        );
      })}
    </group>
  );
}

function Arena() {
  return (
    <group position={[0, -1.3, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.6, 8]} />
        <meshStandardMaterial color="#111318" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.85, 1.95, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <CagePosts />
    </group>
  );
}

function FighterSilhouette({ side, progress }: { side: 'left' | 'right'; progress: number }) {
  const group = useRef<THREE.Group>(null!);
  const direction = side === 'left' ? 1 : -1;
  const color = side === 'left' ? '#ef4444' : '#3b82f6';

  useFrame((state) => {
    if (!group.current) return;
    const bob = Math.sin(state.clock.elapsedTime * 1.8 + (side === 'left' ? 0 : Math.PI)) * 0.06;
    const xStart = side === 'left' ? -4.2 : 4.2;
    const xEnd = side === 'left' ? -1.45 : 1.45;
    group.current.position.x = THREE.MathUtils.lerp(xStart, xEnd, progress);
    group.current.position.y = bob;
    group.current.rotation.y = THREE.MathUtils.lerp(side === 'left' ? 0.35 : -0.35, side === 'left' ? -0.1 : 0.1, progress);
  });

  return (
    <group ref={group} position={[side === 'left' ? -4.2 : 4.2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh position={[0, 1.65, 0]} castShadow>
          <capsuleGeometry args={[0.42, 1.3, 10, 20]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.48} emissive={color} emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0, 2.85, 0]} castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.48} emissive={color} emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0.38 * direction, 2.05, 0]} rotation={[0, 0, side === 'left' ? -0.85 : 0.85]} castShadow>
          <capsuleGeometry args={[0.12, 0.8, 6, 12]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[-0.38 * direction, 2.05, 0]} rotation={[0, 0, side === 'left' ? 0.45 : -0.45]} castShadow>
          <capsuleGeometry args={[0.12, 0.8, 6, 12]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0.18, 0.4, 0]} rotation={[0, 0, 0.1]} castShadow>
          <capsuleGeometry args={[0.13, 1.0, 6, 12]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[-0.18, 0.4, 0]} rotation={[0, 0, -0.1]} castShadow>
          <capsuleGeometry args={[0.13, 1.0, 6, 12]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
        </mesh>
      </Float>

      <Html position={[0, 3.8, 0]} center>
        <div className="rounded-full border border-white/10 bg-black/55 px-3 py-2 text-center backdrop-blur-md min-w-[150px]">
          <div className="text-sm font-bold text-white">{side === 'left' ? 'ILIA TOPURIA' : 'JUSTIN GAETHJE'}</div>
          <div className="text-xs text-zinc-300">{side === 'left' ? '16-0 • Cleaner control' : '25-5 • Early danger'}</div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ progress }: { progress: number }) {
  const cameraRig = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!cameraRig.current) return;
    cameraRig.current.position.z = THREE.MathUtils.lerp(7.2, 5.2, progress);
    cameraRig.current.position.y = THREE.MathUtils.lerp(1.7, 1.25, progress);
  });

  return (
    <group ref={cameraRig}>
      <ambientLight intensity={0.45} />
      <spotLight position={[5, 9, 6]} intensity={1.6} angle={0.3} penumbra={1} castShadow color="#ef4444" />
      <spotLight position={[-5, 9, 6]} intensity={1.4} angle={0.34} penumbra={1} castShadow color="#3b82f6" />
      <pointLight position={[0, 3.5, 2.5]} intensity={1.1} color="#fbbf24" />
      <Arena />
      <FighterSilhouette side="left" progress={progress} />
      <FighterSilhouette side="right" progress={progress} />
      <Environment preset="night" />
    </group>
  );
}

export default function WhiteHousePage() {
  const [autoMotion, setAutoMotion] = useState(true);
  const { scrollYProgress } = useScroll();
  const closeness = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const heroHeight = useMemo(() => 'min-h-[160vh]', []);

  return (
    <div className={`bg-gradient-to-b from-void to-graphite-dark ${heroHeight}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_35%)]" />

        <Canvas camera={{ position: [0, 1.6, 7.2], fov: 42 }} shadows>
          <Scene progress={autoMotion ? 0.45 : 0} />
        </Canvas>

        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: 1 }}>
          <div className="absolute top-8 left-6 right-6 flex justify-between items-start pointer-events-auto">
            <Link href="/" className="text-sm text-zinc-300 hover:text-white transition">
              ← Back to Home
            </Link>
            <button
              onClick={() => setAutoMotion(!autoMotion)}
              className="px-4 py-2 rounded-full border border-white/10 bg-black/40 text-white text-sm backdrop-blur-md"
            >
              {autoMotion ? 'Scroll Mode On' : 'Lock Hero'}
            </button>
          </div>

          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center max-w-4xl px-6 pointer-events-auto">
            <div className="inline-block px-4 py-2 bg-signal-red/20 border border-signal-red rounded-full mb-4 text-signal-red text-sm font-bold uppercase tracking-wider">
              White House Main Event • Cinematic Hero
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.92] mb-4">
              TOPURIA VS GAETHJE
              <br />
              <span className="text-gold">THE PRESSURE CLOSES</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              This is not a poster. It is a live event hero built to create tension as the user scrolls deeper into the White House board. Cleaner side vs danger side. Control vs violence. Edge vs variance.
            </p>
          </div>

          <motion.div
            className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 pointer-events-auto"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-signal-red/20 bg-black/45 backdrop-blur-xl p-5">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Left Side</p>
                <h3 className="text-2xl font-extrabold text-white mb-2">Ilia Topuria</h3>
                <p className="text-sm text-zinc-300">16-0 • Cleaner sequencing, defensive wrestling, better phase control.</p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-black/45 backdrop-blur-xl p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Main Event Read</p>
                <div className="text-4xl font-extrabold text-gold mb-1">68%</div>
                <p className="text-sm text-zinc-300">High-confidence spot. Medium volatility.</p>
              </div>
              <div className="rounded-2xl border border-indigo/20 bg-black/45 backdrop-blur-xl p-5">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Right Side</p>
                <h3 className="text-2xl font-extrabold text-white mb-2">Justin Gaethje</h3>
                <p className="text-sm text-zinc-300">25-5 • Early danger, chaos upside, knockout variance in rounds 1–2.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary text-center pointer-events-auto">
                UNLOCK ALL 13 WHITE HOUSE PICKS
              </Link>
              <Link href="/methodology" className="btn-secondary text-center pointer-events-auto">
                SEE HOW WE FRAME EDGE
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.22em] text-zinc-400">
            Scroll to tighten the scene
          </div>
        </motion.div>
      </div>
    </div>
  );
}
