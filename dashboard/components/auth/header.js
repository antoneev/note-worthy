import React from "react";

export default function header() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-700 dark:text-white">
        Call Study
      </h2>
      <div className="hero container max-w-screen-lg mx-auto pt-5 pb-2">
        <img
          className="mx-auto"
          src="https://img.icons8.com/carbon-copy/100/000000/video-conference.png"
        />
      </div>
      <h3 className="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Welcome Back
      </h3>

      {/* <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
        Welcome Back{" "}
      </p> */}
    </div>
  );
}
