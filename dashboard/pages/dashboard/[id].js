import { useEffect, useState } from "react";
import SideBar from "../../components/dashboard/sidebar";
import MainQuiz from "../../components/dashboard/mainQuiz";
// import "../../components/dashboard/quiz.module.css";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

export default function note() {
  const router = useRouter();
  const { id } = router.query;

  const { addToast } = useToasts();
  const [data, setData] = useState({});
  const [ques, setQues] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNote = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e`,
        },
      };
      const response = await axios.get(
        `https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/retrieve/1/`,
        config
      );

      console.log(`rrrrr ${response}`);

      addToast(`Notes Loaded successfully!`, {
        appearance: "success",
        autoDismiss: true,
      });

      setData(response.data);
      setQues(response.data.questions);

      // console.log(ques);

      setLoading(false);
      // console.log(`qqqqqqqqqq ${response.data}`);
    } catch (err) {
      console.log(err);
      addToast("Server Error!", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getNote();
    // console.log(data);
    // console.log(`qqqq ${data.questions}`);
  }, []);

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <div className="flex flex-row">
        <SideBar />
        <div className="p-10 m-auto">
          <h1 className="pb-0 font-semibold text-2xl">
            Class Conversation Recording
          </h1>
          <h3 className="pb-5 font-light text-1xl">{data.session_name}</h3>
          <textarea
            id="meetingText"
            placeholder="(Meeting text will appear here)"
            value={data.transcript}
          ></textarea>
          <div className="pt-14">
            {/* <div>{ques}</div> */}
            {/* <MainQuiz questions={[]} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
