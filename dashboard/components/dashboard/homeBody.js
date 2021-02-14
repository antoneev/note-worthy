import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import HomeCard from "../../components/dashboard/homeCard";
import CustomChatbot from "../../components/chatbot/CustomChatbot";

import { useToasts } from "react-toast-notifications";
import axios from "axios";

export default function homeBody() {
  const MAX_LENGTH = 250;

  const router = useRouter();

  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStartups = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e`,
        },
      };
      const response = await axios.get(
        "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/class-session/retrieve/",
        config
      );

      console.log(response);

      addToast(`Notes Loaded successfully!`, {
        appearance: "success",
        autoDismiss: true,
      });

      setData(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      addToast("Server Error!", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getStartups();
    console.log(data);
  }, []);

  const arr = [1, 2, 3, 4, 5, 99, 9];
  if (loading) return <div>loading...</div>;
  return (
    <div className="pattern bg-gray-100">
      <div className="container px-5 pt-10 mx-auto">
        <div className="flex flex-wrap w-full ">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
              Antone's Past Classes
            </h1>
            <div className="h-1 w-20 bg-gray-500 rounded"></div>
          </div>
          {/* <p class="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify, subway tile poke farm-to-table. Franzen you probably
            haven't heard of them man bun deep jianbing selfies heirloom prism
            food truck ugh squid celiac humblebrag.
          </p> */}
        </div>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5  pt-10 pb-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {data.map((e) => (
              <div key={e.id} className="p-4 lg:w-1/3">
                <button
                  onClick={() => router.push(`/dashboard/${e.id}`)}
                  className="text-justify"
                >
                  <HomeCard
                    session_name={e.session_name}
                    transcript={
                      e.transcript.length > MAX_LENGTH
                        ? e.transcript.substring(0, MAX_LENGTH) + " ...."
                        : e.transcript
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CustomChatbot />
    </div>
  );
}
