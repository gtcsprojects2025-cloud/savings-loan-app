import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // ✅ show 4 per page

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  const fetchLoanApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://admin.gtcooperative.com/api/fetch-all-user-loan-data'
      );
      const data = await res.json();

      if (res.status === 200 && Array.isArray(data.all_loan_details)) {
        console.log('✅ Loan applications:', data.all_loan_details);
        setApplications(data.all_loan_details);
      } else if (res.status === 400) {
        toast.error(data.error || 'No loan application found.');
      } else {
        toast.error(data.error || 'Failed to fetch loan applications.');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (path, originalName) => {
    console.log('⬇️ Download clicked:', { path, originalName });
    if (!path) return toast.error('File path not found.');

    // ✅ Always use backend path directly
    const url = path;

    // ✅ Fallback filename from path if originalName not given
    const fallbackName = path.split('/').pop() || 'application.pdf';
    const fileName = originalName || fallbackName;

    console.log('🔗 Download URL:', url, '📄 File name:', fileName);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = applications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <div className="text-center py-10 text-orange-600 font-medium text-lg">
          Loading applications…
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No applications found.
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid gap-4">
            {currentApps.map((app) => (
              <div
                key={app._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    {app.firstName || 'Unknown'} {app.surName || ''}
                  </p>
                  {app.email && (
                    <p className="text-gray-600 text-sm">{app.email}</p>
                  )}
                  <p className="text-gray-700 mt-1">
                    Submitted request — click below to download
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(app.path, app.originalName)}
                  className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
