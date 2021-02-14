let email;

function disableButtons() {
  document.getElementById("submit").disabled = true;
  document.getElementById("google-btn").disabled = true;
}

function enableButtons() {
  document.getElementById("submit").disabled = false;
  document.getElementById("google-btn").disabled = false;
}

function login() {
  const email = document.getElementById("email").value,
    password = document.getElementById("password").value;

  disableButtons();

  fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      chrome.storage.sync.set({ key: data.key });
      chrome.storage.sync.set({ email });
      enableButtons();
      showRecordScreen(email);
    })
    .catch((err) => {
      console.log(err);
      enableButtons();
    });
}

function getHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Authorization": "Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e",
  };
}

function addRecordListener() {
  const startBtn = document.getElementById("start-record");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (
      tabs[0].url.includes("chrome://") ||
      tabs[0].url.includes("chrome-extension://") ||
      tabs[0].url.includes("chrome.com") ||
      tabs[0].url.includes("chrome.google.com")
    ) {
      startBtn.setAttribute("disabled", true);
      startBtn.innerText = "Can't record a Chrome page!";
    }
  });

  startBtn.addEventListener("click", async () => {
    const sessionNameInput = document.getElementById("session-name");
    const sessionName = sessionNameInput.value;

    // API - Create session
    const res = await fetch(
        "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/create/",
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            session_name: sessionName,
          }),
        }
    );
    const responseJson = await res.json();
    chrome.storage.sync.set({ sessionName: sessionName, sessionId: responseJson.id });

    chrome.runtime.sendMessage({ type: "record", sessionName: sessionName, sessionId: responseJson.id });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "record" }, () => {
        window.close();
      });
    });
  });
}

function showRecordScreen(email) {
  document.getElementById("login").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.getElementById("content-buttons").style.display = "block";
  document.getElementById("emailID").innerText = email;
  addRecordListener();
}

function showLoginScreen() {
  document.getElementById("login").style.display = "block";
  document.getElementById("content").style.display = "none";
  document.getElementById("content-buttons").style.display = "none";
}

function addLoginListeners() {
  document.getElementById("submit").addEventListener("click", login);
  document.getElementById("google-btn").addEventListener("click", googleLogin);
}

chrome.storage.sync.get("email", (data) => {
  // if (!data.email) {
  //   document.getElementById('login').style.display = 'block';
  //   addLoginListeners();
  // } else {
  showRecordScreen(data.email);
  // }
});

document.getElementById("logOut").addEventListener("click", () => {
  chrome.storage.sync.clear(() => {
    window.close();
  });
});
