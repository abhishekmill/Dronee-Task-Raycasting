import React, { useRef, useState, useCallback, useEffect } from "react";
import { Html, Line, Plane, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshBVH } from "three-mesh-bvh";

export function Car({ file, props }) {
  const { nodes, materials } = useGLTF("/car.glb");
  const groupRef = useRef();
  const dynamicRef = useRef();
  const { camera, gl } = useThree();

  const [dots, setDots] = useState([]);
  const [hoverDot, setHoverDot] = useState(null); // hover dot state

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleClick = useCallback(
    (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        [groupRef.current, dynamicRef.current].filter(Boolean),
        true
      );

      if (intersects.length > 0) {
        const point = intersects[0].point;
        setDots((prev) => [...prev, point.clone()]);
      }
    },
    [camera, gl]
  );

  const handleMouseMove = useCallback(
    (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        [groupRef.current, dynamicRef.current].filter(Boolean), // avoid null
        true
      );

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
    canvas.addEventListener("dblclick", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("dblclick", handleClick);
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

  // loadeing our custom model
  useEffect(() => {
    if (file) {
      const loader = new GLTFLoader();
      loader.load(
        URL.createObjectURL(file),
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.boundsTree = new MeshBVH(child.geometry);
            }
          });
          setModel(gltf.scene);
        },

        undefined,
        (error) => console.error("Error loading model:", error.message)
      );
    }
  }, [file]);

  // converting standard mesh into mesh bvh
  useEffect(() => {
    Object.values(nodes).forEach((node) => {
      if (node.isMesh && node.geometry) {
        node.geometry.boundsTree = new MeshBVH(node.geometry);
      }
    });
  }, [nodes]);

  // resetting the point array
  useEffect(() => {
    setDots([]);
  }, [model]);

  return (
    <>
      {/* Clicked Dots */}
      {dots.map((pos, i) => (
        <React.Fragment key={i}>
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>

          <Html
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
            <div className="select-none w-8 h-8 rounded-full border-black border-2 bg-white">
              <div className="flex justify-between text-center items-center px-2">
                {i + 1}
              </div>
            </div>
            <div className="flex flex-col w-20 text-sm">
              <h1>X: {(pos.x * 10).toFixed(2)} m</h1>
              <h1>Y: {(pos.y * 10).toFixed(2)} m</h1>
              <h1>Z: {(pos.z * 10).toFixed(2)} m</h1>
            </div>
          </Html>
        </React.Fragment>
      ))}
      {/* Hover Dot  */}
      {hoverDot && (
        <mesh position={hoverDot}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="blue" transparent opacity={0.6} />
        </mesh>
      )}

      {dots.length > 0 && hoverDot && (
        <Line
          points={[dots[dots.length - 1], hoverDot]}
          color="red"
          lineWidth={4}
          dashed={false}
        />
      )}
      {/* creating lines */}
      {dots.length > 1 && (
        <Line points={dots} color="blue" lineWidth={4} dashed={false} />
      )}
      <group ref={groupRef}>
        <Plane
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.3, 0]}
          scale={10}
        />
        {/* custom model */}
        {model ? (
          <group ref={dynamicRef} scale={0.2}>
            {" "}
            <primitive object={model} />{" "}
          </group>
        ) : (
          <group ref={groupRef} scale={0.013} {...props} dispose={null}>
            {/* Car model */}
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
