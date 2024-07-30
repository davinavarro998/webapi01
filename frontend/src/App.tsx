import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  _id: string;
  name: string;
  age: number;
}

const FULL_API_ADDRESS: string = 'http://127.0.0.1:8080/users';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(FULL_API_ADDRESS);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(FULL_API_ADDRESS, { name, age });
      console.log('Add User Response:', response.data); // Debugging line
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setName('');
      setAge(0);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (id: string) => {
    try {
      const response = await axios.put(`${FULL_API_ADDRESS}/${id}`, { name, age });
      console.log('Update User Response:', response.data); // Debugging line
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === id ? response.data : user))
      );
      setName('');
      setAge(0);
      setEditId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`${FULL_API_ADDRESS}/${id}`);
      console.log('Delete User Response:', response.data); // Debugging line
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editId) {
      updateUser(editId);
    } else {
      addUser();
    }
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setAge(user.age);
    setEditId(user._id);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-row">
          <div className="form-group col-md-6 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group col-md-6 mb-3">
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="form-control"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mb-3">
          {editId ? 'Update User' : 'Add User'}
        </button>
      </form>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center mb-2">
            <div>
              {user.name} ({user.age})
            </div>
            <div>
              <button className="btn btn-secondary btn-sm mr-2" onClick={() => handleEdit(user)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
