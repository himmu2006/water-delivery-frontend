import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUser, FaTruckMoving, FaUserShield, FaArrowRight, FaWater, FaLock } from 'react-icons/fa';

const roles = [
  {
    key: 'user',
    label: 'User',
    icon: <FaUser className="text-white text-4xl" />,
    question: 'Are you a User?',
    description:
      'Place your daily water orders quickly, manage your delivery preferences, and receive timely updates right on your dashboard.',
    bgColor: 'bg-gradient-to-tr from-indigo-600 to-indigo-400',
  },
  {
    key: 'supplier',
    label: 'Supplier',
    icon: <FaTruckMoving className="text-white text-4xl" />,
    question: 'Are you a Supplier?',
    description:
      'Access order requests, update stock availability, and track your delivery routes to ensure timely fulfillment for users.',
    bgColor: 'bg-gradient-to-tr from-green-600 to-green-400',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: <FaUserShield className="text-white text-4xl" />,
    question: 'Are you an Admin?',
    description:
      'Manage users and suppliers efficiently, monitor all deliveries, and ensure smooth operation of the entire water delivery system.',
    bgColor: 'bg-gradient-to-tr from-red-600 to-red-400',
  },
];

const features = [
  {
    icon: <FaWater className="text-indigo-600 text-4xl mb-3" />,
    title: 'Daily Water Orders',
    description: 'Place your daily water orders with ease and convenience.',
  },
  {
    icon: <FaTruckMoving className="text-green-600 text-4xl mb-3" />,
    title: 'Real-Time Tracking',
    description: 'Track deliveries in real-time for complete transparency.',
  },
  {
    icon: <FaLock className="text-red-600 text-4xl mb-3" />,
    title: 'Secure Access',
    description: 'Protected logins and password recovery to ensure safety.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleCardClick = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <>
      <Navbar userType={null} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-700 text-white flex flex-col items-center px-6 py-24 relative overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-[-100px] left-[-150px] w-[300px] h-[300px] bg-purple-600 rounded-full opacity-30 animate-blob mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-[50px] right-[-100px] w-[400px] h-[400px] bg-pink-600 rounded-full opacity-30 animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-[-120px] left-[20%] w-[300px] h-[300px] bg-indigo-600 rounded-full opacity-30 animate-blob animation-delay-4000 mix-blend-multiply filter blur-xl"></div>

        {/* Header */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 max-w-4xl text-center drop-shadow-lg tracking-wide">
          Welcome to the Daily Water Delivery Portal
        </h1>
        <p className="max-w-3xl text-center mb-16 text-lg leading-relaxed opacity-90">
          Order your daily water with ease and track deliveries right from your personalized dashboard. Our portal supports users, suppliers, and administrators to manage the water delivery system efficiently.
        </p>

        {/* Role Cards */}
        <div className="flex flex-col sm:flex-row gap-20 max-w-[1200px] w-full justify-start z-10">
          {roles.map(({ key, label, icon, question, description, bgColor }) => (
            <div
              key={key}
              onClick={() => handleCardClick(key)}
              className={`${bgColor} cursor-pointer rounded-2xl px-8 py-5 w-full sm:w-96 shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out flex flex-col justify-between`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleCardClick(key)}
              aria-label={`Select role ${label}`}
            >
              <div className="flex items-center gap-5 mb-4">
                {icon}
                <span className="text-3xl font-extrabold drop-shadow">{label}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 drop-shadow">{question}</h2>
                <p className="text-sm opacity-90 leading-relaxed">{description}</p>
              </div>
              <div className="flex justify-end mt-4">
                <FaArrowRight className="text-white text-3xl drop-shadow" />
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white text-gray-800 rounded-3xl max-w-[900px] mt-24 p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map(({ icon, title, description }, idx) => (
              <div key={idx} className="text-center flex flex-col items-center px-4">
                {icon}
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blob animation keyframes */}
        <style>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
            
            {/* Social Media */}
            <div className="flex space-x-6">
              <a href="https://x.com/himmu_2006" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.04 9.04 0 01-2.83 1.1 4.48 4.48 0 00-7.64 4.08A12.7 12.7 0 013 4.79a4.48 4.48 0 001.39 6A4.41 4.41 0 012 9.71v.05a4.48 4.48 0 003.6 4.4 4.52 4.52 0 01-2 .08 4.48 4.48 0 004.18 3.12A9 9 0 012 19.54 12.66 12.66 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.36 8.36 0 0023 3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/__himanshu.kumar__/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/himanshu-kumar-985474244/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM2 9h4v12H2zM4 4a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-sm opacity-70">
              &copy; {new Date().getFullYear()} Daily Water Delivery Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
