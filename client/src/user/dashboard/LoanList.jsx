

















import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
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
  const userToken = localStorage.getItem('userToken') || 'demo-token';

  // Demo data for obligations
  const demoObligations = [
    { id: 'loan-001', loanAmount: 50000, dueDate: '2025-12-01', interest: 8, guarantor: 'John Doe', status: 'Active', notes: 'Business loan' },
    { id: 'loan-002', loanAmount: 75000, dueDate: '2026-03-15', interest: 3, guarantor: 'Jane Smith', status: 'Pending', notes: 'Personal loan' },
    { id: 'loan-003', loanAmount: 100000, dueDate: '2025-11-30', interest: 8, guarantor: 'Michael Brown', status: 'Active', notes: 'Home purchase' },
    { id: 'loan-004', loanAmount: 25000, dueDate: '2026-01-10', interest: 3, guarantor: 'Emily Davis', status: 'Overdue', notes: 'Education loan' },
    { id: 'loan-005', loanAmount: 120000, dueDate: '2026-06-20', interest: 8, guarantor: 'David Wilson', status: 'Active', notes: 'Business expansion' },
    { id: 'loan-006', loanAmount: 30000, dueDate: '2025-10-05', interest: 3, guarantor: 'Sarah Johnson', status: 'Pending', notes: 'Medical expenses' },
    { id: 'loan-007', loanAmount: 80000, dueDate: '2026-02-28', interest: 8, guarantor: 'Chris Lee', status: 'Active', notes: 'Vehicle purchase' },
    { id: 'loan-008', loanAmount: 45000, dueDate: '2025-09-15', interest: 3, guarantor: 'Anna Taylor', status: 'Overdue', notes: 'Personal loan' },
    { id: 'loan-009', loanAmount: 60000, dueDate: '2026-04-01', interest: 8, guarantor: 'Mark Anderson', status: 'Active', notes: 'Business loan' },
    { id: 'loan-010', loanAmount: 90000, dueDate: '2026-05-10', interest: 3, guarantor: 'Lisa Martinez', status: 'Pending', notes: 'Education loan' },
  ];

  useEffect(() => {
    const fetchObligations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Commented out API call (to be updated with provided endpoint)
        /*
        const response = await fetchWithRetry(
          `https://savings-loan-app.vercel.app/api/get-obligations?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        const result = await response.json();
        console.log('Obligations API response:', JSON.stringify(result, null, 2));
        if (response.ok && result.obligation_details) {
          const transformedObligations = result.obligation_details.map((ob, index) => ({
            id: ob._id || `loan-${index + 1}`,
            loanAmount: ob.loanAmount || 0,
            dueDate: format(new Date(ob.dueDate), 'yyyy-MM-dd'),
            interest: ob.interestRate || 0,
            guarantor: ob.guarantorName || 'N/A',
            status: ob.status || 'Active',
            notes: ob.notes || 'No notes',
          }));
          setObligations(transformedObligations);
        } else {
          console.warn('No obligation data found:', result.message);
          setObligations([]);
        }
        */
        // Using demo data for now
        setObligations(demoObligations);
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
                      item.status === 'Active'
                        ? 'text-green-600'
                        : item.status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {item.status}
                  </td>
                  {modalItem && modalItem.id === item.id && (
                    <div className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 left-1/2 transform -translate-x-1/2 mt-12">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Loan Obligation Details</h4>
                      <p><strong>Loan ID:</strong> {item.id}</p>
                      <p><strong>Loan Amount:</strong> ₦{item.loanAmount.toLocaleString()}</p>
                      <p><strong>Due Date:</strong> {item.dueDate}</p>
                      <p><strong>Interest:</strong> {item.interest}%</p>
                      <p><strong>Guarantor:</strong> {item.guarantor}</p>
                      <p><strong>Status:</strong> {item.status}</p>
                      <p><strong>Notes:</strong> {item.notes}</p>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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