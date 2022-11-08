import React from 'react'
import {styled}  from '@linaria/react';
import { useSelector } from 'react-redux';

const Lyric = styled.div`
::-webkit-scrollbar { width: 5.2px; } /* 스크롤 바 */
::-webkit-scrollbar-track { background-color:black; } /* 스크롤 바 밑의 배경 */
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; } /* 실질적 스크롤 바 */
::-webkit-scrollbar-thumb:hover { background: #404040; } /* 실질적 스크롤 바 위에 마우스를 올려다 둘 때 */
::-webkit-scrollbar-thumb:active { background: #808080; } /* 실질적 스크롤 바를 클릭할 때 */

  position:absolute;
  top:45px;
  right:0;
  padding:10px ;
  width:280px;
  height:30%;
  background-color : rgba(0,0,0,0.5);
  border : 1px solid #FFA500;
  border-radius: 10px;
  color:white;

  list-style : none;
  margin :5px;

  text-align:center;
  overflow:auto;
  h2{
    margin-bottom:5px;
  }
`

export default function Lyrics({music}) {
  return (
    <Lyric >
      <h2>{music.title} </h2>
      <h6>{music.musician}</h6>
      <br></br>
        { music.lyrics }
    </Lyric> )
}