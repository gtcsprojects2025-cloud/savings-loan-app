import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        console.warn(`Retry ${i + 1} for ${url}`);
      } else {
        throw err;
      }
    }
  }
};

const Obligations = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const email = localStorage.getItem('email') || 'rolandmario2@gmail.com';
  // const userToken = localStorage.getItem('userToken') || 'demo-token';

  useEffect(() => {
    const fetchObligations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithRetry(
          `https://admin.gtcooperative.com/api/get-transaction-history?email=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${userToken}`, // Uncomment if needed
            },
          }
        );
        const result = await response.json();
        console.log('Obligations API response:', JSON.stringify(result, null, 2));

        if (result.transaction_details && Array.isArray(result.transaction_details)) {
          const transformedObligations = result.transaction_details
            .filter((tx) => Number(tx.loanAmount) > 0 || tx.guarantor || tx.interest || tx.dueDate)
            .map((tx, index) => {
              console.log('Processing transaction:', {
                id: tx._id,
                loanAmount: tx.loanAmount,
                dueDate: tx.dueDate,
                interest: tx.interest,
                guarantor: tx.guarantor,
                status: tx.status,
                comment: tx.comment,
              });
              return {
                id: tx._id || `loan-${index + 1}`,
                loanAmount: Number(tx.loanAmount) || 0,
                dueDate: tx.dueDate ? format(parseISO(tx.dueDate), 'yyyy-MM-dd') : 'N/A',
                interest: tx.interest || '0',
                guarantor: tx.guarantor || 'N/A',
                status: tx.status || 'Unknown',
                notes: tx.comment || 'No notes',
              };
            });
          console.log('Transformed obligations:', transformedObligations);
          setObligations(transformedObligations);
        } else {
          console.warn('No obligation data found:', result.message || 'Invalid response format');
          setObligations([]);
        }
      } catch (err) {
        console.error('Obligation fetch error:', err.message);
        setError(`Failed to load obligations: ${err.message}`);
        setObligations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObligations();
  }, [email]);

  // Filter obligations based on search
  const filteredObligations = obligations.filter(
    (item) =>
      item.guarantor.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredObligations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedObligations = filteredObligations.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="p-4 w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Obligations</h3>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by guarantor, status, or loan ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue pl-10"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold">Loan ID</th>
                <th className="p-3 font-semibold">Loan Amount</th>
                <th className="p-3 font-semibold">Due Date</th>
                <th className="p-3 font-semibold">Interest (%)</th>
                <th className="p-3 font-semibold">Guarantor</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedObligations.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 relative"
                  onMouseEnter={() => setModalItem(item)}
                  onMouseLeave={() => setModalItem(null)}
                >
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">₦{item.loanAmount.toLocaleString()}</td>
                  <td className="p-3">{item.dueDate}</td>
                  <td className="p-3">{item.interest}%</td>
                  <td className="p-3">{item.guarantor}</td>
                  <td
                    className={`p-3 ${
                      item.status.toLowerCase() === 'approved'
                        ? 'text-green-600'
                        : item.status.toLowerCase() === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </td>
                  {modalItem && modalItem.id === item.id && (
                    <div className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 left-1/2 transform -translate-x-1/2 mt-12">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Loan Obligation Details</h4>
                      <p><strong>Loan ID:</strong> {item.id}</p>
                      <p><strong>Loan Amount:</strong> ₦{item.loanAmount.toLocaleString()}</p>
                      <p><strong>Due Date:</strong> {item.dueDate}</p>
                      <p><strong>Interest:</strong> {item.interest}%</p>
                      <p><strong>Guarantor:</strong> {item.guarantor}</p>
                      <p><strong>Status:</strong> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
                      <p><strong>Notes:</strong> {item.notes}</p>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginatedObligations.length === 0 && (
          <div className="text-center text-gray-600 mt-4">No loan obligations found</div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brandBlue text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#f97316] text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Obligations;