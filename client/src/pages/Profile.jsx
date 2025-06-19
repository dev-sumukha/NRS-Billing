import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#2D69D4]">
            <img
              src="https://devsumukha.vercel.app/assets/profile-B9ogzZLI.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Admin Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#2D69D4]">
              Sumukha N. Sureban
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              MD (NR Sureban Fireworks)
            </p>
            <p className="text-gray-500 mt-4">
              <span className="font-semibold">Email:</span> sumukhasureban@gmail.com
            </p>
            <p className="text-gray-500 mt-2">
              <span className="font-semibold">Customer Count:</span> 152
            </p>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Account Details
          </h2>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Joined:</span>
              <span className="text-gray-600">January 15, 2022</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Role:</span>
              <span className="text-gray-600">Administrator</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
