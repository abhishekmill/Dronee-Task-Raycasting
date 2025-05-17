import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Shadow,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { Car } from "./Car";

const Lights = () => {
  const dirLightRef = useRef();
  const pointLightRef = useRef();
  const dirHelperRef = useRef();
  const pointHelperRef = useRef();

  const directional = useControls("Directional Light", {
    intensity: { value: 1, min: 0, max: 10 },
    position: { value: [5, 5, 5] },
    helper: false,
    helperColor: "#ff0000",
  });

  const point = useControls("Point Light", {
    intensity: { value: 1, min: 0, max: 10 },
    position: { value: [-5, 3, 2] },
    helper: false,
    helperColor: "#00ff00",
  });

  useEffect(() => {
    if (dirHelperRef.current) {
      dirHelperRef.current.color.set(directional.helperColor);
      dirHelperRef.current.update();
    }
    if (pointHelperRef.current) {
      pointHelperRef.current.color.set(point.helperColor);
      pointHelperRef.current.update();
    }
  }, [directional.helperColor, point.helperColor]);

  return (
    <>
      {/* Directional Light */}
      <directionalLight
        ref={dirLightRef}
        castShadow
        intensity={directional.intensity}
        position={directional.position}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {directional.helper && dirLightRef.current && (
        <primitive
          ref={dirHelperRef}
          object={new THREE.DirectionalLightHelper(dirLightRef.current, 1)}
        />
      )}

      {/* Point Light */}
      <pointLight
        ref={pointLightRef}
        intensity={point.intensity}
        position={point.position}
      />
      {point.helper && pointLightRef.current && (
        <primitive
          ref={pointHelperRef}
          object={new THREE.PointLightHelper(pointLightRef.current, 0.5)}
        />
      )}
    </>
  );
};

const Experience = () => {
  const [file, setFile] = React.useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".glb")) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a .glb file");
    }
  };

  //  Leva Environment Controls
  const { env } = useControls("Environment", {
    env: {
      options: ["city", "sunset", "forest", "night", "apartment", null],
      label: "HDRI",
    },
  });

  return (
    <div className="h-screen w-screen">
      <div className="absolute z-10 top-0 mt-12 ml-12">
        <label className="h-48 w-48 border border-gray-400 rounded-lg ring-gray-500 flex items-center justify-center text-gray-600 cursor-pointer">
          Click to upload model
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".glb,.gltf"
            className="hidden"
          />
        </label>
      </div>

      <Canvas camera={{ position: [-3, 2, 4], fov: 50 }} shadows>
        <OrbitControls makeDefault />
        <Lights />
        {env && <Environment preset={env} />}
        <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="white"
          />
        </GizmoHelper>
        <Car file={file} />
        <Shadow scale={[5, 8, 1]} />
        <Grid infiniteGrid fadeDistance={30} />
      </Canvas>
    </div>
  );
};

export default Experience;
