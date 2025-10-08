import React, { useEffect, useState } from "react";
import API_BASE from '../lib/api_endpoint';

const TEAMS_PER_PAGE = 10;

export default function Leaderboard({ currentUserId, token }) {
  const [teams, setTeams] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let url = `${API_BASE}/leaderboard`;
        const headers = {};

        if (currentUserId && token) {
          url = `${API_BASE}/leaderboard/current`;
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch leaderboard");

        const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : data;
        setTeams(leaderboard);
        if (data.currentUserIndex !== undefined) setCurrentUserIndex(data.currentUserIndex);
      } catch (err) {
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserId, token]);

  // 🔁 Pagination Calculations
  const totalPages = Math.ceil(teams.length / TEAMS_PER_PAGE);
  const startIndex = (currentPage - 1) * TEAMS_PER_PAGE;
  const paginatedTeams = teams.slice(startIndex, startIndex + TEAMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <p className="text-center text-white mt-20">Loading leaderboard...</p>;
  }

  return (
    <div className="min-h-screen pt-15 bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <div className="bg-gray-900 flex items-center gap-6 px-12 py-8 rounded-2xl shadow-2xl w-full sm:w-auto text-lg sm:text-xl">
            <div>
              <h3 className="text-cyan-400 text-sm font-semibold">ACTIVE USERS</h3>
              <p className="text-2xl md:text-3xl font-bold">{teams.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 flex items-center gap-6 px-12 py-8 rounded-2xl shadow-2xl w-full sm:w-auto text-lg sm:text-xl">
            <div>
              <h3 className="text-cyan-400 text-sm font-semibold">CURRENT RANK</h3>
              <p className="text-2xl md:text-3xl font-bold">
                {currentUserIndex !== null ? `#${currentUserIndex + 1}` : "#N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Teams */}
        <div className="bg-gray-900 mt-8 p-6 sm:p-8 md:p-10 rounded-2xl">
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 mb-10">
            {teams.slice(0, 3).map((team, idx) => {
              const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
              return (
                <div key={team._id || idx} className="text-center">
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto border-4 border-gray-700 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: medalColors[idx] }}
                  >
                    <span className="text-black font-bold text-lg">{team.teamId || "T"}</span>
                  </div>
                  <h4 className="mt-3 text-base sm:text-lg font-semibold">
                    {team.teamLeader?.name}
                    {team.player2?.name ? `, ${team.player2.name}` : ""}
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {team.points ?? 0} pts
                  </p>
                </div>
              );
            })}
          </div>

          {/* Leaderboard Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 px-4 sm:px-6 py-3 border-b border-gray-700 text-cyan-300 font-semibold text-sm sm:text-base">
                <span>RANK</span>
                <span>TEAM ID</span>
                <span>TEAM MEMBERS</span>
                <span className="text-right">POINTS</span>
              </div>

              {/* Rows */}
              {paginatedTeams.map((team, idx) => {
                const globalIndex = startIndex + idx; // 🔁 Correct index for rank
                return (
                  <div
                    key={team._id || idx}
                    className={`grid grid-cols-4 gap-4 px-4 sm:px-6 py-4 border-b border-gray-800 transition items-center ${
                      globalIndex === currentUserIndex ? "bg-[#134273]" : "hover:bg-[#0E2038]"
                    }`}
                  >
                    <span className="text-teal-300 font-semibold text-sm sm:text-base">
                      {globalIndex + 1}
                    </span>
                    <span className="font-bold text-sm sm:text-base">{team.teamId}</span>
                    <div className="text-gray-300 text-sm sm:text-base">
                      {team.teamLeader?.name}
                      {team.player2?.name ? `, ${team.player2.name}` : ""}
                    </div>
                    <span className="text-cyan-400 font-semibold text-right text-sm sm:text-base">
                      {team.points ?? 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔁 Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4 text-white">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-cyan-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}