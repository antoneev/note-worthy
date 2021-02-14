const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();

let tabStream,
  micStream,
  tabAudio,
  micAudio,
  output,
  audioConfig,
  recognizer,
  text = "",
  completeText = "",
  score = 0,
  micable = true,
  paused = false,
  email,
  transcriptSendInterval,
  sessionId,
  sessionName,
  duration;

const constraints = {
  audio: true,
};

// azure speech configurations
const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
  "4bc1dcdc604e4e0bb10b90fd93696fc3",
  "eastus"
);
speechConfig.speechRecognitionLanguage = "en-IN";
speechConfig.outputFormat = 1;

// get tab audio
function getTabAudio() {
  chrome.tabCapture.capture(constraints, (_stream) => {
    // keep playing the audio in the background
    const audio = new Audio();
    audio.srcObject = _stream;
    audio.play();

    tabStream = _stream;
    tabAudio = audioContext.createMediaStreamSource(tabStream);
    tabAudio.connect(destination);

    output = new MediaStream();
    output.addTrack(destination.stream.getAudioTracks()[0]);

    audioConfig = SpeechSDK.AudioConfig.fromStreamInput(output);
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.startContinuousRecognitionAsync();

    recognizer.recognizing = (s, e) =>
      console.log(`RECOGNIZING: Text=${e.result.text}`);

    recognizer.recognized = (s, e) => {
      text += e.result.text;
      completeText += e.result.text;
      if (score == 0) {
        score = Math.max(score, JSON.parse(e.result.json).NBest[0].Confidence);
      } else {
        score = (score + JSON.parse(e.result.json).NBest[0].Confidence) / 2;
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);
      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("\n Session stopped event.");
      recognizer.stopContinuousRecognitionAsync();
      chrome.browserAction.setIcon({ path: "../assets/icon48.png" });
      clearInterval(transcriptSendInterval);
      endClassSession().then((response) => {
        chrome.storage.sync.get("email", (data) => {
          const newWindow = window.open("../html/textEditor.html");
          newWindow.text = completeText.replace("undefined", "");
          newWindow.email = data.email;
          newWindow.duration = duration;
          newWindow.sessionName = sessionName;
          newWindow.sessionId = sessionId;
          newWindow.confidenceScore = (100 * score).toFixed(2);
        });

        // reload the background script to reset the variables
        reloadBackgroundScript();
      });
    };
  });
}

function reloadBackgroundScript() {
  chrome.extension.getBackgroundPage().window.location.reload();
}

function cancelStream() {
  chrome.browserAction.setIcon({ path: "../assets/icon48.png" });
  reloadBackgroundScript();
}

// get mic audio
function getMicAudio() {
  navigator.mediaDevices.getUserMedia(constraints).then((mic) => {
    micStream = mic;
    micAudio = audioContext.createMediaStreamSource(micStream);
    micAudio.connect(destination);

    getTabAudio();
  });
}

function getHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Authorization": "Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e",
  };
}

function sendTranscript(operation){
  let uploadText = text.replace("undefined", "");
  if (uploadText === "") {
    uploadText = "Nothing found";
  }
  text = "";
  return fetch(
      "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/" + operation + "/" + sessionId + "/",
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          transcript: uploadText,
        }),
      }
  );
}


async function updateClassSession(){
  if (text) {
    await sendTranscript('update');
  }
}

async function endClassSession(){
  return sendTranscript('end');
}

// start recording the stream
function startRecord() {
  setTimeout(() => {
    chrome.browserAction.setIcon({ path: "../assets/icon_red.png" });
    getMicAudio();
  }, 3000);

  transcriptSendInterval = setInterval(() => {
    updateClassSession();
  }, 8000);
}

function pauseResumeRecord() {
  if (!paused) {
    tabAudio.disconnect(destination);
    if (micable) {
      micAudio.disconnect(destination);
    }
    paused = true;
  } else {
    tabAudio.connect(destination);
    if (micable) {
      micAudio.connect(destination);
    }
    paused = false;
  }
}

function muteMic() {
  if (micable) {
    micAudio.disconnect(destination);
    micable = false;
  } else {
    micAudio.connect(destination);
    micable = true;
  }
}

// stop record -> stop all the tracks
function stopRecord(totalTime) {
  micStream.getTracks().forEach((t) => t.stop());
  tabStream.getTracks().forEach((t) => t.stop());
  duration = totalTime;

  recognizer.stopContinuousRecognitionAsync();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "record":
      sessionId = request.sessionId;
      sessionName = request.sessionName;
      startRecord();
      break;
    case "stop":
      stopRecord(request.duration);
      break;
    case "pause":
      pauseResumeRecord();
      break;
    case "mute":
      muteMic();
      break;
    case "cancel":
      cancelStream();
      break;
    default:
      break;
  }
});
