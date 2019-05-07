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
var tracks = [
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
    createTrack(playSound(0)),
    createTrack(playSound(1)),
    createTrack(playSound(2)),
    createTrack(playSound(3))
  ]
};

function createTrack(playSound) {
  var steps = [];
  for (var i = 0; i < 16; i++) {
    steps.push(false);
  }
  return { steps: steps, playSound: playSound };
}

//ADD EVENTLISTENERS TO EACH BUTTON
for (let i = 0; i < tracks.length; i++) {
  for (let j = 0; j < tracks[i].length; j++)
    tracks[i][j].addEventListener(
      "click",
      function() {
        toggleClass(i, j);
        toggleBoolean(i, j);
      },
      false
    );
}

function toggleClass(track, step) {
  tracks[track][step].classList.toggle("on");
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
//-----------------------------------BUFFERLOADER-----------------------------------------------------------
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert("error decoding file data: " + url);
          return;
        }
        loader.bufferList[index] = buffer;
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

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

//-------------------------------------------------------------BUFFERLOADER-------------------------------------

let xd = new BufferLoader(audio, sounds);
xd.load();
console.log(xd.bufferList)

function playSound(instrument) {
  return function() {
    var source1 = audio.createBufferSource();
    source1.buffer = xd.bufferList[instrument];
    source1.connect(audio.destination);
    source1.start(0);
  };
}


newBPM = 120;
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
