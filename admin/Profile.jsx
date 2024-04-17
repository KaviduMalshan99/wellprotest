import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profileImage from '../src/assets/profile.png';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/customer/1`);
        setUser(response.data.customer);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Make an API call to update the data in the database
      await axios.post(`http://localhost:3001/api//updatecustomer`, {
        userId: user.UserId,
        firstName: user.FirstName,
        lastName: user.Lastname,
        email: user.Email,
        contact: user.Contact,
        password: user.Password,
      });

      // Set the state to indicate that it's no longer in edit mode
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className='mainContainer'>
      <h3>Main Details</h3>
      {/* Main Profile Section */}
      <div className="mainProfileSection">
        <div className="profileImageContainer">
          <img
            src={user.ProfileUrl || profileImage}
            alt="Profile"
            className="profileImage"
          />
        </div>
        <div className="profileDetails">
          <div className='d1'>
            <p>Name: </p>
            <p>Email: </p>
            <p>Contact: </p>
            <p>Password: </p>
          </div>
          <div className="d2">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={user.FirstName}
                  onChange={(e) => setUser({ ...user, FirstName: e.target.value })}
                />
                <input
                  type="text"
                  value={user.Email}
                  onChange={(e) => setUser({ ...user, Email: e.target.value })}
                />
                <input
                  type="text"
                  value={user.Contact}
                  onChange={(e) => setUser({ ...user, Contact: e.target.value })}
                />
                <input
                  type="text"
                  value={user.Password}
                  onChange={(e) => setUser({ ...user, Password: e.target.value })}
                />
              </>
            ) : (
              <>
                <p>{user.FirstName || 'No details uploaded'}</p>
                <p>{user.Email || 'No details uploaded'}</p>
                <p>{user.Contact || 'No details uploaded'}</p>
                <p>{user.Password || 'No details uploaded'}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {editMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};

export default Profile;
