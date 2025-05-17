import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Shadow,
  PivotControls,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { Car } from "./RaycastingModel";
import Navbar from "./Navbar";
import { Tesla } from "./Tesla";

const Experience = () => {
  const [file, setFile] = React.useState(null);

  // file uploading
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".glb")) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a .glb file");
    }
  };

  // enviroment controls
  const { env } = useControls("Environment", {
    env: {
      options: ["city", "sunset", "forest", "night", "apartment", null],
      label: "HDRI",
    },
  });

  // piviot controls
  const { showPivot } = useControls({
    showPivot: {
      value: false,
      label: "Show Pivot Controls",
    },
  });

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="absolute z-10 top-0 mt-12 ml-12">
        <label className="h-32 w-48 border border-gray-400 rounded-lg ring-gray-500 flex items-center justify-center text-gray-600 cursor-pointer">
          Click to upload model
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".glb,.gltf"
            className="hidden"
          />
        </label>
      </div>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={window.devicePixelRatio > 1 ? 1.5 : 1}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <OrbitControls
          maxPolarAngle={Math.PI / 2.2}
          minDistance={2}
          maxDistance={15}
          enablePan={false}
          makeDefault
        />
        <Lights />
        {env && <Environment preset={env} />}
        <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="white"
          />
        </GizmoHelper>
        <PivotControls
          anchor={[0, 0.5, 0]}
          depthTest={false}
          scale={1}
          lineWidth={4}
          enabled={showPivot}
        >
          <Car file={file} />
        </PivotControls>
        <Grid infiniteGrid fadeDistance={30} />
      </Canvas>
    </div>
  );
};

export default Experience;

const Lights = () => {
  const dirLightRef = useRef();
  const pointLightRef = useRef();
  const dirHelperRef = useRef();
  const pointHelperRef = useRef();

  const directional = useControls("Directional Light", {
    intensity: { value: 1, min: 0, max: 10 },
    position: { value: [5, 5, 5] },
    helper: false,
  });

  const point = useControls("Point Light", {
    intensity: { value: 1, min: 0, max: 10 },
    position: { value: [-5, 3, 2] },
    helper: false,
  });

  useEffect(() => {
    if (dirHelperRef.current) {
      dirHelperRef.current.color = new THREE.Color("red");
      dirHelperRef.current.update();
    }
    if (pointHelperRef.current) {
      pointHelperRef.current.color = new THREE.Color("red");
      pointHelperRef.current.update();
    }
  }, [
    directional.helper,
    point.helper,
    directional.helperColor,
    point.helperColor,
  ]);

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
