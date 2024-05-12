import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Frontend/user/UserProfile";
import { useAuthStore } from "../src/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Header from "../Frontend/Header/Header";
import Footer from "../Frontend/Footer/Footer";
import '../Frontend/user/UserProfile.scss'

function UserProfile() {
  const navigate = useNavigate();
  const { logout, user: sessionUser } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));
  const UserId = sessionUser?.UserId;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!UserId) {
      console.error("UserId is undefined");
      setError("UserId is not available");
      return;
    }
    fetchUser(UserId);
  }, [UserId]);

  const fetchUser = async (UserId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/customer/${UserId}`
      );
      setUser(response.data.customer);
      setError(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    const userToUpdate = {
      firstName: user.firstName,
      lastName: user.lastName,
      contact: user.contact,
      email: user.email,
      profileUrl: user.profileUrl,
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };
    //
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/updatecustomer/${UserId}`,
        userToUpdate
      );
      setIsEditing(false);
      setError(null);
      alert(res.data.message);
      setUser((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/api/deletecustomer/${UserId}`);
      setIsLoading(false);
      alert("User deleted successfully");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
      setIsLoading(false);
    }
  };

  return (
    <div>

      <div className="userpropath">ADMIN - Profile</div>
      <div className="usermain" style={{ padding: "20px" }}>

        <div className="upfirst">
          <div className="uplblsec">
            <label className="uplbls">First Name:</label>
            <label className="uplbls">Last Name:</label>
            <label className="uplbls">Contact No:</label>
            <label className="uplbls">Email:</label>
            <label className="uplbls">Role:</label>
            <label className="uplbls">Profile Image:</label>
            <label className="uplbls">Old Password:</label>
            <label className="uplbls">New Password:</label>
          </div>
          <div className="upintextsec">
            <input
              type="text"
              name="firstName"
              value={user.firstName || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="lastName"
              value={user.lastName || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="contact"
              value={user.contact || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="email"
              value={user.email || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="profileUrl"
              value={user.role || ""}

              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="profileUrl"
              value={user.profileUrl || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />

            <input
              type="password"
              name="oldPassword"
              value={user.oldPassword || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="password"
              name="newPassword"
              value={user.newPassword || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
          </div>
          <div className="imgnbtnsecup">
            <div className="upimgsec">
              {user.profileUrl ? (
                <img
                  src={user.profileUrl}
                  alt={`${user.firstName}'s profile`}
                  className="uuprofile-image"
                />
              ) : (
                <div>No profile image available</div>
              )}
            </div>

            {isEditing ? (
              <button className="editupbtn" onClick={handleUpdate}>Update</button>
            ) : (
              <button onClick={handleEdit} className="editupbtn">Edit</button>
            )}</div>

        </div>
        <div className="upsecond" style={{ marginTop: "20px" }}>
          <button className='logoutbtnup' onClick={handleDelete}>Delete Account</button>
        </div>
        <div className="logout">
          <button className='logoutbtnup' onClick={handleLogout}>Logout</button>
        </div>

      </div>

    </div>
  );
}

export default UserProfile;
