import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const USERS_PER_PAGE = 15;

  useEffect(() => {
    fetchAccountRecords();
  }, []);

  const fetchAccountRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-user-account-records');
      const data = await res.json();
      if (res.status === 200) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        toast.error(data.message || data.error || 'Failed to fetch account records.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return setFilteredUsers(users);
    const filtered = users.filter(user =>
      user.email?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleViewUser = async (email) => {
    setLoadingUser(true);
    setEditMode(false);
    setSelectedUser(null);
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const data = await res.json();
      if (res.status === 200 && Array.isArray(data)) {
        const fullUser = data.find(u => u.email?.toLowerCase() === email?.toLowerCase());
        if (fullUser) {
          setSelectedUser(fullUser);
        } else {
          toast.error('User with this email not found.');
        }
      } else {
        toast.error(data.message || data.error || 'Failed to fetch user details.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/update-user-records', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || 'User updated successfully!');
        setEditMode(false);

        setTimeout(async () => {
          const refetch = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
          const refetchData = await refetch.json();
          if (Array.isArray(refetchData)) {
            const updatedUser = refetchData.find(
              u => u.email?.toLowerCase() === selectedUser.email?.toLowerCase()
            );
            if (updatedUser) {
              setSelectedUser(updatedUser);
            } else {
              toast.error('Updated user not found in refreshed data.');
            }
          } else {
            toast.error('Unexpected format from get-all-users.');
          }
        }, 5000);
      } else {
        toast.error(data.message || data.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    }
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">View Members</h1>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email"
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

      {loading ? (
        <div className="text-center py-10 text-orange-600 font-medium text-lg">
          Loading members…
        </div>
      ) : (
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
                  <td className="px-4 py-2 border">₦{(user.savingAmount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2 border">₦{(user.loanAmount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleViewUser(user.email)}
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
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === 1
              ? 'bg-orange-200 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          } transition`}
        >
          Prev
        </button>

        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === totalPages
              ? 'bg-orange-200 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          } transition`}
        >
          Next
        </button>
      </div>

      {(loadingUser || selectedUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {loadingUser ? (
            <div className="text-white text-lg font-medium">Loading user details…</div>
          ) : (
            <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4">
                {editMode ? 'Update User' : 'User Details'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  'title', 'firstName', 'lastName', 'otherNames', 'DOB', 'NIN', 'BVN',
                  'phone','product', 'residentialAddress', 'residentialState', 'officeAddress',
                  'referenceName', 'referenceMobileCountry', 'referenceMobile',
                  'nextOfkin', 'nextOfKinMobile', 'referenceMobileCountry',
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
          )}
        </div>
      )}
    </div>
  );
};

export default Members;
