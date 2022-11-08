import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import ReactPlayer from "react-player";

export default function PlayBox({music}) {
  const [isShow, setIsShow] = useState(true);
  const [url, setUrl] = useState();

  const { nowPlaying, state } = useSelector((state) => {
    return {
      nowPlaying: state.playlist.nowPlaying,
      state: state
    };
  });

  useEffect(() => {
    let videoUrl = state.playlist.playlist[nowPlaying].url
    
    if (videoUrl !== undefined) {
      videoUrl = videoUrl.replace(".", "");
      videoUrl = videoUrl.substring(0,15) + ".com/embed" + videoUrl.substring(15);
      setUrl(videoUrl)
    }
  }, [url, nowPlaying])
  
  const clickHandler = () => {
    setIsShow(!isShow);
    console.log(url, isShow)
  }
  
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "350px",
        border : " 2px #ffa500 solid", 
        borderRadius:"5px 5px 0 0",
      }}
    >
      <button
        className={"searchToggleBtn"}
        onClick={clickHandler}
        style={{
          backgroundColor: "rgba(50,50,50,0.5)",
          color:"white",
          width:"100%",
          borderRadius:"5px 5px 0 0",
          height:"15px",
        }}
      >
        {isShow ? <AiFillCaretUp /> : <AiFillCaretDown />}
      </button>
      <ReactPlayer
        width={"100%"}
        height={isShow? "0":"100%"}
        url={
          url
          // "https://www.youtube.com/watch?v=d96qZ_qeqJs&list=RDd96qZ_qeqJs&start_radio=1"
          // music.audio
        }
        playing = {false}
        controls={true}
      ></ReactPlayer>

      {/* <iframe 
      id="player"
      width={"100%"}
      height={isShow? "0":"100%"}
      src={url} 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
      </iframe> */}
    </div>
  );
}
