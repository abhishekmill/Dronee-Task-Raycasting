import React, { useRef, useState, useCallback, useEffect } from "react";
import { Html, Line, Plane, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshBVH } from "three-mesh-bvh";
import { useControls } from "leva";
import { Tesla } from "./Tesla";
import { Shelf } from "./Shelf";

export function Car({ file, props }) {
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

  // resetting the point array
  useEffect(() => {
    setDots([]);
  }, [model]);

  const { showAnnotation } = useControls({
    showAnnotation: {
      value: true,
      label: "Show showAnnotation",
    },
  });
  return (
    <>
      {/* Clicked Dots */}
      {dots.map((pos, i) => (
        <React.Fragment key={i}>
          <mesh scale={0.5} key={i} position={pos}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>

          <Html
            onOcclude={set}
            style={{
              scale: showAnnotation ? "1" : "0",
              transition: "all 0.2s",
              opacity: hidden ? 0 : 1,
              transform: `scale(${hidden ? 0.5 : 1})`,
            }}
            center
            distanceFactor={10}
            position={pos}
          >
            <div className="flex bg-white rounded-full ">
              <div className="select-none w-6 h-6 rounded-full border-black border-2 bg-white">
                <div className="flex justify-center text-center items-center  p-1 text-[8px]">
                  <div>{i + 1}</div>
                </div>
              </div>
              <div className="flex select-none flex-col bg-white w-12 text-left px-2 justify-between rounded-lg text-[5px]">
                <div>X: {(pos.x * 10).toFixed(2)} m</div>
                <div>Y: {(pos.y * 10).toFixed(2)} m</div>
                <div>Z: {(pos.z * 10).toFixed(2)} m</div>
              </div>
            </div>
          </Html>
        </React.Fragment>
      ))}

      {/* Hover Dot  */}
      {hoverDot && (
        <mesh scale={0.5} position={hoverDot}>
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
          <group ref={groupRef} scale={1} {...props} dispose={null}>
            <Tesla />
            <group position={[-3, 0, 0]}>
              <Shelf />
            </group>
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload("/car.glb");
