import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from '../store/UserContext';
import { useContext } from 'react';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const { storeTokenInLS } = useContext(userContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.email === '' || user.password === '') {
      setError('Please fill in both fields');
    } else {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/auth/login`,user)
        if(res){ 
          storeTokenInLS(res.data.token)
          alert("Logged In")
          navigate("/dashboard")
        } else {
          alert("hmm wrong")
        }
      } catch (error) {
        console.log("Error ",error);
      }
    }
  };

  // Handle input change and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg border border-[#E1E4E8]">
        <h2 className="text-3xl font-bold text-center text-[#2D69D4] mb-8">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 mt-1 border border-gray-300 rounded-md focus:ring-[#2D69D4] focus:border-[#2D69D4] outline-none"
                placeholder="Enter your email"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 mt-1 border border-gray-300 rounded-md focus:ring-[#2D69D4] focus:border-[#2D69D4] outline-none"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2D69D4] text-white font-semibold rounded-md hover:bg-[#4A80DB] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
