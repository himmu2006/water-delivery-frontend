import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="border border-gray-300 rounded p-4 mb-4 shadow-sm hover:shadow-md transition">
      <h4 className="font-semibold mb-1">{user.name}</h4>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
    </div>
  );
};

export default UserCard;
