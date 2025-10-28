import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserRegistration from '../adminpages/UserRegistration';

const CreateAccount = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    BVN: '',
    primaryPhone: '',
    savingAmount: '',
    loanAmount: '',
    transactionType: 'Create',
    comment: '',
  });

  // ✅ Format phone number to 234 format
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    let cleaned = String(number).replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.slice(1);
    } else if (!cleaned.startsWith('234')) {
      cleaned = '234' + cleaned;
    }
    return cleaned;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'primaryPhone') {
      value = value.replace(/\D/g, ''); // numbers only
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

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
        toast.error('Unexpected server response.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Unable to fetch user list.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setFormData({
      ...formData,
      email: user.email || '',
      BVN: user.BVN || '',
      primaryPhone: String(user.phoneNo || ''),
    });
    setSearchResults([]);
    setSearchTerm('');
  };

  // ✅ Validate phone & BVN before creating account
  const validateUserExists = async (formattedPhone, BVN) => {
    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/get-all-users');
      const users = await res.json();

      if (Array.isArray(users)) {
        const phoneExists = users.some(
          (u) => String(u.phoneNo) === formattedPhone
        );
        const bvnExists = users.some((u) => String(u.BVN) === String(BVN));

        if (!phoneExists && !bvnExists) {
          toast.error('Phone number and BVN do not exist in the system.');
          return false;
        } else if (!phoneExists) {
          toast.error('Phone number not found.');
          return false;
        } else if (!bvnExists) {
          toast.error('BVN not found.');
          return false;
        }
        return true;
      } else {
        toast.error('Invalid response while checking user existence.');
        return false;
      }
    } catch (err) {
      console.error('Validation error:', err);
      toast.error('Failed to validate phone/BVN.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const phoneValue = formData.primaryPhone.trim();
    const bvnValue = formData.BVN.trim();

    if (!phoneValue || !bvnValue) {
      toast.error('Both phone number and BVN are required.');
      setLoading(false);
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneValue);

    // 🔍 Validate before submission
    const isValid = await validateUserExists(formattedPhone, bvnValue);
    if (!isValid) {
      setLoading(false);
      return; // Stop here if BVN or phone does not exist
    }

    const payload = {
      ...formData,
      email: formData.email.trim() || null,
      primaryPhone: formattedPhone,
    };

    try {
      const res = await fetch('https://savings-loan-app.vercel.app/api/create-user-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'Account created successfully!');
      } else {
        toast.error(data.message || 'Error creating account.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

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

        <UserRegistration onRegistrationSuccess={() => setActiveTab('create')} />
      </div>
    );
  }

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

      {/* Search */}
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
                key={user._id || idx}
                onClick={() => handleSelectUser(user)}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
              >
                {user.firstName} {user.lastName} — {user.email || 'No email'}
              </li>
            ))}
          </ul>
        )}
      </div>

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
        className={`bg-white p-6 rounded-lg shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <table className="table-auto w-full border-separate border-spacing-y-4">
          <tbody>
            <tr>
              <td className="w-1/4 font-medium text-sm">Email (Optional)</td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter user's email (optional)"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </td>
            </tr>

            <tr>
              <td className="font-medium text-sm">Phone Number *</td>
              <td>
                <input
                  type="text"
                  name="primaryPhone"
                  value={formData.primaryPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="font-medium text-sm">BVN *</td>
              <td>
                <input
                  type="text"
                  name="BVN"
                  value={formData.BVN}
                  onChange={handleChange}
                  placeholder="Enter BVN"
                  className="w-full px-4 py-2 border rounded-md"
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
                  value={formData.savingAmount}
                  onChange={handleChange}
                  placeholder="Enter saving amount"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </td>
            </tr>

            <tr>
              <td className="font-medium text-sm">Loan Amount</td>
              <td>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder="Enter loan amount"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </td>
            </tr>

            <tr>
              <td className="font-medium text-sm">Comment</td>
              <td>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Optional comment"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
