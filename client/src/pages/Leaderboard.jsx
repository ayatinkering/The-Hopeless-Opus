import React, { useState } from "react";

export default function Leaderboard() {
  const [teams] = useState([
    {
      rank: "IV",
      teamName: "Code Ninjas",
      members: ["Aarav", "Mayank"],
      essence: "92,345",
    },
    {
      rank: "V",
      teamName: "Bug Smashers",
      members: ["Kasliwal", "Pranav"],
      essence: "85,123",
    },
    {
      rank: "VI",
      teamName: "Stack Overflowers",
      members: ["Pravar", "Sumeet"],
      essence: "81,742",
    },
  ]);

  const stats = [
    {
      label: "ACTIVE MINDS",
      value: "2,847",
    },
    {
      label: "DEEP STATE",
      value: "743",
    },
    {
      label: "VOID RANK",
      value: "#1234",
    },
  ];

  return (
    <div className="min-h-screen pt-15 bg-[#0D1A2B] text-white">
      {/* Navbar */}
      

      {/* Stats & Leaderboard Section */}
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#111C33] flex items-center gap-4 px-6 py-4 rounded-lg shadow-lg w-full sm:w-auto"
            >
              <div className="w-18 h-18 bg-black rounded-lg" />
              <div>
                <h3 className="text-cyan-400 text-sm font-semibold">
                  {stat.label}
                </h3>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-[#111C33] mt-8 p-6 sm:p-8 md:p-10 rounded-2xl">
          {/* Team Avatars */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 mb-10">
            {teams.map((team) => (
              <div key={team.teamName} className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full mx-auto border-4 border-gray-700 bg-gray-600" />
                <h4 className="mt-3 text-base sm:text-lg font-semibold">
                  {team.teamName}
                </h4>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 px-4 sm:px-6 py-3 border-b border-gray-700 text-cyan-300 font-semibold text-sm sm:text-base">
                <span>RANK</span>
                <span>TEAM</span>
                <span className="text-right">ESSENCE</span>
              </div>

              {/* Rows */}
              {teams.map((team, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-4 px-4 sm:px-6 py-4 border-b border-gray-800 hover:bg-[#0E2038] transition items-center"
                >
                  {/* Rank */}
                  <span className="text-teal-300 font-semibold text-sm sm:text-base">
                    {team.rank}
                  </span>

                  {/* Team Info */}
                  <div>
                    <p className="font-bold text-sm sm:text-base">
                      {team.teamName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {team.members.join(", ")}
                    </p>
                  </div>

                  {/* Essence */}
                  <span className="text-cyan-400 font-semibold text-right text-sm sm:text-base">
                    {team.essence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}