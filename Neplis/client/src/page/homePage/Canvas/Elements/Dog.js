import ReactDOM from "react-dom";
import React, { Suspense, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Controls, useControl } from "react-three-gui";
import { OrbitControls, TransformControls } from "@react-three/drei";

export default function Model({onNOff,edit}) {
  const orbit = useRef();
  const transform = useRef();
  const mode = useControl("mode", {
    type: "select",
    items: ["rotate", "translate"],
  });
  const model = useLoader(GLTFLoader, "/Dog/scene.gltf");

  useEffect(() => {
  
  });
  return (
    <>
    {onNOff ? 
      <TransformControls ref={transform} showZ={edit} showY={edit} showX={edit}>
      <primitive
          position={[0, -1, 0]}
          object={model.scene}
          scale={8}
          rotation={[0, Math.PI/2, 0]}
        />
      </TransformControls> : <></>
      }
    </>
  );
}
