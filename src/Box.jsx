import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

function ModelWithDots() {
  const meshRef = useRef();
  const [dots, setDots] = useState([]);

  const handleClick = (event) => {
    event.stopPropagation();

    // `point` gives you the exact hit point on the surface
    const point = event.point;
    setDots((prev) => [...prev, point.clone()]);
  };

  return (
    <>
      {/* Your clickable model */}
      <group ref={meshRef}
          onPointerDown={handleClick}
          castShadow
          receiveShadow>
        <mesh
          
        >
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </group>

      {/* Dots on the surface */}
      {dots.map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      ))}
    </>
  );
}

export default function Box() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
      <directionalLight position={[5, 5, 5]} castShadow />
      <ModelWithDots />
      <OrbitControls />
    </Canvas>
  );
}
