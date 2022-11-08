import { styled } from "@linaria/react";
import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { onOffElement, savePosition } from "../../redux/actions/canvas";
import { llama, otter,cat, dog, tv, bed,billiard,couch} from "./Canvas/Elements/Elements";

const ItemEditorContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 45px;
  width: 260px;
  height: 50%;
  
  border:1px #FFA500 solid;
  background-color: rgba(80,80,80, 0.5);
  border-radius: 5px;
  padding: 20px;
  margin: 5px;
  overflow: auto;
  color:#FFA500;

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

  .elementsList {
    display: flex;
    flex-wrap: wrap;
    align-items: center;




    .elementCard {
      flex-grow: 0;
      width: 45%;

      box-sizing: border-box;
      height: 150px;
      border: 1px black solid;
      align-items: center;
      font-size: large;
      text-align: center;
      margin-bottom: 60px;
      .img {
        width: 100%;
        background-color: red;
        height: 100px;
      }
      button {
        width: 100%;
      }
    }
  }
`;
// import * from "../../asset/"
export default function EditMenu() {
  const dispatch = useDispatch();
  const on_Off_Element = (index) => dispatch(onOffElement(index));
  
  const {onNOff} = useSelector((state)=>{
    return {
      onNOff : state.canvas.onNOff
    }
  })

  const onNOffSwitch = (index)=>{
    on_Off_Element(index)
  }

  const ElementBox = ({ element, index }) => {
    // onNOff[index] 
    // const imgSrc = require(element.img)
    // import img from element.img;
    const onNOffSwitch = (index)=>{
      on_Off_Element(index)
    }
    
    return (
      <div className="elementCard">
        <img src={process.env.PUBLIC_URL + element.img} style={{width:"100%",height:"100%", objectFit:"cover"}}></img>
        {element.name}
      <button onClick={()=>onNOffSwitch(index)}> {onNOff[index] ? "삭제" : "추가"}</button>
      </div>
    );
  };

  return (
    <ItemEditorContainer>
      <h3>Elements</h3>
      <br></br>
      <div className="elementsList">
        <ElementBox index="0" element={dog}></ElementBox>
        <ElementBox index="1" element={cat}></ElementBox>
        <ElementBox index="2" element={llama}></ElementBox>
        <ElementBox index="3" element={otter}></ElementBox>
        <ElementBox index="4" element={couch}></ElementBox>
        <ElementBox index="5" element={bed}></ElementBox>
        <ElementBox index="7" element={billiard}></ElementBox>
        <ElementBox index="6" element={tv}></ElementBox>

      </div>
    </ItemEditorContainer>
  );
}
//ElementBox에 redux로 element 가져와서 넣어야 함
