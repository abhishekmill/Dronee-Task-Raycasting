import React, { useRef, useState, useCallback, useEffect } from "react";
import { Html, Line, Plane, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export function Car({ file, props }) {
  const { nodes, materials } = useGLTF("/car.glb");
  const groupRef = useRef();
  const { camera, gl } = useThree();

  const [dots, setDots] = useState([]);
  const [hoverDot, setHoverDot] = useState(null); // 👈 hover dot state

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Click = add red dot
  const handleClick = useCallback(
    (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(groupRef.current, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        setDots((prev) => [...prev, point.clone()]);
      }
    },
    [camera, gl]
  );

  // Hover = update blue dot
  const handleMouseMove = useCallback(
    (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(groupRef.current, true);

      if (intersects.length > 0) {
        setHoverDot(intersects[0].point.clone());
      } else {
        setHoverDot(null);
      }
    },
    [camera, gl]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  const renderMesh = (geometry, material, key) => (
    <mesh
      key={key}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
    />
  );

  const [hidden, set] = useState();

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

    console.log(dots);
  }, [file]);

  const { scene } = useGLTF("/car.glb");
  return (
    <>
      {/* Clicked Dots */}
      {dots.map((pos, i) => (
        <>
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>

          <Html
            // occlude
            onOcclude={set}
            style={{
              transition: "all 0.5s",
              opacity: hidden ? 0 : 1,
              transform: `scale(${hidden ? 0.5 : 1})`,
            }}
            center
            distanceFactor={10}
            position={pos}
          >
            <div className="w-8 h-8 rounded-full border-black border-2 bg-white">
              <div className="flex justify-between text-center items-center px-2 ">
                {i + 1}
              </div>
            </div>
            <div className="flex flex-col text-sm ">
              {" "}
              <h1>X:{pos.x.toFixed(2)}</h1>
              <h1>Y:{pos.y.toFixed(2)}</h1>
            </div>
          </Html>
        </>
      ))}
      {/* Hover Dot  */}
      {hoverDot && (
        <mesh position={hoverDot}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="blue" transparent opacity={0.6} />
        </mesh>
      )}
      {/* creating lines */}
      {dots.length > 1 && (
        <Line
          points={dots}
          color="blue"
          lineWidth={4}
          dashed={false}
          // Below fixes z-fighting
        />
      )}
      {/* Car model */}
      <group ref={groupRef}>
        <Plane
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.3, 0]}
          scale={10}
        />
        {model ? (
          <group scale={2}>
            {" "}
            <primitive object={model} />{" "}
          </group>
        ) : (
          <group ref={groupRef} scale={0.013} {...props} dispose={null}>
            {renderMesh(
              nodes.Lamborghini_Aventador_Body.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_BodySG,
              "body"
            )}
            {renderMesh(
              nodes.Lamborghini_Aventador_Glass.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_GlassSG,
              "glass"
            )}
            {renderMesh(
              nodes.Lamborghini_Aventador_Wheel_FL.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_BodySG,
              "wheelFL"
            )}
            {renderMesh(
              nodes.Lamborghini_Aventador_Wheel_FR.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_BodySG,
              "wheelFR"
            )}
            {renderMesh(
              nodes.Lamborghini_Aventador_Wheel_RL.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_BodySG,
              "wheelRL"
            )}
            {renderMesh(
              nodes.Lamborghini_Aventador_Wheel_RR.geometry,
              materials._Lamborghini_AventadorLamborghini_Aventador_BodySG,
              "wheelRR"
            )}
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload("/car.glb");
