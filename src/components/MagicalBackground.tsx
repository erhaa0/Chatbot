import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";

function Particles({ count = 3000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const particlesData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const randomness = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      randomness[i] = Math.random();
    }
    return { pos, velocities, randomness };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse position
    mouse.x = THREE.MathUtils.lerp(mouse.x, targetMouse.x, 0.1);
    mouse.y = THREE.MathUtils.lerp(mouse.y, targetMouse.y, 0.1);

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Float movement
        positions[i3] += particlesData.velocities[i3];
        positions[i3 + 1] += particlesData.velocities[i3 + 1];
        
        // Swirl around mouse
        const dx = (mouse.x * 6) - positions[i3];
        const dy = (mouse.y * 6) - positions[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 4) {
            const force = (4 - dist) / 4;
            positions[i3] += dx * 0.02 * force;
            positions[i3 + 1] += dy * 0.02 * force;
        }

        // Boundary wrap
        if (positions[i3] > 8) positions[i3] = -8;
        if (positions[i3] < -8) positions[i3] = 8;
        if (positions[i3 + 1] > 8) positions[i3 + 1] = -8;
        if (positions[i3 + 1] < -8) positions[i3 + 1] = 8;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    pointsRef.current.rotation.z = time * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={particlesData.pos} stride={3}>
      <PointMaterial
        transparent
        color="#ff69b4"
        size={0.35}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1}
      />
    </Points>
  );
}

function Sparkles({ count = 800 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.position.y = Math.sin(time * 0.2) * 0.5;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function MagicTail({ mouse }: { mouse: { x: number, y: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const count = 50;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const trail = useRef<{ x: number, y: number }[]>([]);

  useFrame((state) => {
    if (!pointsRef.current || !ringRef.current) return;
    
    // Add current mouse to trail
    trail.current.push({ ...mouse });
    if (trail.current.length > count) trail.current.shift();

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < trail.current.length; i++) {
        const i3 = i * 3;
        pos[i3] = trail.current[i].x * 5;
        pos[i3 + 1] = trail.current[i].y * 5;
        pos[i3 + 2] = 0;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Smooth ring follow
    ringRef.current.position.x = THREE.MathUtils.lerp(ringRef.current.position.x, mouse.x * 5, 0.2);
    ringRef.current.position.y = THREE.MathUtils.lerp(ringRef.current.position.y, mouse.y * 5, 0.2);
    ringRef.current.rotation.z += 0.05;
    ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.1);
  });

  return (
    <>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ff00ff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </Points>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

const MagicalBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glMouse, setGlMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setGlMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#030305]">
      {/* Interactive Cursor Glow */}
      <motion.div 
        className="fixed w-4 h-4 bg-pink-400 rounded-full blur-sm pointer-events-none z-50 mix-blend-screen shadow-[0_0_25px_#f472b6]"
        animate={{ x: mousePos.x - 8, y: mousePos.y - 8 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
      />
      <motion.div 
        className="fixed w-48 h-48 bg-pink-600/15 rounded-full blur-[80px] pointer-events-none z-40"
        animate={{ x: mousePos.x - 96, y: mousePos.y - 96 }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
      />
      <motion.div 
        className="fixed w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-30"
        animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
      />

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#4c1d95" />
        <spotLight position={[0, 5, 0]} intensity={2} color="#ec4899" />
        <Particles count={7000} />
        <Sparkles count={1500} />
        <MagicTail mouse={glMouse} />
        <color attach="background" args={["#030305"]} />
        <fog attach="fog" args={["#030305", 0, 20]} />
      </Canvas>
      {/* Immersive effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_90%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-pink-500/[0.03] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-purple-900/[0.15] rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-900/[0.15] rounded-full blur-[130px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default MagicalBackground;
