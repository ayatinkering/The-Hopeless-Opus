import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../lib/api_endpoint";
import { useNavigate } from "react-router-dom";

export default function Profile({ setUser }) {
  const [profileData, setProfileData] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndRank = async () => {
      if (!storedUser) return;

      try {
        // --- Fetch Profile ---
        const profileRes = await axios.get(
          `${API_BASE}/users/${storedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profile = profileRes.data;
        setProfileData(profile);

        // --- Fetch Leaderboard ---
        const leaderboardRes = await axios.get(`${API_BASE}/leaderboard`);
        const leaderboardData = Array.isArray(leaderboardRes.data.leaderboard)
          ? leaderboardRes.data.leaderboard
          : leaderboardRes.data;

        // Sort leaderboard by points descending
        const sorted = [...leaderboardData].sort(
          (a, b) => (b.points ?? 0) - (a.points ?? 0)
        );

        // Find current user's rank by matching teamId or _id
        const teamIndex = sorted.findIndex(
          (t) =>
            t._id === profile._id ||
            t.teamId === profile.teamId ||
            t.teamLeader?.email === profile.teamLeader?.email
        );

        setRank(teamIndex !== -1 ? teamIndex + 1 : "N/A");
      } catch (err) {
        // console.error("Error fetching profile or rank:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRank();
  }, [storedUser, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (loading || !profileData) {
    return <p className="text-center text-white mt-20">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#411E3A] to-[#0D1A2F] flex flex-col items-center justify-start p-4 pt-28">
      <div className="w-full max-w-lg">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-[#09D8C7] mb-1">
            {profileData.teamId}
          </h1>
        </div>

        {/* Personal Information */}
        <div className="bg-[#0D1A2F] rounded-2xl p-4 mb-2 border border-[#09D8C7]/20">
          <h2 className="text-[#09D8C7] text-base font-semibold mb-3">
            Personal Information
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400">Team Leader Name</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.teamLeader.name}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.teamLeader.email}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Phone Number</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.teamLeader.phone}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Registration ID</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.teamLeader.registrationNumber}
              </p>
            </div>
            {profileData.player2 && (
              <>
                <div>
                  <p className="text-gray-400">Teammate Name</p>
                  <p className="text-white border-b border-slate-700 pb-1">
                    {profileData.player2.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Teammate Email</p>
                  <p className="text-white border-b border-slate-700 pb-1">
                    {profileData.player2.email}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Gaming Stats */}
        <div className="bg-[#0D1A2F] rounded-2xl p-4 mb-2 border border-[#09D8C7]/20">
          <h2 className="text-[#09D8C7] text-base font-semibold mb-3">
            Gaming Stats
          </h2>
          <div className="flex gap-4">
            <div className="w-1/2 bg-[#0D1A2F] rounded-xl p-3 border border-[#09D8C7]/20 text-center">
              <p className="text-gray-400 text-sm">Points Earned</p>
              <p className="text-white font-semibold">{profileData.points}</p>
            </div>
            <div className="w-1/2 bg-[#0D1A2F] rounded-xl p-3 border border-[#09D8C7]/20 text-center">
              <p className="text-gray-400 text-sm">Rank</p>
              <p className="text-white font-semibold">
                {rank !== null ? `#${rank}` : "#N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-[#9f1818] hover:bg-[#800b0b] text-white font-normal px-8 py-2 rounded-full transition text-base"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
