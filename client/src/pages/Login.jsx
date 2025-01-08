import React from "react";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        {/* Logo and Welcome */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#4E45E5" }}>
            NRS
          </h1>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: "#4E45E5" }}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••••"
              name="password"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: "#4E45E5" }}
              autoComplete="off"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            style={{ backgroundColor: "#4E45E5" }}
          >
            Login
          </button>
        </form>
        {/* Footer */}
        <div className="mt-6 text-sm text-center text-gray-400">
          Developed with ❤️ by Sumukha Sureban.
        </div>
      </div>
    </div>
  );
};

export default Login;
