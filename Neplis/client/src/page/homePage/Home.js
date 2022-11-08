import React, { useEffect, useState } from "react";
import Lyrics from "./Lyrics";
import Playlist from "./Playlist";
import SearchBar from "./SearchBar";
import Header from "../../component/header/Header";
import CanvasContainer from "./Canvas/CanvasContainer";
import { styled } from "@linaria/react";
import { useSelector, useDispatch } from "react-redux";
import EditMenu from "./EditMenu";
import { savePosition } from "../../redux/actions/canvas";
import PlayBox from "./PlayBox";
import axios from "axios";
const url = "http://elice-kdt-ai-3rd-team03.koreacentral.cloudapp.azure.com"; //http 없으면 404 error

// import PlayBtns from "./Canvas/PlayBtns";

const EditBtn = styled.button`
position: absolute;
right: 0;
bottom: 0;
height: 50px;
width: 300px;
margin: 5px;
background-color: transparent;
color:#FFA500;
border:1px #FFA500 solid;
border-radius:5px;
font-weight:bold;
font-size:30px;
:hover{
  color:black;
  background-color: #FF8C00;
}
`;

export default function Home() {
  const [edit, setEdit] = useState(false);
  const { playlist, nowPlaying,onNOff } = useSelector((state) => {
    return {
      playlist: state.playlist.playlist,
      nowPlaying: state.playlist.nowPlaying,
      onNOff : state.canvas.onNOff
    };
  });

  const [isLogined, setIsLogined] = useState(true);


  const dispatch = useDispatch();

  const saveHandle = () => {
    localStorage.setItem('onNOff',onNOff)

    const formData = new FormData();
    formData.append("Authorization", localStorage.getItem("access-token"));
    formData.append("elements", localStorage.getItem("onNOff"));


    axios
      .post(`${url}/api/save-room`,formData)
      .then((res) => {      
        setEdit(!edit)
      }).catch((err)=>{
        console.log(err);
      })
  };
  return (
    <div>
      <Header isLogined={isLogined} setIsLogined={setIsLogined} />
      <CanvasContainer edit={edit} />
      {edit ? (
        <EditMenu />
      ) : (
        <>
          <SearchBar />
          <Lyrics music = {playlist[nowPlaying]}/>
          <Playlist />
          <PlayBox music = {playlist[nowPlaying]}/>
        </>
      )}
      {/* <PlayBtns music, setNowPlaying, nowPlaying={nowPlaying}/> */}
      {
        !edit ? (
          <EditBtn onClick={() => setEdit(!edit)}>방 편집 하기</EditBtn>
        ) : (
          <EditBtn onClick={() => saveHandle()}>저장하기</EditBtn>
        )
      }
    </div>
  );
}
