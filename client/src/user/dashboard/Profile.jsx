// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: JSON.parse(localStorage.getItem('user')) || {
//       title: 'Mr',
//       firstName: 'John',
//       lastName: 'Doe',
//       otherNames: 'Middle',
//       DOB: '1990-01-01',
//       email: 'john.doe@example.com',
//       phoneNo: '+2341234567890',
//       NIN: '12345678901',
//       BVN: '98765432101',
//       residentialAddress: '123 Main St',
//       residentialState: 'Lagos',
//       guarantorName: 'Jane Smith',
//       guarantorPhone: '+2349876543210',
//     },
//   });

//   const maskSensitive = (value) => {
//     if (!value) return '***';
//     return `${value.slice(0, 2)}******${value.slice(-1)}`;
//   };

//   const onSubmit = (data) => {
//     console.log('Updated profile data:', data);
//     localStorage.setItem('user', JSON.stringify(data));
//     toast.success('Profile updated! (Demo)');
//     setIsEditing(false);
//     reset(data);
//   };

//   const user = JSON.parse(localStorage.getItem('user')) || {
//     title: 'Mr',
//     firstName: 'John',
//     lastName: 'Doe',
//     otherNames: 'Middle',
//     DOB: '1990-01-01',
//     email: 'john.doe@example.com',
//     phoneNo: '+2341234567890',
//     NIN: '12345678901',
//     BVN: '98765432101',
//     residentialAddress: '123 Main St',
//     residentialState: 'Lagos',
//     guarantorName: 'Jane Smith',
//     guarantorPhone: '+2349876543210',
//   };

//   return (
//     <div className="p-4 w-full min-h-screen bg-white">
//       <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-700">User Profile</h3>
//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="px-4 py-2 bg-brandOrange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
//           >
//             {isEditing ? 'Cancel' : 'Edit Profile'}
//           </button>
//         </div>

//         {isEditing ? (
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Title</label>
//                 <select
//                   {...register('title', { required: 'Title is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.title ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 >
//                   <option value="">Select title</option>
//                   <option value="Mr">Mr</option>
//                   <option value="Mrs">Mrs</option>
//                   <option value="Miss">Miss</option>
//                   <option value="Dr">Dr</option>
//                 </select>
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">First Name</label>
//                 <input
//                   type="text"
//                   {...register('firstName', { required: 'First name is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.firstName ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.firstName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Last Name</label>
//                 <input
//                   type="text"
//                   {...register('lastName', { required: 'Last name is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.lastName ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.lastName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Other Names</label>
//                 <input
//                   type="text"
//                   {...register('otherNames')}
//                   className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
//                 <input
//                   type="date"
//                   {...register('DOB', { required: 'Date of birth is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.DOB ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.DOB && (
//                   <p className="text-red-500 text-sm mt-1">{errors.DOB.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   {...register('email', { required: 'Email is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
//                 <input
//                   type="text"
//                   {...register('phoneNo', { required: 'Phone number is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.phoneNo ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.phoneNo && (
//                   <p className="text-red-500 text-sm mt-1">{errors.phoneNo.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">NIN</label>
//                 <input
//                   type="text"
//                   {...register('NIN', { required: 'NIN is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.NIN ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.NIN && (
//                   <p className="text-red-500 text-sm mt-1">{errors.NIN.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">BVN</label>
//                 <input
//                   type="text"
//                   {...register('BVN', { required: 'BVN is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.BVN ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.BVN && (
//                   <p className="text-red-500 text-sm mt-1">{errors.BVN.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Residential Address</label>
//                 <input
//                   type="text"
//                   {...register('residentialAddress', { required: 'Address is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.residentialAddress && (
//                   <p className="text-red-500 text-sm mt-1">{errors.residentialAddress.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Residential State</label>
//                 <input
//                   type="text"
//                   {...register('residentialState', { required: 'State is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.residentialState ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.residentialState && (
//                   <p className="text-red-500 text-sm mt-1">{errors.residentialState.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Guarantor Name</label>
//                 <input
//                   type="text"
//                   {...register('guarantorName', { required: 'Guarantor name is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.guarantorName ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.guarantorName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.guarantorName.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">Guarantor Phone</label>
//                 <input
//                   type="text"
//                   {...register('guarantorPhone', { required: 'Guarantor phone is required' })}
//                   className={`mt-2 block w-full px-4 py-2 border ${
//                     errors.guarantorPhone ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
//                 />
//                 {errors.guarantorPhone && (
//                   <p className="text-red-500 text-sm mt-1">{errors.guarantorPhone.message}</p>
//                 )}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition mt-4"
//             >
//               Save Changes
//             </button>
//           </form>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className='flex flex-col gap-9' >
//               <p><strong>Title:</strong> <br/>{user.title}</p>
//               <p><strong>First Name:</strong> <br/> {user.firstName}</p>
//               <p><strong>Last Name:</strong> <br/>{user.lastName}</p>
//               <p><strong>Other Names:</strong> <br/>{user.otherNames || 'N/A'}</p>
//               <p><strong>Date of Birth:</strong><br/> {user.DOB}</p>
//               <p><strong>Email:</strong> <br/> {user.email}</p>
//             </div>
//             <div className='flex flex-col gap-9' >
//               <p><strong>Phone Number:</strong> <br/>{user.phoneNo}</p>
//               <p><strong>NIN:</strong><br/> {maskSensitive(user.NIN)}</p>
//               <p><strong>BVN:</strong><br/> {maskSensitive(user.BVN)}</p>
//               <p><strong>Residential Address:</strong><br/> {user.residentialAddress}</p>
//               <p><strong>Residential State:</strong><br/> {user.residentialState}</p>
//               <p><strong>Guarantor Name:</strong><br/> {user.guarantorName}</p>
//               <p><strong>Guarantor Phone:</strong> <br/>{user.guarantorPhone}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;




