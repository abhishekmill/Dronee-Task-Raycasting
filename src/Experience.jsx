import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import Model from "./Model";
import {
  Box,
  Environment,
  GizmoHelper,
  Grid,
  OrbitControls,
  Shadow,
  Stage,
} from "@react-three/drei";
import { Car } from "./Car";

const Expirence = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".glb")) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a .glb file");
    }
  };

  return (
    <>
      <div className="h-screen w-screen">
        <div className=" absolute  z-10 top-0 mt-12 ml-12">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".glb"
            className="h-48 w-48 border rounded-lg border-gray-400 ring-gray-500"
          />
        </div>
        <Canvas camera={{ position: [-3, 2, 4] }}>
          <ambientLight intensity={0.5} />
          <Environment preset="city" />
          <OrbitControls makeDefault />

          <Car file={file} />
          <Shadow scale={[5, 8, 1]} />
          <Grid infiniteGrid fadeDistance={30} />
        </Canvas>
      </div>
    </>
  );
};

export default Expirence;
