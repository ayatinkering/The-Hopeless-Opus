import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    teamId: "",
    leader: {
      name: "",
      email: "",
      phone: "",
      registration: "",
      institute: "",
      delegate: "",
    },
    player2: {
      name: "",
      email: "",
      phone: "",
      registration: "",
      institute: "",
      delegate: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#411E3A] to-[#0D1A2F] p-4">
      <div className="w-full max-w-3xl bg-[#0D1A2F] rounded-2xl shadow-lg p-4 sm:p-10 text-white">
        <h1 className="text-3xl font-bold text-center text-[#09D8C7] mb-2">
          Register
        </h1>
        <p className="text-center text-gray-300 mb-4">
          Join the adventure and create your gaming profile
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Team ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Team ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.teamId}
              onChange={(e) => handleChange(e, null, "teamId")}
              className="w-full px-3 py-2 rounded-md bg-[#17364F] border border-[#09D8C7]/40 focus:outline-none focus:border-[#09D8C7] text-sm"
              placeholder="Enter your team ID"
              required
            />
          </div>

          {/* Team Leader */}
          <h2 className="text-lg font-semibold text-[#09D8C7]">
            Team Leader Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Name", "name", "text"],
              ["Email", "email", "email"],
              ["Phone", "phone", "text"],
              ["Registration Number", "registration", "text"],
              ["Institute", "institute", "text"],
              ["Delegate ID", "delegate", "text"],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  value={formData.leader[field]}
                  onChange={(e) => handleChange(e, "leader", field)}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full px-3 py-2 rounded-md bg-[#17364F] border border-[#09D8C7]/40 focus:outline-none focus:border-[#09D8C7] text-sm"
                  required
                />
              </div>
            ))}
          </div>

          {/* Player 2 */}
          <h2 className="text-lg font-semibold text-[#09D8C7]">
            Player 2 Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Name", "name", "text"],
              ["Email", "email", "email"],
              ["Phone", "phone", "text"],
              ["Registration Number", "registration", "text"],
              ["Institute", "institute", "text"],
              ["Delegate ID", "delegate", "text"],
              ["Password", "password", "password"],
              ["Confirm Password", "confirmPassword", "password"],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  value={formData.player2[field]}
                  onChange={(e) => handleChange(e, "player2", field)}
                  placeholder={
                    field.includes("Password")
                      ? label
                      : `Enter player 2's ${label.toLowerCase()}`
                  }
                  className="w-full px-3 py-2 rounded-md bg-[#17364F] border border-[#09D8C7]/40 focus:outline-none focus:border-[#09D8C7] text-sm"
                  required
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#09D8C7] text-[#0D1A2F] font-semibold py-2 rounded-md hover:bg-cyan-500 transition"
          >
            REGISTER
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#09D8C7] font-medium hover:underline">
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}