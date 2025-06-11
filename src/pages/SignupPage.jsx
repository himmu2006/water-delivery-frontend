import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaTruckMoving, FaUserShield, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { toast } from 'react-toastify';

const roleIcons = {
  user: <FaUser className="inline text-indigo-600 mr-2" />,
  supplier: <FaTruckMoving className="inline text-green-600 mr-2" />,
  admin: <FaUserShield className="inline text-red-600 mr-2" />,
};

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const roleFromQuery = query.get('role') || 'user';

  const [role, setRole] = useState(roleFromQuery);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setRole(roleFromQuery);
  }, [roleFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (role === 'supplier') {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          };

          try {
            await API.post('/auth/signup', {
              name,
              email,
              password,
              role,
              location,
            });

            toast.success('Signup successful! Please login.');
            navigate(`/login?role=${role}`);
          } catch (error) {
            toast.error(
              error.response?.data?.message || 'Signup failed. Please try again.'
            );
          }
        },
        () => {
          toast.error('Unable to retrieve your location. Please enable location access and try again.');
        }
      );
    } else {
      try {
        await API.post('/auth/signup', {
          name,
          email,
          password,
          role,
        });

        toast.success('Signup successful! Please login.');
        navigate(`/login?role=${role}`);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Signup failed. Please try again.'
        );
      }
    }
  };

  return (
    <>
      <Navbar userType={null} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-700 flex flex-col items-center justify-center px-6 py-20">
        <div className="bg-white bg-opacity-90 rounded-3xl max-w-md w-full p-10 shadow-2xl">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            {roleIcons[role]}
            Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
                required
              />
            </div>

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
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-700">
            Already have an account?{' '}
            <Link
              to={`/login?role=${role}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="mt-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft className="mr-1" /> Back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;