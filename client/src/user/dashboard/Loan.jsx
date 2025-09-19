import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import loan from '../../assets/loan.png'
const Loan = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Demo submit action
    console.log('Loan application data:', data);
    toast.success('Loan application submitted!');
    reset();
  };

  return (
    <div className="p-4 w-full min-h-screen bg-white">
      {/* Introduction Section */}
      <div className=" rounded-xl p-6 mb-6">
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

      {/* Loan Application Form */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Apply for a Loan</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <label className="block text-sm font-semibold text-gray-700">Loan Term</label>
            <select
              {...register('term', { required: 'Loan term is required' })}
              className={`mt-2 block w-full px-4 py-2 border ${
                errors.term ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
            >
              <option value="">Select term</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
              <option value="60">60 Months</option>
            </select>
            {errors.term && (
              <p className="text-red-500 text-sm mt-1">{errors.term.message}</p>
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

          <button
            type="submit"
            className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Submit Loan Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loan;













// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import emailjs from '@emailjs/browser'; // Import EmailJS
// import loan from '../../assets/loan.png';

// const Loan = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       // EmailJS parameters
//       const templateParams = {
//         amount: data.amount,
//         purpose: data.purpose,
//         term: data.term,
//         employmentStatus: data.employmentStatus,
//         income: data.income,
//         to_email: 'feezyakinwunmi001@gmail.com', // Recipient email
//       };

//       // Send email using EmailJS
//       await emailjs.send(
//         'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
//         'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
//         templateParams,
//         'YOUR_USER_ID' // Replace with your EmailJS User ID
//       );

//       console.log('Loan application data:', data);
//       toast.success('Loan application submitted and email sent!');
//       reset();
//     } catch (error) {
//       console.error('Error sending email:', error);
//       toast.error('Failed to send loan application. Please try again.');
//     }
//   };

//   return (
//     <div className="p-4 w-full min-h-screen bg-white">
//       {/* Introduction Section */}
//       <div className="rounded-xl p-6 mb-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="lg:w-1/2">
//             <img
//               src={loan}
//               alt="Loan Illustration"
//               className="w-full h-64 object-cover rounded-lg"
//             />
//           </div>
//           <div className="lg:w-1/2">
//             <h2 className="text-2xl font-bold text-brandBlue mb-4">Unlock Your Financial Goals with Our Loans</h2>
//             <p className="text-gray-600 mb-4">
//               Our loans are designed to help you achieve your dreams, whether it’s starting a business, buying a home, or funding education. With competitive interest rates starting at <strong>5% per annum</strong>, we offer flexible terms to suit your needs. Borrow confidently with transparent fees and no hidden charges.
//             </p>
//             <p className="text-gray-600">
//               <strong>Why borrow from us?</strong> We prioritize your financial well-being with quick approvals, personalized support, and repayment plans tailored to your budget. Join thousands of satisfied customers who trust us to fuel their aspirations.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Section */}
//       <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 mb-6">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Why Choose Our Loans?</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <h4 className="text-md font-semibold text-gray-800">Low Interest Rates</h4>
//             <p className="text-sm text-gray-600">
//               Enjoy rates as low as 5% per annum, making borrowing affordable.
//             </p>
//           </div>
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <h4 className="text-md font-semibold text-gray-800">Flexible Terms</h4>
//             <p className="text-sm text-gray-600">
//               Choose repayment terms from 6 months to 5 years to fit your budget.
//             </p>
//           </div>
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <h4 className="text-md font-semibold text-gray-800">Fast Approval</h4>
//             <p className="text-sm text-gray-600">
//               Get your loan approved in as little as 24 hours with our streamlined process.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Loan Application Form */}
//       <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Apply for a Loan</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700">Loan Amount</label>
//             <input
//               type="number"
//               {...register('amount', {
//                 required: 'Loan amount is required',
//                 min: { value: 1000, message: 'Amount must be at least 1000' },
//                 max: { value: 1000000, message: 'Amount cannot exceed 1,000,000' },
//               })}
//               className={`mt-2 block w-full px-4 py-2 border ${
//                 errors.amount ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//               placeholder="Enter amount (e.g., 10000)"
//             />
//             {errors.amount && (
//               <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700">Loan Purpose</label>
//             <select
//               {...register('purpose', { required: 'Purpose is required' })}
//               className={`mt-2 block w-full px-4 py-2 border ${
//                 errors.purpose ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//             >
//               <option value="">Select a purpose</option>
//               <option value="business">Business</option>
//               <option value="home">Home Purchase</option>
//               <option value="education">Education</option>
//               <option value="personal">Personal</option>
//               <option value="other">Other</option>
//             </select>
//             {errors.purpose && (
//               <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700">Loan Term</label>
//             <select
//               {...register('term', { required: 'Loan term is required' })}
//               className={`mt-2 block w-full px-4 py-2 border ${
//                 errors.term ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//             >
//               <option value="">Select term</option>
//               <option value="6">6 Months</option>
//               <option value="12">12 Months</option>
//               <option value="24">24 Months</option>
//               <option value="36">36 Months</option>
//               <option value="60">60 Months</option>
//             </select>
//             {errors.term && (
//               <p className="text-red-500 text-sm mt-1">{errors.term.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700">Employment Status</label>
//             <select
//               {...register('employmentStatus', { required: 'Employment status is required' })}
//               className={`mt-2 block w-full px-4 py-2 border ${
//                 errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//             >
//               <option value="">Select status</option>
//               <option value="employed">Employed</option>
//               <option value="self-employed">Self-Employed</option>
//               <option value="unemployed">Unemployed</option>
//             </select>
//             {errors.employmentStatus && (
//               <p className="text-red-500 text-sm mt-1">{errors.employmentStatus.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700">Monthly Income</label>
//             <input
//               type="number"
//               {...register('income', {
//                 required: 'Monthly income is required',
//                 min: { value: 0, message: 'Income cannot be negative' },
//               })}
//               className={`mt-2 block w-full px-4 py-2 border ${
//                 errors.income ? 'border-red-500' : 'border-gray-300'
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//               placeholder="Enter monthly income"
//             />
//             {errors.income && (
//               <p className="text-red-500 text-sm mt-1">{errors.income.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
//           >
//             Submit Loan Application
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Initialize EmailJS with your User ID
// emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS User ID

// export default Loan;