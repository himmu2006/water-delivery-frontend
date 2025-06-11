import React from 'react';

const ProfileSection = ({ profile }) => {
  if (!profile) return <p>No profile data.</p>;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h3>
        <div className="space-y-4 text-gray-700">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
