import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaTruckMoving, FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify'; // ✅ Import toast

const roleIcons = {
  user: <FaUser className="inline text-indigo-600 mr-2" />,
  supplier: <FaTruckMoving className="inline text-green-600 mr-2" />,
  admin: <FaUserShield className="inline text-red-600 mr-2" />,
};

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const query = new URLSearchParams(location.search);
  const roleFromQuery = query.get('role') || 'user';

  const [role, setRole] = useState(roleFromQuery);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setRole(roleFromQuery);
  }, [roleFromQuery]);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      const msg = 'Please fill in all fields';
      toast.error(msg); // ✅ toast for missing fields
      return;
    }

    const result = await login(email, password, role);

    if (!result.success) {
      toast.error(result.message || 'Login failed'); // ✅ toast for failed login
      return;
    }

    if (result.user.role !== role) {
      const msg = `You are not authorized to login as ${role}`;
      toast.error(msg); // ✅ toast for role mismatch
      return;
    }

    // ✅ toast for success (optional)
    toast.success(`Welcome, ${result.user.name || 'User'}!`);
    navigate(`/${role}-dashboard`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-700 flex flex-col items-center justify-center px-6 py-20">
        <div className="bg-white bg-opacity-90 rounded-3xl max-w-md w-full p-10 shadow-2xl">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            {roleIcons[role]}
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>

          {errorMsg && (
            <div className="mb-4 text-red-600 font-semibold text-center">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <Link
                  to={`/forgot-password?role=${role}`}
                  className="text-indigo-600 hover:underline font-semibold text-sm"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-700">
            Don't have an account?{' '}
            <Link
              to={`/signup?role=${role}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <p className="mt-2 text-center">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <FaArrowLeft className="mr-1" /> Back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
