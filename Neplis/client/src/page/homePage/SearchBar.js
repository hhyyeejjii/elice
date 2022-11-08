import React, { useState } from "react";
import { styled } from "@linaria/react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMusic } from "../../redux/actions/playlist";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const url = "http://elice-kdt-ai-3rd-team03.koreacentral.cloudapp.azure.com"; //http 없으면 404 error
const StyledContainer = styled.div`
  position: absolute;
  top: 30px;
  width: 350px;
  height: 90vh;
  text-align: center;
  color: white;

  form {
    /* border-radius: 10px; */
    background-color: rgba(50, 50, 50, 0.7);
    input {
      border: none;
      border-bottom: 1px solid white;
      background-color: transparent;
      width: 70%;
      margin: 20px 10px 10px 10px;
      padding: 10px;
      color: white;
    }
    /* margin-bottom: 20px; */
    padding-bottom: 20px;
    border-bottom: 1px gray solid;
  }

  .searchToggleBtn {
    background-color: rgba(50, 50, 50, 0.5);
    border: 2px #ffa500 solid;

    border-radius: 0 0 10px 10px;
    width: 100%;
    height: 15px;
    color: white;
  }

  .searchResultContainer {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px 10px 0 0;
    /* min-height: */
    min-height: 70%;
    max-height: 70%;
    overflow: auto;
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
  }

  ul {
    box-sizing: border-box;
    border-radius: 10px;
    li {
    padding: 2px;
    margin: 5px;
    text-align: left;
    background-color: rgba(20, 20, 20, 0.7);
    padding:5px;
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
      }
      * {
        margin: auto;
      }
    }
  }
  }
`;

const ResultList = ({ result }) => {
  const dispatch = useDispatch();
  const handleAddMusic = async (music) => {
    try {
      let formData = new FormData();
      formData.append("title", music.title);
      formData.append("musician", music.musician);
      formData.append("albumImage", music.albumImage);
      
      formData.append("Authorization", localStorage.getItem("access_token"));
      // 유저 ID 가져오고, 유튜브 링크 추가로 가져오고, 
      // 최초 : Title이랑 가수, 가사 

      // playlist 에서는 가사 가져오고, 카테고리, state,
      // analysis에서   
      //   
      axios
        .post(`${url}/api/add-music`, formData, {
          timeout: 10000,
          headers: { "Content-Type": "multipart/form-data" },
        })        
        
        .then((res) => {
          music["lyrics"] = res.data.musicInfo.lyrics
          music["category"] = res.data.musicInfo.category
          music["id"] = res.data.musicInfo.musicid
          music["url"] = res.data.musicInfo.audio

          dispatch(addMusic(music));
        });
    } catch (e) {
      console.log(e);
    }
  };

  const resultList = result.map((music) => (
    <li>
      <img src={music.albumImage} />
      <div>
        <h3 className="title">{music.title}</h3>
        {music.musician}
      </div>
      <button className="addMusicBtn" onClick={() => handleAddMusic(music)}>
        +
      </button>
    </li>
  ));

  return <ul>{resultList}</ul>;
};

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  //현재 token 받아올 수가 없어서, 임시로 넣어둔 상태
  localStorage.setItem("token", "token");
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("keyword", searchValue);
      formData.append("Authorization", localStorage.getItem("access-token"));
      // formData.append("Authorization", localStorage.getItem("access-token"));
      axios
        .post(`${url}/api/find`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setSearchResult(res.data.searchlist);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledContainer>
      {isShow ? (
        <div className="searchResultContainer">
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder={"음악을 검색하세요."}
            />
            <br></br>
          </form>
          <ResultList result={searchResult} />
        </div>
      ) : (
        <></>
      )}

      <button
        className={"searchToggleBtn"}
        onClick={() => {
          setIsShow(!isShow);
        }}
      >
        {isShow ? <AiFillCaretUp /> : <AiFillCaretDown />}
      </button>
    </StyledContainer>
  );
}
