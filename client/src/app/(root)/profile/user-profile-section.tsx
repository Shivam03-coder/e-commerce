"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  MapPin,
  LocateOffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetUserInfoQuery } from "@/apis/auth-api";

const UserProfileSection = () => {
  const { data, isLoading, isError } = useGetUserInfoQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    if (data?.result) {
      setUser({
        name: data.result.name || "",
        email: data.result.email || "",
        phone: data.result.phoneNumber || "",
        address: data.result.address || "",
      });
      setEditedUser({
        name: data.result.name || "",
        email: data.result.email || "",
        phone: data.result.phoneNumber || "",
        address: data.result.address || "",
      });
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...editedUser });
    setIsEditing(false);
    // Here you would typically call an API to save the changes
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading user data...</div>;
  }

  if (isError || !data?.result) {
    return <div className="p-6 text-center">Error loading user data</div>;
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-none border border-green-300 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        {isEditing ? (
          <Button onClick={handleSave} className="gap-2">
            <Save size={18} /> Save Changes
          </Button>
        ) : (
          <Button variant="outline" onClick={handleEdit} className="gap-2">
            <Edit2 size={18} /> Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <User className="text-gray-600" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Full Name
            </label>
            {isEditing ? (
              <Input
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <p className="text-gray-800">{user.name}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <Mail className="text-gray-600" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Email Address
            </label>
            {isEditing ? (
              <Input
                name="email"
                type="email"
                value={editedUser.email}
                onChange={handleChange}
                className="w-full"
                disabled // Typically email shouldn't be editable
              />
            ) : (
              <p className="text-gray-800">{user.email}</p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <Phone className="text-gray-600" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                name="phone"
                value={editedUser.phone}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <p className="text-gray-800">{user.phone}</p>
            )}
          </div>
        </div>

        {/* Address Field */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <MapPin className="text-gray-600" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Address
            </label>
            {isEditing ? (
              <Input
                name="address"
                value={editedUser.address}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <p className="text-gray-800">{user.address || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
