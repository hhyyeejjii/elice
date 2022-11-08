import React, { Suspense, useState, useEffect } from "react";
import styled from "styled-components";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { useDispatch, useSelector } from "react-redux";

import { onOffElement, savePosition } from "../../../redux/actions/canvas";
import { Controls, useControl } from "react-three-gui"

import IsometricRoom from "./Isometric_room";
import TV from './Elements/TV'
import Room from "./Backgrounds/Room";

//backgrounds
// import IsometricRoom2 from "./Backgrounds/IsometricRoom";
import Beach from './Backgrounds/Beach'
import Cinema from './Backgrounds/Cinema'
import Park from './Backgrounds/Park'

//Elements
import Dog from './Elements/Dog'
import Cat from './Elements/Cat'
import Llama from './Elements/Llama'
import Otter from './Elements/Otter'
import Billiard from './Elements/Billiard'
import Bed from './Elements/Bed'
import Couch from './Elements/Couch'
// import { setPlaylist } from "../../../redux/actions/playlist";
// const set_Playlist = (playlist) => dispatch(setPlaylist(playlist));


export default function CanvasContainer({ edit }) {
  const dispatch = useDispatch();
  const save_Position = (positions) => dispatch(savePosition(positions));
  // Drag가 안되서 이용 못하는 중

  const [color, setColor] = useState();
  const [url, setUrl] = useState();

  const {idx, state} = useSelector((state) => {
    return {
      idx: state.playlist.nowPlaying,
      state: state
    };
  });
  console.log(state, idx)

  useEffect(() => {
    let videoUrl = state.playlist.playlist[idx].url
    
    if (videoUrl !== undefined) {
      videoUrl = videoUrl.replace(".", "");
      videoUrl = videoUrl.substring(0,15) + ".com/embed" + videoUrl.substring(15)
    }
    setUrl(videoUrl)

    let changeColor = state.playlist.playlist[idx].category

    if (changeColor === "joy") {
      changeColor = "#FFE178"
    }
    else if (changeColor === "trust") {
      changeColor = "#B0E132"
    }
    else if (changeColor === "fear") {
      changeColor = "#2BB176"
    }
    else if (changeColor === "surprise") {
      changeColor = "#41A0B3"
    }
    else if (changeColor === "sadness") {
      changeColor = "#6692F2"
    }
    else if (changeColor === "disgust") {
      changeColor = "#AB8CF5"
    }
    else if (changeColor === "anger") {
      changeColor = "#D64959"
    }
    else if (changeColor === "anticipation") {
      changeColor = "#E89958"
    }
    else if (changeColor === "love") {
      changeColor = "#EE00FF"
    }
    else {
      changeColor = "white"
    }
    setColor(changeColor)
    console.log(color, url)
  }, [state, idx, url])

  const { onNOff } = useSelector((state) => {
    return {
      onNOff: state.canvas.onNOff,
    };
  });

  return (
    <div style={{ height: "100vh" }}>
      <Canvas camera={{ fov: 45, position: [300, 300, 300] }} shadows>
        <color attach="background" args={["black"]} />
        <OrbitControls
          minPolarAngle={edit ? Math.PI / 4 : -Math.PI/2}
          maxPolarAngle={edit ?  Math.PI / 4 : Math.PI/2}        
          minAzimuthAngle={edit ? Math.PI / 4 : 0}
          maxAzimuthAngle={edit ? Math.PI / 4 : Math.PI / 2}
        />
        {/* light 들 적용시킬 것 */}
        <ambientLight intensity={0.1} />
        <pointLight color="white" intensity = {0.1}  />

        <spotLight
          position={[82.123, 106.57, -184.02]}
          intensity={0.3}
          angle={0.9}
          color="white"
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <rectAreaLight 
          width={110}
          height={10}
          color={color} 
          intensity={30}
          position={[-88.8, 40, -32]} 
          rotation={[0, -1.57, 0]}
        />
        <pointLight
          color={color}
          intensity={0.4}
          position={[-70, 100, -23]}
          castShadow={true}
        /> 

        {/* 바닥 생성 */}
        <mesh position={[0,0,0]} scale={1000} rotation={[-Math.PI/2,0,0]}  receiveShadow>
          <planeBufferGeometry attatch="geometry" />
          <meshLambertMaterial attatch="material" color="yellow" />
        </mesh>
        <mesh position={[0,0,-90]} scale={1000} rotation={[0,0,-Math.PI/2]}  receiveShadow>
          <planeBufferGeometry attatch="geometry" />
          <meshLambertMaterial attatch="material" color="white" />
        </mesh> <mesh position={[-90,0,0]} scale={1000} rotation={[0,Math.PI/2,0]}  receiveShadow>
          <planeBufferGeometry attatch="geometry" />
          <meshLambertMaterial attatch="material" color="blue" />
        </mesh>

        {/* Model들 */}
        <Suspense fallback={null}>
          {/* 기본 방 + 버튼 클릭에 따른 Element들 */}
          {/* <Furniture edit={edit}/> */}          
          <IsometricRoom url={url}/>
          <Dog onNOff={onNOff[0]} edit={edit} />
          <Cat onNOff={onNOff[1]} edit={edit} />
          <Llama onNOff={onNOff[2]} edit={edit} />
          <Couch onNOff={onNOff[4]} edit={edit} />
          <Bed onNOff={onNOff[5]} edit={edit} />
          <TV onNOff={onNOff[6]} edit={edit} />

          {/* <Cinema castShadow/> */}

        </Suspense>
      </Canvas>
    </div>
  );
}