import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Utility function for retrying fetch (copied from Dashboard.jsx for independence)
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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email') || 'rolandmario2@gmail.com';
  const userToken = localStorage.getItem('userToken') || 'demo-token';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      otherNames: '',
      DOB: '1990-01-01',
      email: 'john.doe@example.com',
      phoneNo: '',
      NIN: '',
      BVN: '',
      residentialAddress: '',
      residentialState: '',
      guarantorName: '',
      guarantorPhone: '',
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithRetry(
          `https://savings-loan-app.vercel.app/api/get-user?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${userToken}`, // Uncomment if required
            },
          }
        );
        const result = await response.json();
        console.log('Profile API response:', JSON.stringify(result, null, 2));
        if (response.ok && result.userExist) {
          const userData = {
            title: result.userExist.title || 'Mr',
            firstName: result.userExist.firstName || 'John',
            lastName: result.userExist.lastName || 'Doe',
            otherNames: result.userExist.otherNames || '',
            DOB: result.userExist.DOB || '1990-01-01',
            email: result.userExist.email || email,
            phoneNo: result.userExist.phoneNo || '',
            NIN: result.userExist.NIN || '',
            BVN: result.userExist.BVN || '',
            residentialAddress: result.userExist.residentialAddress || '',
            residentialState: result.userExist.residentialState || '',
            guarantorName: result.userExist.guarantorName || '',
            guarantorPhone: result.userExist.guarantorPhone || '',
          };
          reset(userData); // Update form with fetched data
          localStorage.setItem('user', JSON.stringify(userData)); // Sync localStorage
        } else {
          throw new Error(result.message || `Failed to fetch user data (Status: ${response.status})`);
        }
      } catch (err) {
        console.error('Profile fetch error:', err.message);
        setError(`Failed to load profile: ${err.message}`);
        // Keep default form values (already set)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, reset]);

  const maskSensitive = (value) => {
    if (!value) return '***';
    return `${value.slice(0, 2)}******${value.slice(-1)}`;
  };

  const onSubmit = (data) => {
    console.log('Updated profile data:', data);
    localStorage.setItem('user', JSON.stringify(data));
    toast.success('Profile updated! (Demo)');
    setIsEditing(false);
    reset(data);
  };

  const user = JSON.parse(localStorage.getItem('user')) || {
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    otherNames: '',
    DOB: '1990-01-01',
    email: 'john.doe@example.com',
    phoneNo: '',
    NIN: '',
    BVN: '',
    residentialAddress: '',
    residentialState: '',
    guarantorName: '',
    guarantorPhone: '',
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">User Profile</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-brandOrange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Title</label>
                <select
                  {...register('title', { required: 'Title is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                >
                  <option value="">Select title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                </select>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Other Names</label>
                <input
                  type="text"
                  {...register('otherNames')}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  {...register('DOB', { required: 'Date of birth is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.DOB ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.DOB && (
                  <p className="text-red-500 text-sm mt-1">{errors.DOB.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  type="text"
                  {...register('phoneNo', { required: 'Phone number is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.phoneNo ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.phoneNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">NIN</label>
                <input
                  type="text"
                  {...register('NIN', { required: 'NIN is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.NIN ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.NIN && (
                  <p className="text-red-500 text-sm mt-1">{errors.NIN.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">BVN</label>
                <input
                  type="text"
                  {...register('BVN', { required: 'BVN is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.BVN ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.BVN && (
                  <p className="text-red-500 text-sm mt-1">{errors.BVN.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Residential Address</label>
                <input
                  type="text"
                  {...register('residentialAddress', { required: 'Address is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.residentialAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.residentialAddress.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Residential State</label>
                <input
                  type="text"
                  {...register('residentialState', { required: 'State is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.residentialState ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.residentialState && (
                  <p className="text-red-500 text-sm mt-1">{errors.residentialState.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Guarantor Name</label>
                <input
                  type="text"
                  {...register('guarantorName', { required: 'Guarantor name is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.guarantorName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.guarantorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.guarantorName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Guarantor Phone</label>
                <input
                  type="text"
                  {...register('guarantorPhone', { required: 'Guarantor phone is required' })}
                  className={`mt-2 block w-full px-4 py-2 border ${
                    errors.guarantorPhone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue`}
                />
                {errors.guarantorPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.guarantorPhone.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-brandOrange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition mt-4"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-9">
              <p>
                <strong>Title:</strong> <br />
                {user.title}
              </p>
              <p>
                <strong>First Name:</strong> <br />
                {user.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> <br />
                {user.lastName}
              </p>
              <p>
                <strong>Other Names:</strong> <br />
                {user.otherNames || 'N/A'}
              </p>
              <p>
                <strong>Date of Birth:</strong> <br />
                {user.DOB}
              </p>
              <p>
                <strong>Email:</strong> <br />
                {user.email}
              </p>
            </div>
            <div className="flex flex-col gap-9">
              <p>
                <strong>Phone Number:</strong> <br />
                {user.phoneNo || 'N/A'}
              </p>
              <p>
                <strong>NIN:</strong> <br />
                {maskSensitive(user.NIN)}
              </p>
              <p>
                <strong>BVN:</strong> <br />
                {maskSensitive(user.BVN)}
              </p>
              <p>
                <strong>Residential Address:</strong> <br />
                {user.residentialAddress || 'N/A'}
              </p>
              <p>
                <strong>Residential State:</strong> <br />
                {user.residentialState || 'N/A'}
              </p>
              <p>
                <strong>Guarantor Name:</strong> <br />
                {user.guarantorName || 'N/A'}
              </p>
              <p>
                <strong>Guarantor Phone:</strong> <br />
                {user.guarantorPhone || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;