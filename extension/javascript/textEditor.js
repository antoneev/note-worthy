// import axios from "axios";

let meetingText = window.text,
  title;
const email = window.email;
const meetingDuration = window.duration;

document.getElementById("duration").innerText = duration;

const textarea = document.getElementById("meetingText");
const score = document.getElementById("score");

score.innerText = window.confidenceScore;

if (window.confidenceScore > 50) {
  score.setAttribute("class", "good");
} else {
  score.setAttribute("class", "bad");
}

textarea.value = meetingText;

textarea.addEventListener("keyup", (e) => {
  meetingText = e.target.value;
});

// async function getSummarizedText() {
//   const body = { email, text: meetingText };

//   // TODO: Summary
//   const res = await fetch("", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();

//   return data;
// }

document
  .getElementById("submit-meeting-details")
  .addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      document.getElementById("error").innerText = "";
      document.getElementById("sendText").disabled = true;

      // const data = await getSummarizedText();

      title = document.getElementById("title").value;

      // try {
      //   const config = {
      //     headers: {
      //       Authorization: `Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e`,
      //     },
      //   };
      //   const response = await axios.patch(
      //     "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/update/4/",
      //     {
      //       transcript: "sefefe",
      //     },
      //     config
      //   );
      //   console.log(response.data);
      // } catch (err) {
      //   console.log(err);
      // }

      // const body = {
      //   // email,
      //   // duration: meetingDuration,
      //   // title,
      //   // content: meetingText,
      //   // markdown: data.summerised_text,
      //   // score: window.confidenceScore,
      //   transcript: meetingText,
      // };

      // TODO: Send to server
      const res = await fetch(
        "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/update/1/",
        {
          method: "patch",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e",
          },
          body: {
            transcript:
              "This is good for the network administrator, but makes the security administrator's job more complicated (for example, when some IP number and associated temporary owner have to be chased down for questionable activity). Exactly how many possible IP numbers are there? The exact number is 232 (because the address is comprised of 32 bits), which is a number higher than 4 billion. But, every single IP number is not available; reserved ranges decrease the possible numbers. With the explosive growth of the Internet worldwide, the sad realization has dawned that the IP addresses are being rapidly depleted. What are some remedies for the address depletion? First, a particular site can use DHCP and assign IP numbers temporarily for the duration of their use. This means that not all hosts will be active at any given time and a smaller pool of possible IP numbers is required. The other remedy is something known as reserved private addresses. The governing body of the Internet, the Internet Address Numbers Authority (IANA), has set aside blocks of IP addresses to be used for internal addresses only. For instance, the 192.168 and 172.16 subnets are to be used for hosts talking within a particular network.",
          },
        }
      );

      console.log(res);

      if (!res) {
        throw new Error("Something went Wrong!");
      }

      // const resData = await res.json();

      document.getElementsByClassName("content")[0].style.display = "none";
      document.getElementsByClassName("message")[0].style.display = "block";
      document.title = "Class Study - Thanks for using Class Study";
    } catch (err) {
      console.log(err);
      document.getElementById("sendText").disabled = false;

      document.getElementById("error").innerText =
        "Error while uploading the data!";
    }
  });
