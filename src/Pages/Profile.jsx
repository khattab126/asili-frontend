import React, { useState, useEffect, useContext } from "react";
import "../style/profile.css";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          password: response.data.user.password,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return; // Prevent submission if not in edit mode

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchUserProfile(); // Refresh the profile data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsEditing(true);
  };

  const handleCancelClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsEditing(false);
    fetchUserProfile(); // Reset form
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <h1 className="profile-title">Profile Information</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="profile-label">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="profile-input"
            />
          </div>

          <div className="form-group">
            <label className="profile-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="profile-input"
            />
          </div>

          <div className="form-group">
            <label className="profile-label">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter new password" : "••••••••"}
              className="profile-input"
            />
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="edit-button"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
