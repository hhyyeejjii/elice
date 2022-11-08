import React, { useState } from "react";
import axios from "axios";
import { GrPowerCycle } from "react-icons/gr";
import { AiFillCaretRight, AiOutlineClose } from "react-icons/ai";
const url = "http://elice-kdt-ai-3rd-team03.koreacentral.cloudapp.azure.com"; //http 없으면 404 error

export default function MusicCard({
  music,
  idx,
  delete_Music,
  set_NowPlaying,
  set_Category,
}) {
  const handleDelete = (idx) => {
    const deleteConfirm = window.confirm(
      "정말로 플레이리스트에서 삭제하시겠습니까? 삭제 시 편집한 해당 곡의 Room 정보는 초기화 됩니다."
    );
    if (deleteConfirm) {
      delete_Music(idx);
    }
    // play를 누르면, play가 사용 되는 컴포넌트들이 전부 re Render 된다. -> useState가 다시 ...
  };

  const [isAnalyzed, setIsAnalyzed] = useState(0);
  console.log(isAnalyzed);

  // Music Card가 새로 rendering 될 때마다, 시행됨.. 딱 추가 되고 한번만 시행 되어야 할 거 같은데
  const checkAnalyzed = () => {
    // setIsAnalyzed(1);
    // console.log(isAnalyzed);

    const test = axios
      .get(`${url}/api/analysis/${music.id}`, { timeout: 20000 })
      .then((res) => {
        if (res.data.state) {
          // 플레이리스트에 카테고리 넣는 dispatch
          // set_Category(idx, res.data.category);
          setIsAnalyzed(1);
          console.log(res.data);
          // console.log(res);
        }
      });
  };

  return (
    <li>
      <img src={music.albumImage} />
      <div>
        <h3>{music.title}</h3>
        {music.musician}
      </div>
      {isAnalyzed ? (
        <button onClick={() => set_NowPlaying(idx)}>
          <AiFillCaretRight />
        </button>
      ) : (
        <button onClick={() => checkAnalyzed()}>
          <GrPowerCycle color="white" />
        </button>
      )}

      <button onClick={() => handleDelete(idx)}>
        <AiOutlineClose />
      </button>
    </li>
  );
}
