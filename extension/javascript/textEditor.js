// import axios from "axios";

let meetingText = window.text,
  title;
const email = window.email;
const meetingDuration = window.duration;
const sessionId = window.sessionId;
const sessionName = window.sessionName;

const textarea = document.getElementById("meetingText");
const summaryarea = document.getElementById("meetingSummary");
const score = document.getElementById("score");

document.getElementById("duration").innerText = duration;
document.getElementById("title").innerText = sessionName;
score.innerText = window.confidenceScore;
textarea.value = meetingText;

if (window.confidenceScore > 50) {
  score.setAttribute("class", "good");
} else {
  score.setAttribute("class", "bad");
}

textarea.addEventListener("keyup", (e) => {
  meetingText = e.target.value;
});

function getHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": "Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e",
    };
}

async function fetchClassSession(){
    const res = await fetch(
        "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/retrieve/" + sessionId + "/",
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    const responseJSON = await res.json();
    summaryarea.value = responseJSON['summary'];
}

fetchClassSession();
