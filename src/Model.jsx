import { Center, useGLTF } from "@react-three/drei";
import React, { useState, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Model({ file }) {
  const [model, setModel] = useState(null);

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

  const { scene } = useGLTF("/car.glb");

  return (
    <Center>
      {model ? (
        <group scale={20}>
          {" "}
          <primitive object={model} />{" "}
        </group>
      ) : (
        <primitive object={scene} />
      )}
    </Center>
  );
}
