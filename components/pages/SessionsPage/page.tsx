import React from "react";

const SessionsPage = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-gray-700 font-bold text-2xl">Cooking Sessions</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded cursor-pointer">
          New Session
        </button>
      </div>
    </div>
  );
};

export default SessionsPage;
