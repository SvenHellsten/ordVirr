import React, { useState, useEffect, } from "react";
import { CountUp } from 'use-count-up'
import logo from "./logo.svg";
import "./App.css";
import startW from "./data/ttStartWords.json";
import wList from "./data/ttWords.json";
const timeLimit = 300;                        //timeLimit in seconds
const timeBool = false; 
var show = [];
var comple = [];
var points = 0;
var prevPoints
var quali = false;
var parent = startW[Math.floor(Math.random() * startW.length)];
var shell = shuffle(parent.split(""));
var children = findWords(parent);
var giveup = false;


function clear(){

}
function App() {
  const [seconds, setSeconds] = useState(timeLimit);
  const [isActive, setIsActive] = useState(timeBool);
  const [pressed, setPressed] = React.useState([])
  // const [shelf, setshelf] = useState(shuffle(parent.split("")));
  const [refresh,setrefresh] = useState(true);
  children.sort(function(a, b){
    return a.length - b.length;
  });
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    if (seconds === 0){
      setIsActive(false);
      fungiveup();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  React.useEffect(() => {
	 	const handleKeyDown = event => {
	    const { key, keyCode } = event;
        if (key === "å" || key  === "ä" ||key === "ö" ||(keyCode >= 65 && keyCode <= 90)) {
          let temp = [...shell];
          var suc = false;
          temp.forEach(element => {
            if(element === key && suc === false){
              show.push(key);
              temp[temp.indexOf(key)]= " "; 
              shell = temp;
              suc = true;
            }
          });
          setPressed(pressed.filter(k => k !== key))
        }
        if (keyCode === 8 && show){
          event.preventDefault();
          shell[shell.indexOf(" ")] = show.pop();
          setPressed(pressed.filter(k => k !== key))
        }
        if (keyCode === 16 || keyCode === 9 || keyCode === 32){
          event.preventDefault();
          shell= shuffle(shell);
          setPressed(pressed.filter(k => k !== key))
        }
        if (keyCode === 13 && show){
          event.preventDefault();
          console.log(children);
          console.log(show.join(""));
          
          if (!giveup && children.includes(show.join("")) && !comple.includes(show.join(""))){
            comple.push(show.join(""));


            console.log("success!")
            let i = show.length;
            if (isActive){
              setSeconds(seconds => seconds + 5);
            }
            if (i == 3){
              prevPoints= points;
              points=points + 50;
            }
            if (i == 4){
              prevPoints= points;
              points=points + 150;
            }
            if (i == 5){
              prevPoints= points;
              points=points + 300;
            }
            if (i == 6){
              prevPoints= points;
              points=points + 1000;
              quali= true;
            }
          }
          let j = 0;
          let i = show.length;

          for (j = 0; j < i; j++) {
            shell[shell.indexOf(" ")] = show.pop();
          }
          setPressed(pressed.filter(k => k !== key))
        }
  	};

	  const handleKeyUp = event => {
  	  const { key } = event
      setPressed(pressed.filter(k => k !== key))
  	};
  
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])


  function Refresh(){
    setrefresh(!(refresh));
  }
  



  return (
    <div className="App">
      <header className="App-header">
      {/* <h2>{timeBool && seconds}</h2> */}
      <h4><CountUp isCounting start= {prevPoints} end={points} duration={3.2} autoResetKey={points} /></h4>
        <div className="row2">
          {children.map((value) => {
            if (comple.includes(value)){
              return <h3>{value.toUpperCase()}</h3>;
            }
            else{
              // return <h3 style={{color: "red"}}>---</h3>;
              if (giveup){
                return <h3 style={{color: "red"}}>{value.toUpperCase()}</h3>;
              }
              else{
                return <h3>{value.replace(/[a-ö0-9]/g, "-")}</h3>;
              }
              
            }
            
          })}
        </div>
        <div className="row">
          {show.map((value) => {
            return <h2>{value.toUpperCase()}</h2>;
          })}
        </div>
        <div className="row3">
          <h2>{shell[0].toUpperCase()} </h2>
          <h2>{shell[1].toUpperCase()} </h2>
          <h2>{shell[2].toUpperCase()} </h2>
          <h2>{shell[3].toUpperCase()} </h2>
          <h2>{shell[4].toUpperCase()} </h2>
          <h2>{shell[5].toUpperCase()} </h2>
        </div>
        <div>
        <button onClick= {newRound}>
        {quali ? "Nästa ord!":"Ny runda"}
        </button>
        <button onClick= {fungiveup}>
          Visa Svaret
        </button>
        </div>
      </header>
    </div>
  );

  function fungiveup() {
    giveup = true;
    setrefresh(!refresh);
  }
  function newRound() {
    if (!quali){
      points = 0;
    }
    show = [];
    comple = [];
    parent = startW[Math.floor(Math.random() * startW.length)];
    shell = shuffle(parent.split(""));
    children = findWords(parent);
    giveup = false;
    quali = false;
    
    children.sort(function(a, b){
      return a.length - b.length;
    });
    setrefresh(!refresh);
    }
    
}
function findWords(parent) {
  var a = [];
  var p = parent + "";
  var i;
  var noCigar;
  var j;
  for (i = 0; i < wList.length; i++) {
    noCigar = true;
    var childArr = wList[i].split("");
    var parentArr = p.split("");
    for (j = 0; j < childArr.length; j++) {
      if (parentArr.includes(childArr[j])) {
        parentArr.splice(parentArr.indexOf(childArr[j]), 1);
      } else {
        noCigar = false;
      }
    }
    if (noCigar) {
      a.push(wList[i]);
    }
  }
  return a;

  
}


function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

    for(var i=0; i < show.length; i++){
      array.splice(array.indexOf(" "),1);
      array.push(" ");
    }

  return array;
}

export default App;
