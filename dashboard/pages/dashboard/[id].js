import React from "react";
import SideBar from "../../components/dashboard/sidebar";
import MainQuiz from "../../components/dashboard/mainQuiz";
// import "../../components/dashboard/quiz.module.css";

export default function note() {
  return (
    <div>
      <div className="flex flex-row">
        <SideBar />
        <div className="p-10 m-auto">
          <h1 className="pb-0 font-semibold text-2xl">
            Class Conversation Recording
          </h1>
          <h3 className="pb-5 font-light text-1xl">Data Structures</h3>
          <textarea
            id="meetingText"
            placeholder="(Meeting text will appear here)"
          ></textarea>
          <div className="pt-14">
            <MainQuiz />
          </div>
        </div>
      </div>
    </div>
  );
}
