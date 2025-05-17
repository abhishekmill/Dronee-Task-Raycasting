import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3 } from "three";

const CameraAdjuster = ({ modelUrl }) => {
  const { camera, scene } = useThree();
  const modelRef = useRef(null);

  useEffect(() => {
    if (!modelUrl) return;

    const loader = new GLTFLoader();

    // Remove the previous model if it exists
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      modelRef.current = null;
    }

    loader.load(
      modelUrl,
      (gltf) => {
        const loadedModel = gltf.scene;
        modelRef.current = loadedModel;

        // Calculate bounding box
        const bbox = new Box3().setFromObject(loadedModel);
        const size = new Vector3();
        bbox.getSize(size);
        const center = bbox.getCenter(new Vector3());

        // Adjust camera position
        const maxAxis = Math.max(size.x, size.y, size.z);
        const distance = maxAxis * 2;
        camera.position.set(
          center.x,
          center.y + distance / 2,
          center.z + distance
        );
        camera.lookAt(center);

        // Normalize scale
        const scaleFactor = 1 / maxAxis;
        loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Add model to the scene
        scene.add(loadedModel);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error.message);
        alert(
          "Failed to load model. Please ensure it is a valid .glb or .gltf file."
        );
      }
    );

    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
        modelRef.current = null;
      }
    };
  }, [modelUrl, camera, scene]);

  return null;
};

export default CameraAdjuster;
