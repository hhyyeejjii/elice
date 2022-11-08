import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef } from "react"
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Controls, useControl } from "react-three-gui"
import { OrbitControls, TransformControls } from "@react-three/drei"

export default function Model() {
  const orbit = useRef()
  const transform = useRef()
  const mode = useControl("mode", { type: "select", items: [ "rotate", "translate"] })

  useEffect(() => {
    // if (transform.current) {
    //   const controls = transform.current
    //   controls.setMode(mode)
    //   const callback = event => (orbit.current.enabled = !event.value)
    //   controls.addEventListener("dragging-changed", callback)
    //   return () => controls.removeEventListener("dragging-changed", callback)
    // }
  })
  return (
    <>
      <TransformControls ref={transform}>
      <mesh scale={1}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      </TransformControls>
      <OrbitControls ref={orbit} />
    </>
  )
}

