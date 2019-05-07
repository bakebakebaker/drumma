function BufferLoader(context = audio, urlList = sounds, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
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
}

for(let i=0; i<sounds.length; i++){
  loadBuffer(sounds[i],i)
}
