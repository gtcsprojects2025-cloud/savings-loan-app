import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import loan from '../../assets/loan.png';

const Loan = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const {
    register: registerUpload,
    handleSubmit: handleSubmitUpload,
    formState: { errors: uploadErrors },
    reset: resetUpload,
  } = useForm();
  const [isUploaded, setIsUploaded] = useState(false);

  const onSubmitSelfLoan = async (data) => {
    try {
      const templateParams = {
        loanType: data.loanType,
        amount: data.amount,
        purpose: data.purpose,
        employmentStatus: data.employmentStatus,
        income: data.income,
        accountHolderName: data.accountHolderName,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        to_email: 'feezyakinwunmi001@gmail.com',
      };

      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
        templateParams,
        'YOUR_USER_ID' // Replace with your EmailJS User ID
      );

      console.log('Self-loan application data:', data);
      toast.success('Self-loan application submitted and email sent!');
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send self-loan application. Please try again.');
    }
  };

  const onSubmitUpload = async (data) => {
    const file = data.file[0];
    if (file && file.type === 'application/pdf') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', data.email);
        formData.append('firstName', data.firstName);
        formData.append('surName', data.surName);
        formData.append('BVN', data.BVN);

        const response = await fetch('https://savings-loan-app.vercel.app/api/upload-loan-application-doc', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          toast.success('Loan form uploaded successfully!');
          setIsUploaded(true);
          resetUpload();
        } else {
          toast.error(result.message || 'Failed to upload loan form.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload loan form. Please try again.');
      }
    } else {
      toast.error('Please upload a valid PDF file.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/loanform.pdf'; // Ensure the PDF is hosted or bundled in your public folder
    link.download = 'Gtcs-loan-form.pdf';
    link.click();
  };

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      {/* Introduction Section */}
      <div className="rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <img
              src={loan}
              alt="Loan Illustration"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-brandBlue mb-4">Unlock Your Financial Goals with Our Loans</h2>
            <p className="text-gray-600 mb-4">
              Our loans are designed to help you achieve your dreams, whether it’s starting a business, buying a home, or funding education. With competitive interest rates starting at <strong>5% per annum</strong>, we offer flexible terms to suit your needs. Borrow confidently with transparent fees and no hidden charges.
            </p>
            <p className="text-gray-600">
              <strong>Why borrow from us?</strong> We prioritize your financial well-being with quick approvals, personalized support, and repayment plans tailored to your budget. Join thousands of satisfied customers who trust us to fuel their aspirations.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Why Choose Our Loans?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800">Low Interest Rates</h4>
            <p className="text-sm text-gray-600">
              Enjoy rates as low as 5% per annum, making borrowing affordable.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800">Flexible Terms</h4>
            <p className="text-sm text-gray-600">
              Choose repayment terms from 6 months to 5 years to fit your budget.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800">Fast Approval</h4>
            <p className="text-sm text-gray-600">
              Get your loan approved in as little as 24 hours with our streamlined process.
            </p>
          </div>
        </div>
      </div>

      {/* Self-Loan Application Form */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Self-Loan Application</h3>
        <p className="text-gray-600 mb-4">
          Apply for a self-loan directly through our online form for quick processing and approval.
        </p>
        <form onSubmit={handleSubmit(onSubmitSelfLoan)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Loan Type</label>
            <select
              {...register('loanType', { required: 'Loan type is required' })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.loanType ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
            >
              <option value="">Select loan type</option>
              <option value="regular">Regular - 8% one-time interest</option>
              <option value="soft">Soft - 3% monthly</option>
            </select>
            {errors.loanType && (
              <p className="text-red-500 text-sm mt-1">{errors.loanType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Loan Amount</label>
            <input
              type="number"
              {...register('amount', {
                required: 'Loan amount is required',
                min: { value: 1000, message: 'Amount must be at least 1000' },
                max: { value: 1000000, message: 'Amount cannot exceed 1,000,000' },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter amount (e.g., 10000)"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Loan Purpose</label>
            <select
              {...register('purpose', { required: 'Purpose is required' })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.purpose ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
            >
              <option value="">Select a purpose</option>
              <option value="business">Business</option>
              <option value="home">Home Purchase</option>
              <option value="education">Education</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Employment Status</label>
            <select
              {...register('employmentStatus', { required: 'Employment status is required' })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
            >
              <option value="">Select status</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
            {errors.employmentStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentStatus.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Monthly Income</label>
            <input
              type="number"
              {...register('income', {
                required: 'Monthly income is required',
                min: { value: 0, message: 'Income cannot be negative' },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.income ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter monthly income"
            />
            {errors.income && (
              <p className="text-red-500 text-sm mt-1">{errors.income.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Account Holder Name</label>
            <input
              type="text"
              {...register('accountHolderName', {
                required: 'Account holder name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Account holder name must contain only letters and spaces',
                },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter account holder name"
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">{errors.accountHolderName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Bank Name</label>
            <input
              type="text"
              {...register('bankName', {
                required: 'Bank name is required',
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter bank name"
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Account Number</label>
            <input
              type="text"
              {...register('accountNumber', {
                required: 'Account number is required',
                pattern: {
                  value: /^\d{10,20}$/,
                  message: 'Account number must be between 10 and 20 digits',
                },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter account number"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Submit Self-Loan Application
          </button>
        </form>
      </div>

      {/* Normal Loan Section */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Normal Loan Application</h3>
        <p className="text-gray-600 mb-4">
          For a normal loan, please download the loan application form, fill it out, and upload the completed form below along with your details.
        </p>
        <form onSubmit={handleSubmitUpload(onSubmitUpload)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              {...registerUpload('email', {
                required: 'Email is required',
                pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email format' },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                uploadErrors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter email address"
            />
            {uploadErrors.email && (
              <p className="text-red-500 text-sm mt-1">{uploadErrors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              {...registerUpload('firstName', {
                required: 'First name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'First name must contain only letters and spaces',
                },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                uploadErrors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter first name"
            />
            {uploadErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">{uploadErrors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Surname</label>
            <input
              type="text"
              {...registerUpload('surName', {
                required: 'Surname is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Surname must contain only letters and spaces',
                },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                uploadErrors.surName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter surname"
            />
            {uploadErrors.surName && (
              <p className="text-red-500 text-sm mt-1">{uploadErrors.surName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">BVN</label>
            <input
              type="text"
              {...registerUpload('BVN', {
                required: 'BVN is required',
                pattern: { value: /^\d{11}$/, message: 'BVN must be exactly 11 digits' },
              })}
              className={`mt-2 block w-full px-4 py-2 border ${
                uploadErrors.BVN ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
              placeholder="Enter BVN"
            />
            {uploadErrors.BVN && (
              <p className="text-red-500 text-sm mt-1">{uploadErrors.BVN.message}</p>
            )}
          </div>

          {isUploaded ? (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full bg-brandBlue text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition mb-4"
            >
              Download Another Loan Form
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full bg-brandBlue text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition mb-4"
              >
                Download Loan Form
              </button>
              <input
                type="file"
                accept="application/pdf"
                {...registerUpload('file', { required: 'Please upload a PDF file' })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {uploadErrors.file && (
                <p className="text-red-500 text-sm mt-1">{uploadErrors.file.message}</p>
              )}
              <button
                type="submit"
                className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Upload Loan Form
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS User ID

export default Loan;







