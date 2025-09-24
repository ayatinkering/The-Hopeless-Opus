import React, { useState } from "react";

export default function GamingProfile() {
  const [profileData] = useState({
    UserName: "Histaxe",
    fullName: "Sumeet",
    email: "sumeet@example.com",
    phoneNumber: "+91 9999999999",
    registrationId: "240906218",
    pointsEarned: 75, // percentage for progress bar
    rank: 3,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#411E3A] to-[#0D1A2F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Profile Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-red-500 rounded-full mx-auto mb-4 shadow-[0_0_20px_#09D8C7]"></div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#09D8C7] mb-1">
            {profileData.UserName}
          </h1>
          <p className="text-[#09D8C7] text-xs sm:text-sm">USER NAME</p>
        </div>

        {/* Personal Information Card */}
        <div className="bg-[#0D1A2F] rounded-2xl p-4 sm:p-5 mb-2 border border-[#09D8C7]/20">
          <h2 className="text-[#09D8C7] text-sm sm:text-base font-semibold mb-3">
            Personal Information
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.fullName}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.email}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Phone Number</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Registration ID</p>
              <p className="text-white border-b border-slate-700 pb-1">
                {profileData.registrationId}
              </p>
            </div>
          </div>
        </div>

        {/* Gaming Stats Card */}
        <div className="bg-[#0D1A2F] rounded-2xl p-4 border border-slate-700">
          <h2 className="text-[#09D8C7] text-sm sm:text-base font-semibold mb-3">
            Gaming Stats
          </h2>

          {/* Points Earned */}
          <div className="bg-[#17364F]/40 border border-[#09D8C7]/40 rounded-xl p-3 mb-4">
            <div className="text-center mb-2">
              <p className="text-gray-300 text-xs">Points Earned</p>
              <p className="text-white font-bold text-lg">
                {profileData.pointsEarned}
              </p>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#09D8C7] to-[#09D8C7] h-1.5 rounded-full"
                style={{ width: `${profileData.pointsEarned}%` }}
              ></div>
            </div>
          </div>

          {/* Rank */}
          <div className="bg-[#17364F]/40 border border-[#09D8C7]/40 rounded-xl p-3 mb-5">
            <div className="text-center mb-2">
              <div className="text-sm sm:text-xl md:text-xl font-bold text-white">
                #{profileData.rank}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">Rank</p>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#09D8C7] to-[#09D8C7] h-1.5 rounded-full"
                style={{ width: `${(profileData.rank / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-[#09D8C7] to-[#09D8C7] hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-2 rounded-full transition-all duration-300 transform hover:scale-103 text-xs sm:text-sm">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}