import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserRegistration from '../adminpages/UserRegistration'; // ✅ added import

const CreateAccount = () => {
  const [activeTab, setActiveTab] = useState('create'); // for tab switching

  const [formData, setFormData] = useState({
    email: '',
    BVN: '',
    savingAmount: '',
    loanAmount: '',
    transactionType: 'Create',
    comment: '',
  });

  const [loading, setLoading] = useState(false);

  // ----- Search states -----
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ----- Search (fetch all users and filter locally) -----
  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return; // don't search empty

    setSearching(true);
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const data = await res.json();

      if (res.status === 200 && Array.isArray(data)) {
        const matches = data.filter((u) =>
          (u.firstName || '').toLowerCase().includes(term) ||
          (u.lastName || '').toLowerCase().includes(term) ||
          (u.otherNames || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term)
        );
        setSearchResults(matches);
      } else {
        setSearchResults([]);
        toast.error('Unexpected response format from users API');
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Server error during search');
    } finally {
      setSearching(false);
    }
  };

  // When a search result is clicked, populate email & BVN
  const handleSelectUser = (user) => {
    setFormData((prev) => ({
      ...prev,
      email: user.email || '',
      BVN: user.BVN || '',
    }));
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/create-user-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'Account created successfully!');
      } else if (res.status === 400) {
        toast.error(data.message || 'User account already exists.');
      } else if (res.status === 500) {
        toast.error(data.message || 'Server error. Please try again.');
      } else {
        toast.error('Unexpected response.');
      }
    } catch (err) {
      console.error('Create account error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render User Registration page when activeTab = "registration"
  if (activeTab === 'registration') {
    return (
      <div className="w-full max-w-4xl mx-auto relative">
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('registration')}
            className="px-4 py-2 font-medium text-sm border-b-2 border-orange-500 text-orange-600"
          >
            User Registration
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className="px-4 py-2 font-medium text-sm text-gray-600 hover:text-orange-500"
          >
            Create User Account
          </button>
        </div>

        {/* ✅ Pass callback to auto-switch after success */}
        <UserRegistration
          onRegistrationSuccess={() => setActiveTab('create')}
        />
      </div>
    );
  }

  // ✅ Default Create Account page
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('registration')}
          className="px-4 py-2 font-medium text-sm text-gray-600 hover:text-orange-500"
        >
          User Registration
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className="px-4 py-2 font-medium text-sm border-b-2 border-orange-500 text-orange-600"
        >
          Create User Account
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Account</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Search by Name or Email</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter name or email"
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className="mt-2 border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
            {searchResults.map((user, idx) => (
              <li
                key={user._id || user.email || idx}
                onClick={() => handleSelectUser(user)}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {user.firstName || ''} {user.lastName || ''} — {user.email || ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-orange-600 font-medium text-lg animate-pulse">
            Creating account, please wait…
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-lg shadow-md ${
          loading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <table className="table-auto w-full border-separate border-spacing-y-4">
          <tbody>
            <tr>
              <td className="w-1/4 font-medium text-sm">Email</td>
              <td>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter user's email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">BVN</td>
              <td>
                <input
                  type="text"
                  name="BVN"
                  placeholder="Enter BVN"
                  value={formData.BVN}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Saving Amount</td>
              <td>
                <input
                  type="number"
                  name="savingAmount"
                  placeholder="Enter saving amount"
                  value={formData.savingAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Loan Amount</td>
              <td>
                <input
                  type="number"
                  name="loanAmount"
                  placeholder="Enter loan amount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium text-sm">Comment</td>
              <td>
                <textarea
                  name="comment"
                  placeholder="Optional comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
