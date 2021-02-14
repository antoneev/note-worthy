import React from "react";
import SideBar from "../../components/dashboard/sidebar";

export default function note() {
  return (
    <div>
      <div className="flex flex-row">
        <SideBar />
        <div className="p-10">
          <h1 className="pb-5 font-semibold text-2xl">
            Class Conversation Recording
          </h1>
          <textarea
            id="meetingText"
            placeholder="(Meeting text will appear here)"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
