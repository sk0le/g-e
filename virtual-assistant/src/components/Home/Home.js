import React, { useState, useRef } from "react";
import "./home.css";
import avatar from "../../assets/avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

export default function Home() {
  const btn = useRef(0);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [hasAnswer, setHasAnswer] = useState(false);
  const [links, setLinks] = useState([]);
  const [related, setRelated] = useState([]);

  function readOutLoud(message) {
    const speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function getApiResponse(msg) {
    btn.current.style.backgroundColor = "var(--secondary-color)";
    const rep = msg.replace("+", "%2B");
    const q = encodeURI(rep);
    Axios.get(`https://google-search-api-v2.herokuapp.com/api?query=${q}`)
      .then((res) => {
        console.log(res.data);
        const arr = res.data.answers;

        let num = 0;
        if (arr.length > 1) {
          num = 1;
        }

        let linkArr = [];

        for (let i = 0; i < 5; i++) {
          linkArr.push(res.data.links[i]);
        }

        setLinks(linkArr);
        setRelated(res.data.related);

        readOutLoud(arr[num]);
        setHasAnswer(true);
        setAnswer("Answer: " + arr[num]);
      })
      .catch((err) => console.error(err));

    setQuestion("Question: " + msg);
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onstart = function () {
    btn.current.style.backgroundColor = "red";
    setQuestion("Listening...");
    setAnswer("");
    setHasAnswer(false);
  };

  recognition.onspeechend = function () {
    btn.current.style.backgroundColor = "var(--secondary-color)";
  };

  recognition.onerror = function (event) {
    if (event.error === "no-speech") {
      setQuestion("No speech was detected. Try again.");
      setAnswer("");
      btn.current.style.backgroundColor = "var(--secondary-color)";
    }
  };

  recognition.onresult = function (event) {
    let current = event.resultIndex;

    let transcript = event.results[current][0].transcript;
    recognition.stop();

    getApiResponse(transcript);
  };

  return (
    <div className="home">
      <div className="text">
        <h1>Hi, my name is G.E. and I'm here to help you.</h1>
        <span className="explanation">
          I can answer you with questions, starting from weather, math...
        </span>
        <img src={avatar} alt="" />
      </div>
      <div className="buttons">
        <button
          ref={btn}
          onClick={() => {
            recognition.start();
          }}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>
      <div className="qna">
        <span className="question">{question}</span>
        <span className="answer">{answer}</span>
      </div>
      {hasAnswer ? (
        <div className="lar">
          <div className="links">
            <h3>Some links to help you out</h3>
            {links.map((arr, index) => {
              return (
                <a key={index} href={arr.link} target="_blank" rel="noreferrer">
                  {arr.title}
                </a>
              );
            })}
          </div>
          <div className="related">
            <h3>Related questions</h3>
            {related.map((res, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    getApiResponse(res);
                  }}
                >
                  {res}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
