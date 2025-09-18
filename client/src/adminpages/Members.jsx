import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 15;

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const data = await res.json();

      if (res.status === 200) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        toast.error(data.message || data.error || 'Failed to fetch users.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return setFilteredUsers(users);

    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(term) ||
        user.BVN?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const handleUpdate = async () => {
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'User updated successfully!');
        setEditMode(false);
        setSelectedUser(null);
        fetchAllUsers();
      } else {
        toast.error(data.message || data.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">View Members</h1>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email or BVN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">BVN</th>
              <th className="px-4 py-2 border">Savings</th>
              <th className="px-4 py-2 border">Loan</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.BVN}</td>
                <td className="px-4 py-2 border">{user.savingAmount}</td>
                <td className="px-4 py-2 border">{user.loanAmount}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setEditMode(false);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Modal for View/Update */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Update User' : 'User Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                'title', 'firstName', 'lastName', 'otherNames', 'DOB', 'email', 'NIN',
                'phone', 'residentialAddress', 'residentialState', 'officeAddress',
                'savingAmount', 'loanAmount', 'referenceName', 'referencePhoneNo',
                'guarantorName', 'guarantorPhone', 'guarantorName2', 'guarantorPhone2',
                          ].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize mb-1">{field}</label>
                  {editMode ? (
                    <input
                      type="text"
                      name={field}
                      value={selectedUser[field] || ''}
                      onChange={(e) =>
                        setSelectedUser((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  ) : (
                    <p className="px-4 py-2 border rounded-md bg-gray-50">
                      {selectedUser[field] || '—'}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              {editMode ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setEditMode(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
