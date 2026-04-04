'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

// 3D Octagon Arena Component
function OctagonArena() {
  return (
    <group position={[0, -1, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 8]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cage posts (8 sides) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        return (
          <mesh key={i} position={[x, 1.5, z]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 3]} />
            <meshStandardMaterial color="#4F46E5" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}
      
      {/* Canvas mat lines */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// Fighter Corner Component
function FighterCorner({ position, name, flag, record, isRed }: any) {
  return (
    <group position={position}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.4}
        color={isRed ? '#EF4444' : '#3B82F6'}
        anchorX="center"
        fontWeight="bold"
      >
        {name}
      </Text>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="#9CA3AF"
        anchorX="center"
      >
        {flag} {record}
      </Text>
    </group>
  );
}

// VS Divider
function VSDivider() {
  return (
    <group position={[0, 1.5, 0]}>
      <Text
        fontSize={1}
        color="#FBBF24"
        anchorX="center"
        fontWeight="bold"
      >
        VS
      </Text>
    </group>
  );
}

export default function WhiteHousePage() {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-void to-graphite-dark">
      {/* Header */}
      <div className="relative z-10 px-6 py-8">
        <Link href="/" className="text-sm text-graphite-light hover:text-white transition">
          ← Back to Home
        </Link>
      </div>

      {/* 3D Canvas */}
      <div className="h-screen w-full">
        <Canvas
          camera={{ position: [5, 3, 5], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.3} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <spotLight
            position={[-10, 10, -10]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          <OctagonArena />
          
          <FighterCorner
            position={[-4, 0, 0]}
            name="ILIA TOPURIA"
            flag="🇬🇪"
            record="16-0"
            isRed={true}
          />
          
          <FighterCorner
            position={[4, 0, 0]}
            name="JUSTIN GAETHJE"
            flag="🇺🇸"
            record="25-5"
            isRed={false}
          />
          
          <VSDivider />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={isRotating}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={15}
          />
          
          <Environment preset="night" />
          <ContactShadows opacity={0.5} blur={2} />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-block px-4 py-2 bg-signal-red/20 border border-signal-red rounded-full mb-4">
              <span className="text-signal-red font-bold text-sm">LIVE EVENT</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-2">
              UFC 322: WHITE HOUSE
            </h1>
            <p className="text-xl text-graphite-light">
              April 19, 2026 • Washington D.C.
            </p>
          </motion.div>
        </div>

        {/* Fighter Stats */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 pointer-events-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Topuria Stats */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-graphite/80 backdrop-blur-lg border border-signal-red/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-signal-red rounded-full flex items-center justify-center text-2xl">
                  🇬🇪
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Ilia Topuria</h3>
                  <p className="text-graphite-light text-sm">Featherweight Champion</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-graphite-light">Record</span>
                  <span className="text-white font-bold">16-0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Height</span>
                  <span className="text-white">5'7"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Reach</span>
                  <span className="text-white">69"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Age</span>
                  <span className="text-white">28</span>
                </div>
              </div>
            </motion.div>

            {/* Gaethje Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-graphite/80 backdrop-blur-lg border border-indigo/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo rounded-full flex items-center justify-center text-2xl">
                  🇺🇸
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Justin Gaethje</h3>
                  <p className="text-graphite-light text-sm">Former Interim Champion</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-graphite-light">Record</span>
                  <span className="text-white font-bold">25-5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Height</span>
                  <span className="text-white">5'11"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Reach</span>
                  <span className="text-white">71"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite-light">Age</span>
                  <span className="text-white">35</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-6 py-2 bg-graphite/80 backdrop-blur-lg border border-graphite-light/30 rounded-lg text-white hover:border-indigo transition"
            >
              {isRotating ? '⏸ Pause' : '▶ Rotate'}
            </button>
            <Link
              href="/pricing"
              className="px-6 py-2 bg-indigo hover:bg-indigo-light border border-indigo-light rounded-lg text-white font-bold transition"
            >
              🔓 Get Full Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
