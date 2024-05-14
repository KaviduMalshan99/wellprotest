import { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css';
import { Link } from 'react-router-dom';
import AuthAPI from '../src/api/AuthAPI';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AuthAPI.fetchCustomers();
        setUsers(response.data.customers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.UserId.toString().includes(searchTerm)
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = async (userId) => {
    try {
      await AuthAPI.deleteCustomer(userId);
      setUsers(users.filter(user => user.UserId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-container">
      <div>
        <h1>USERS SECTION</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>

      <div>
        <h3 className='subtitle'>Existing Users ({filteredUsers.length})</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.UserId}>
                <td>{user.UserId}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/admin/customer/${user.UserId}`} className="view-more-button">
                    View More
                  </Link>
                  <button className="delete-button" onClick={() => handleDelete(user.UserId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
