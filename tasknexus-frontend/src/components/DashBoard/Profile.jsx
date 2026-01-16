import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

const Profile = ({ userDetails, setUserDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });
  const [profilePic, setProfilePic] = useState(null); // File or URL
  const [previewPic, setPreviewPic] = useState(null); // For preview

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file)); // Temporary preview
  };

  // Update user details and profile picture
  const updateUser = async () => {
    try {
      // Update user details
      const response = await axios.put(
        `http://localhost:8081/api/update-profile/${userDetails.id}`,
        updatedDetails
      );

      if (response.status === 200 || response.status === 201) {
        setUserDetails(updatedDetails);
        localStorage.setItem("userDetails", JSON.stringify(response.data));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
        return;
      }

      // If user selected a new profile picture
      if (profilePic && profilePic instanceof File) {
        const formData = new FormData();
        formData.append("profilePic", profilePic);

        const picResponse = await axios.put(
          `http://localhost:8081/api/update-profile-pic/${userDetails.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (picResponse.status === 200 || picResponse.status === 201) {
          alert("Profile picture updated successfully!");
        } else {
          alert("Failed to update profile picture.");
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the profile.");
    }
  };

  // Fetch existing profile picture from backend
  useEffect(() => {
    let imageUrl;
    const fetchProfilePhoto = async () => {
      try {
        const email = userDetails.email;
        if (!email) return;

        const res = await fetch(
          `http://localhost:8081/api/profile-pic/${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile photo");

        const blob = await res.blob();
        imageUrl = URL.createObjectURL(blob);
        setProfilePic(imageUrl);
      } catch (err) {
        console.error("Error fetching profile photo:", err);
      }
    };

    fetchProfilePhoto();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [userDetails]);

  return (
    <div className="profile-container">
      <h2 className="heading">Profile:</h2>
      {isEditing ? (
        <div className="edit">
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={updatedDetails.username}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="bio">
            Bio:
            <textarea
              name="bio"
              value={updatedDetails.bio}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="dob">
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={updatedDetails.dob}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="gender">
            Gender:
            <select
              name="gender"
              value={updatedDetails.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label htmlFor="profilePic">
            Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          {previewPic && (
            <img
              className="profile-photo-preview"
              src={previewPic}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover", marginTop: "10px" }}
            />
          )}

          <span className="actions">
            <button className="saveButton" onClick={updateUser}>
              Save Changes
            </button>
            <button
              className="cancelButton"
              onClick={() => {
                setIsEditing(false);
                setUpdatedDetails({ ...userDetails });
                setPreviewPic(null);
              }}
            >
              Cancel
            </button>
          </span>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-header">
              <h2 >Username:  {userDetails.username}</h2>
            <div className="ProfilePic">
              <h4>Profile Picture:</h4>
              <img
                className="profile-photo"
                src={profilePic}
                alt="Profile"
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          </div>
          <h4>Bio:</h4>
          <p className="bio">{userDetails.bio || "No bio available."}</p>
          <h4>Date of Birth:</h4>
          <p className="dob">{userDetails.dob || "Not provided"}</p>
          <h4>Gender:</h4>
          <p className="gender">{userDetails.gender || "Not specified"}</p>
          <div className="profile-actions">
            <button className="editButton" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
