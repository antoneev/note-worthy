import React from "react";
import HomeCard from "../../components/dashboard/homeCard";

export default function homeBody() {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div>
      <div class="container px-5 pt-10 mx-auto">
        <div class="flex flex-wrap w-full ">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
              Antone's Past Classes
            </h1>
            <div class="h-1 w-20 bg-gray-500 rounded"></div>
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
            {arr.map((e) => (
              <div className="p-4 lg:w-1/3">
                <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-16 rounded-lg overflow-hidden text-center relative">
                  <HomeCard />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
