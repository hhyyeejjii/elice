import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import React from "react";

export default function Model({ edit }) {
  const model = useLoader(GLTFLoader, "/Beach2/scene.gltf");
  
  return (
  <primitive
    position={[-100, -20, -500]}
    object={model.scene}
    scale={1}
    rotation={[0, 0, 0]}
  />
  )
}