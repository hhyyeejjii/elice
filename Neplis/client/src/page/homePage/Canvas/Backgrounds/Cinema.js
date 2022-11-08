import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import React from "react";
import { Mesh } from "three";

export default function Model({ edit }) {
  const model = useLoader(GLTFLoader, "/Cinema/scene.gltf");

  Model.castShadow = true;
  // Model.traverse((children) => {
  //   if (children instanceof Mesh) {
  //     children.castShadow=true;
  //     children.receiveShadow=true;
  //   }
  // })

  return (
  <primitive 
    castShadow
    receiveShadow
    position={[0, 0, 0]}
    object={model.scene}
    scale={10}
    rotation={[0, 0, 0]}
  />
  )
}
