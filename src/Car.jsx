import React, { useRef, useState, useCallback, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export function Car(props) {
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

  // Add listeners once
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

  return (
    <>
      {/* Clicked Dots */}
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}

      {/* Hover Dot (Blue) */}
      {hoverDot && (
        <mesh position={hoverDot}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="blue" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Car model */}
      <group ref={groupRef} scale={0.005} {...props} dispose={null}>
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
    </>
  );
}

useGLTF.preload("/car.glb");
