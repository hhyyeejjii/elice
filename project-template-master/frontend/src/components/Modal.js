import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styles from "./Modal.module.css";
import closebtn from "../img/closebtn.png";
import ResultLoginModal from "./ResultLoginModal"

const Modal = ({ openModal }) => {
    const [selected, setSelected] = useState("ISTJ");

    const [showResultLoginModal, setShowResultLoginModal] = useState(false);

    const history = useHistory();

    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            // "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true
    }

    const openResultLoginModal = () => {
        setShowResultLoginModal(!showResultLoginModal);
    }

    const changeSelectOptionHandler = (e) => {
        setSelected(e.target.value);
    }

    const clickHandler = () => {
        axios
            .post("http://elice-kdt-3rd-team-12.koreacentral.cloudapp.azure.com:5000/result/", {
                "user_mbti": selected
            }, axiosConfig)
            .then(() => {
                history.push("/TestCompletedPage")
            })
            .catch((error) => {
                setShowResultLoginModal(!showResultLoginModal);
                console.log(error)
            })
    }

    return (
        
        <div className={styles.modal_container}>
            <div className={styles.modal}>
                <img src={closebtn} alt="closebtn" onClick={ openModal } className={styles.modal_button} />
                <p className={styles.modal_text}>당신의 유형을 선택해주세요</p>
                <select className={styles.modal_selectbox} onChange={ changeSelectOptionHandler }>
                    <option value="ISTJ">ISTJ</option>
                    <option value="ISTP">ISTP</option>
                    <option value="ISFJ">ISFJ</option>
                    <option value="ISFP">ISFP</option>
                    <option value="INTJ">INTJ</option>
                    <option value="INTP">INTP</option>
                    <option value="INFJ">INFJ</option>
                    <option value="INFP">INFP</option>
                    <option value="ESTJ">ESTJ</option>
                    <option value="ESTP">ESTP</option>
                    <option value="ESFJ">ESFJ</option>
                    <option value="ESFP">ESFP</option>
                    <option value="ENTJ">ENTJ</option>
                    <option value="ENTP">ENTP</option>
                    <option value="ENFJ">ENFJ</option>
                    <option value="ENFP">ENFP</option>
                </select>
                <button className={styles.modal_btn} onClick={ clickHandler }>확인</button>
            { showResultLoginModal && <ResultLoginModal openResultLoginModal={openResultLoginModal} />}
            </div>
        </div>
    )
}

export default Modal;