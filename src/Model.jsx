import { Center, useGLTF } from "@react-three/drei";
import React, { useState, useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Model({ file }) {
  const [model, setModel] = useState(null);
  const [dots, setDots] = useState([]);
  const groupRef = useRef();

  // Load uploaded GLB
  useEffect(() => {
    if (file) {
      const loader = new GLTFLoader();
      loader.load(
        URL.createObjectURL(file),
        (gltf) => setModel(gltf.scene),
        undefined,
        (error) => console.error("Error loading model:", error.message)
      );
    }
  }, [file]);

  // Default GLB
  const { scene: defaultScene } = useGLTF("/car.glb");

  // Handle model click
  const handleClick = (event) => {
    event.stopPropagation();
    const point = event.point;
    setDots((prev) => [...prev, point.clone()]);
  };

  const modelToRender = model || defaultScene;

  return (
    <Center>
      <group
        ref={groupRef}
        scale={1}
        onPointerDown={handleClick}
        castShadow
        receiveShadow
      >
        <primitive object={modelToRender} />
        {/* Render dots */}
        {dots.map((pos, index) => (
          <mesh key={index} position={pos}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>
        ))}
      </group>
    </Center>
  );
}
