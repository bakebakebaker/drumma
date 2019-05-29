"use strict";
(function(){
  var tempoIndicator = document.getElementById("tempo");
  var BPM = parseInt(document.getElementById("tempo").innerHTML);
  var audio = new AudioContext();
  var isPlaying = false;
  var playBtn = document.getElementById("play");
  playBtn.addEventListener(
    "click",
    function() {
      playBtn.classList.toggle("on");
      if (isPlaying === false) {
        play(BPM);
      } else {
        stop();
      }
    },
    false
  );

  function catchTheId(instrumentName) {
    let arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(document.getElementById(instrumentName + "-btn-" + i));
    }
    return arr;
  }
  var buttons = [
    catchTheId("kick"),
    catchTheId("snare"),
    catchTheId("closed-hh"),
    catchTheId("open-hh")
  ];

  let sounds = [
    "https://dl.dropboxusercontent.com/s/hicl66sjy17or7y/kick.wav?dl=0",
    "https://dl.dropboxusercontent.com/s/5hki4jmw4ehed2f/clap.wav?dl=0",
    "https://dl.dropboxusercontent.com/s/er3m2je5zl73x4j/closed-hh.wav?dl=0",
    "https://dl.dropboxusercontent.com/s/s497qr5unn1niqh/open-hh.wav?dl=0"
  ];
  let data = {
    step: 0,
    tracks: [
      createTrack(playSound(0),"Kick",false),
      createTrack(playSound(1),"Clap",false),
      createTrack(playSound(2),"OpenedHihat",false),
      createTrack(playSound(3),"ClosedHihat",false)
    ]
  };

  function createTrack(playSound,instrument,reset) {
    var steps = [];
    for (var i = 0; i < 16; i++) {
      steps.push(false);
    }
    if(instrument==="Kick" && !reset){
      steps[0] = true;
      steps[4] = true;
      steps[8] = true;
      steps[12] = true;
    }
    if(instrument==="Clap" && !reset){
      steps[4] = true;
      steps[12] = true;
    }
    if(instrument==="OpenedHihat" && !reset){
      steps[2] = true;
      steps[6] = true;
      steps[10] = true;
      steps[14] = true;
    }
    return { steps: steps, playSound: playSound };
  }

  //ADD EVENTLISTENERS TO EACH BUTTON
  for (let i = 0; i < buttons.length; i++) {
    for (let j = 0; j < buttons[i].length; j++)
      buttons[i][j].addEventListener(
        "click",
        function() {
          toggleClass(i, j);
          toggleBoolean(i, j);
        },
        false
      );
  }

  function toggleClass(track, step) {
    buttons[track][step].classList.toggle("on");
  }
  function toggleBoolean(track, step) {
    if (data.tracks[track].steps[step] === false) {
      data.tracks[track].steps[step] = true;
    } else {
      data.tracks[track].steps[step] = false;
    }
  }

  var indicatorIds = [];
  for (let i = 0; i < 16; i++) {
    indicatorIds.push(document.getElementById("indicator-" + i));
  }

  var indicatorStep = 0;

  function indicate() {
    setTimeout(function() {
      indicatorIds[indicatorStep].classList.remove("step-indicator-filled");
    }, 30);
    indicatorIds[indicatorStep].classList.add("step-indicator-filled");
    indicatorStep = (indicatorStep + 1) % indicatorIds.length;
  }

  function main() {
    indicate();
    data.tracks
      .filter(function(track) {
        return track.steps[data.step];
      })
      .forEach(function(track) {
        track.playSound();
      });

    data.step = (data.step + 1) % 16

  }

  var interval;
  function play(tempo) {
    isPlaying = !isPlaying;
    interval = setInterval(main, 60000 / tempo / 4);
  }

  function stop() {
    isPlaying = !isPlaying;
    clearInterval(interval);
  }

  let bufferList = [];
  let loadBuffer = (url, index) => {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
      audio.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert("error decoding file data: " + url);
            return;
          }
          bufferList[index] = buffer;
        },
        function(error) {
          console.error("decodeAudioData error", error);
        }
      );
    };

    request.onerror = function() {
      alert("BufferLoader: XHR error");
    };

    request.send();
  };


  for(let i=0; i<sounds.length; i++){
    loadBuffer(sounds[i],i)
  }


  function playSound(instrument) {
    return function() {
      var source1 = audio.createBufferSource();
      source1.buffer = bufferList[instrument];
      source1.connect(audio.destination);
      source1.start(0);
    };
  }


  let newBPM = 120;
  function tempoChanger(val) {
    if (!isPlaying) {
      BPM = BPM += val;
      play.BPM = BPM;
      tempoIndicator.innerHTML = BPM;
      newBPM = BPM;
    } else {
      BPM = BPM += val;
      play.BPM = BPM;
      tempoIndicator.innerHTML = BPM;
      newBPM = BPM;
      stop();
      play(newBPM);
    }
  }



  function clearPattern(){
    for(let i=0;i<buttons.length;i++){
      for(let j=0;j<buttons[i].length;j++){
        if(buttons[i][j].classList.contains('on')){
          buttons[i][j].classList.remove('on')
        }
      }
    }

    data.tracks = [];
    data.tracks = [createTrack(playSound(0),"Kick",true),
    createTrack(playSound(1),"Clap",true),
    createTrack(playSound(2),"OpenedHihat",true),
    createTrack(playSound(3),"ClosedHihat",true)];
  }


  document.getElementById('clear-pattern').addEventListener('click',clearPattern,false)

  document.getElementById("tempoUp").addEventListener(
    "click",
    function() {
      tempoChanger(1);
    },
    false
  );
  document.getElementById("tempoDown").addEventListener(
    "click",
    function() {
      tempoChanger(-1);
    },
    false
  );
})();
