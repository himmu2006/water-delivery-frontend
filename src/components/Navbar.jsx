import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      {/* Logo / Title */}
      <div
        className="font-extrabold text-2xl cursor-pointer select-none hover:text-pink-300 transition duration-300"
        onClick={() => navigate('/')}
      >
        Water Delivery Portal
      </div>

      {/* Right side links/buttons */}
      <div className="flex items-center space-x-8">
        {user ? (
          <>
            {/* Dashboard Link */}
            {user.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                className="text-white hover:text-pink-300 font-semibold transition duration-300"
              >
                Admin Dashboard
              </Link>
            )}
            {user.role === 'supplier' && (
              <Link
                to="/supplier-dashboard"
                className="text-white hover:text-pink-300 font-semibold transition duration-300"
              >
                Supplier Dashboard
              </Link>
            )}
            {user.role === 'user' && (
              <Link
                to="/user-dashboard"
                className="text-white hover:text-pink-300 font-semibold transition duration-300"
              >
                User Dashboard
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          null
        )}
      </div>
    </nav>
  );
};

export default Navbar;
