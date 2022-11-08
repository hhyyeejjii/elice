import React, { useState,useEffect } from "react";
import { styled } from "@linaria/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setNowPlaying,
  deleteMusic,
  setCategory,
} from "../../redux/actions/playlist";
import MusicCard from "./MusicCard";
const MusicContainer = styled.ul`
  ::-webkit-scrollbar {
    width: 5.2px;
  } /* 스크롤 바 */
  ::-webkit-scrollbar-track {
    background-color: black;
  } /* 스크롤 바 밑의 배경 */
  ::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  } /* 실질적 스크롤 바 */
  ::-webkit-scrollbar-thumb:hover {
    background: #404040;
  } /* 실질적 스크롤 바 위에 마우스를 올려다 둘 때 */
  ::-webkit-scrollbar-thumb:active {
    background: #808080;
  } /* 실질적 스크롤 바를 클릭할 때 */

  box-sizing: border-box;
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 300px;
  height: 40%;

  background-color: rgba(0, 0, 0, 0.5);
  border: 1px #ffa500 solid;
  border-radius: 10px;
  color: white;
  margin: 10px 5px;
  list-style: none;
  line-height: 1;
  overflow: auto;
  vertical-align: center;

  li {
    padding: 2px;
    margin: 5px;
    text-align: left;
    background-color: rgba(70, 70, 70, 0.7);
    padding: 5px;
    border-radius: 10px;
    display: flex;
    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      h3 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      object-fit: cover;
      height: 50px;
      width: 50px;
      margin-right: 7px;
      border-radius: 10px;
    }

    button {
      margin: auto;
      background-color: rgba(50, 50, 50, 0.7);
      color: white;
      height: 40px;
      width: 40px;
      border-radius: 10px;
      font-size: xx-large;
      path {
        stroke: rgba(150, 150, 150, 1);
        margin: auto;
      }
      * {
        margin: auto;
      }
    }
  }
`;

const url = "http://elice-kdt-ai-3rd-team03.koreacentral.cloudapp.azure.com"; //http 없으면 404 error


export default function Playlist() {
  const dispatch = useDispatch();

  const delete_Music = (idx) => dispatch(deleteMusic(idx));
  const set_NowPlaying = (idx) => dispatch(setNowPlaying(idx));
  const set_Category = (idx, category) =>
    dispatch(setCategory({ idx: idx, category: category }));
  const { playlist, nowPlaying } = useSelector((state) => {
    return {
      playlist: state.playlist.playlist,
      nowPlaying: state.playlist.nowPlaying,
    };
  });

  const PlayLists = () => {
    return (
      <>
        {playlist.map((music, idx) => (
          <MusicCard
            music={music}
            idx={idx}
            delete_Music={delete_Music}
            set_NowPlaying={set_NowPlaying}
            set_Category={set_Category}
          />
        ))}
      </>
    );
  };

  return (
    <MusicContainer>
      <PlayLists />
    </MusicContainer>
  );
}
