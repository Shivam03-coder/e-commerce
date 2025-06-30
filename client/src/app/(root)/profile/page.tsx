import React from "react";
import UserProfileView from "./user-profile-view";
import UserProfileSection from "./user-profile-section";

const UserProfile = () => {
  return (
    <div className="col-span-full w-full justify-center p-4 lg:col-span-4">
      <div className="flex items-center">
        <UserProfileView />
        <UserProfileSection />
      </div>
    </div>
  );
};

export default UserProfile;
