import React from 'react'
import { Link } from "react-router-dom";
import { styled } from '@linaria/react';
import logo from '../../asset/logo (4).png'
import { kakaoLogout, kakaoLogin } from '../../util/loginApi';

const NavBtn = styled.button`
  margin:5px;
  padding: 5px ;
  float :right;
  background-color: transparent;
  height:100%;
  border:none;
  font-weight:bold;
  /* color: oran */
  :hover{
    color: orange;
  }
`

export default function Header({isLogined,setIsLogined}) {
  const handleLogin = ()=> {
    if (isLogined) {
      kakaoLogin();
    }
    else {
      kakaoLogout();
    }
    setIsLogined(!isLogined)
  }
  return (
    <div style={{  zIndex:1, width: "100%",position : "absolute" , backgroundColor: "gray" }}>
      <Link to="/" style={{width:"25vw", textAlign:"center"}}><img src={logo} style={{ height : "0",padding:' 0'}}></img></Link>
      <NavBtn onClick={handleLogin}> {isLogined? "카카오로 로그인" : "로그아웃"}</NavBtn>      
    </div>
  )
}