import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SHA256 from 'crypto-js/sha256';
import './register.css';
import gtcslogo from '../../assets/gtcslogo.png';
import check from '../../assets/check.png';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      lastName: '',
      firstName: '',
      otherName: '',
      dob: '',
      primaryPhoneCountry: '+234',
      primaryPhone: '',
      otherPhoneCountry: '+234',
      otherPhone: '',
      nin: '',
      bvn: '',
      residentialAddress: '',
      residentialState: '',
      officeAddress: '',
      email: '',
      password: '',
      confirmPassword: '',
      referenceName: '',
      referenceMobileCountry: '+234',
      referenceMobile: '',
      product: '',
      nextOfKin: '',
      nextOfKinMobileCountry: '+234',
      nextOfKinMobile: '',
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showButtonWarning, setShowButtonWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countryCodes = [
    { code: '+234', name: 'Nigeria (+234)' },
    { code: '+1', name: 'USA (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+91', name: 'India (+91)' },
  ];

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const password = watch('password');

  const handlePhoneChange = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue(fieldName, value);
  };

  const validateStep = (data, step) => {
    const step1RequiredFields = ['title', 'lastName', 'firstName', 'dob', 'email', 'password', 'confirmPassword'];
    const step2RequiredFields = ['primaryPhone', 'nin', 'bvn', 'residentialAddress', 'residentialState'];
    const step3RequiredFields = ['nextOfKin', 'nextOfKinMobile'];

    const fieldsToValidate = step === 1 ? step1RequiredFields : step === 2 ? step2RequiredFields : step3RequiredFields;
    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      if (!data[field]?.trim()) {
        newErrors[field] = 'Please fill this field';
      }
    });

    if (step === 1) {
      if (data.email && !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (data.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(data.password)) {
        newErrors.password = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character';
      }
      if (data.confirmPassword && data.confirmPassword !== data.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    if (step === 2) {
      if (data.nin && !/^\d{11}$/.test(data.nin)) {
        newErrors.nin = 'Must be exactly 11 digits';
      }
      if (data.bvn && !/^\d{11}$/.test(data.bvn)) {
        newErrors.bvn = 'Must be exactly 11 digits';
      }
      if (data.primaryPhone && !/^\d{10,15}$/.test(data.primaryPhone)) {
        newErrors.primaryPhone = 'Must be 10–15 digits';
      }
    }
    if (step === 3) {
      if (data.nextOfKinMobile && !/^\d{10,15}$/.test(data.nextOfKinMobile)) {
        newErrors.nextOfKinMobile = 'Must be 10–15 digits';
      }
    }
    if (data.otherPhone?.trim() && !/^\d{10,15}$/.test(data.otherPhone)) {
      newErrors.otherPhone = 'Must be 10–15 digits';
    }
    if (data.referenceMobile?.trim() && !/^\d{10,15}$/.test(data.referenceMobile)) {
      newErrors.referenceMobile = 'Must be 10–15 digits';
    }

    return newErrors;
  };

  const isStepValid = (data, step) => {
    const errors = validateStep(data, step);
    console.log(`isStepValid(${step}): ${Object.keys(errors).length === 0}, errors:`, errors, 'formData:', data);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (data, step) => {
    const errors = validateStep(data, step);
    if (Object.keys(errors).length > 0) {
      setShowButtonWarning(true);
      return;
    }

    if (step === 1) {
      setCurrentStep(2);
      setShowButtonWarning(false);
    } else if (step === 2) {
      setCurrentStep(3);
      setShowButtonWarning(false);
    } else {
      setLoading(true);
      try {
        const hashedPassword = SHA256(data.password).toString();
        console.log('Hashed password:', hashedPassword);

        const formPayload = {
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          otherNames: data.otherName,
          DOB: data.dob,
          email: data.email,
          password: hashedPassword,
          phoneNo: `${data.primaryPhoneCountry}${data.primaryPhone}`,
          PhoneNo2: data.otherPhone ? `${data.otherPhoneCountry}${data.otherPhone}` : '',
          NIN: data.nin,
          BVN: data.bvn,
          residentialAddress: data.residentialAddress,
          residentialState: data.residentialState,
          officeAddress: data.officeAddress,
          referenceName: data.referenceName,
          referencePhoneNo: data.referenceMobile ? `${data.referenceMobileCountry}${data.referenceMobile}` : '',
          nextOfKin: data.nextOfKin,
          nextOfKinPhone: `${data.nextOfKinMobileCountry}${data.nextOfKinMobile}`,
          product: data.product,
        };
        console.log('Submitting form data:', formPayload);

        const response = await fetch('https://admin.gtcooperative.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formPayload),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('Registration successful!');
          console.log('Registration response:', result);
          setShowModal(true);
        } else {
          toast.error(result.message || 'Registration failed. Please try again.');
          console.error('Registration failed:', result.message);
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="Register-container">
      <div className="form-card">
        <div className="form-header">
          <button onClick={() => (window.location.href = '/')} className="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#eb7425]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
        <img src={gtcslogo} alt="GTCS Logo" className="form-logo" />
        <h1 className="form-title text-brandBlue">
          GTCS Registration Form - <span className="form-step">(Step {currentStep})</span>
        </h1>
        {loading && <div className="form-info">Submitting form, please wait...</div>}

        {currentStep === 1 && (
          <form onSubmit={handleSubmit((data) => onSubmit(data, 1))} className="space-y-5">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Title <span className="form-step">*</span>
                </label>
                <select
                  {...register('title', { required: 'Please select a title' })}
                  className="form-select"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Other">Other</option>
                </select>
                {(showButtonWarning || formErrors.title) && (
                  <span className="form-error">{formErrors.title?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.lastName) && (
                  <span className="form-error">{formErrors.lastName?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  First Name <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.firstName) && (
                  <span className="form-error">{formErrors.firstName?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Other Name</label>
                <input type="text" {...register('otherName')} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date of Birth <span className="form-step">*</span>
                </label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of birth is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.dob) && (
                  <span className="form-error">{formErrors.dob?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="form-step">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email format' },
                  })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.email) && (
                  <span className="form-error">{formErrors.email?.message}</span>
                )}
              </div>

              <div className="form-group relative">
                <label className="form-label">
                  Password <span className="form-step">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
                      message:
                        'Password must be at least 8 characters, with uppercase, lowercase, number, and special character',
                    },
                  })}
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-brandBlue hover:text-brandBlue/80"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {(showButtonWarning || formErrors.password) && (
                  <span className="form-error">{formErrors.password?.message}</span>
                )}
              </div>

              <div className="form-group relative">
                <label className="form-label">
                  Confirm Password <span className="form-step">*</span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-brandBlue hover:text-brandBlue/80"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {(showButtonWarning || formErrors.confirmPassword) && (
                  <span className="form-error">{formErrors.confirmPassword?.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isStepValid(watch(), 1)}
              className={`form-button full-width ${isStepValid(watch(), 1) && !loading ? 'enabled' : 'disabled'}`}
            >
              Next
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmit((data) => onSubmit(data, 2))} className="space-y-5">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Primary Phone Number <span className="form-step">*</span>
                </label>
                <div className="phone-group">
                  <select
                    {...register('primaryPhoneCountry')}
                    className="form-select country-code"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    {...register('primaryPhone', {
                      required: 'Primary phone is required',
                      pattern: { value: /^\d{10,15}$/, message: 'Must be 10–15 digits' },
                    })}
                    onChange={(e) => handlePhoneChange(e, 'primaryPhone')}
                    className="form-input phone-input"
                  />
                </div>
                {(showButtonWarning || formErrors.primaryPhone) && (
                  <span className="form-error">{formErrors.primaryPhone?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Other Phone</label>
                <div className="phone-group">
                  <select
                    {...register('otherPhoneCountry')}
                    className="form-select country-code"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    {...register('otherPhone', {
                      pattern: { value: /^\d{10,15}$/, message: 'Must be 10–15 digits' },
                    })}
                    onChange={(e) => handlePhoneChange(e, 'otherPhone')}
                    className="form-input phone-input"
                  />
                </div>
                {(showButtonWarning || formErrors.otherPhone) && (
                  <span className="form-error">{formErrors.otherPhone?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  NIN <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('nin', {
                    required: 'NIN is required',
                    pattern: { value: /^\d{11}$/, message: 'Must be exactly 11 digits' },
                  })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.nin) && (
                  <span className="form-error">{formErrors.nin?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  BVN <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('bvn', {
                    required: 'BVN is required',
                    pattern: { value: /^\d{11}$/, message: 'Must be exactly 11 digits' },
                  })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.bvn) && (
                  <span className="form-error">{formErrors.bvn?.message}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Residential Address <span className="form-step">*</span>
                </label>
                <textarea
                  {...register('residentialAddress', { required: 'Residential address is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.residentialAddress) && (
                  <span className="form-error">{formErrors.residentialAddress?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Residential State <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('residentialState', { required: 'Residential state is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.residentialState) && (
                  <span className="form-error">{formErrors.residentialState?.message}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Office Address</label>
                <textarea {...register('officeAddress')} className="form-input" />
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="form-button enabled"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !isStepValid(watch(), 2)}
                className={`form-button ${isStepValid(watch(), 2) && !loading ? 'enabled' : 'disabled'}`}
              >
                Next
              </button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleSubmit((data) => onSubmit(data, 3))} className="space-y-5">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Reference Name</label>
                <input type="text" {...register('referenceName')} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Reference Mobile</label>
                <div className="phone-group">
                  <select
                    {...register('referenceMobileCountry')}
                    className="form-select country-code"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    {...register('referenceMobile', {
                      pattern: { value: /^\d{10,15}$/, message: 'Must be 10–15 digits' },
                    })}
                    onChange={(e) => handlePhoneChange(e, 'referenceMobile')}
                    className="form-input phone-input"
                  />
                </div>
                {(showButtonWarning || formErrors.referenceMobile) && (
                  <span className="form-error">{formErrors.referenceMobile?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Product</label>
                <input type="text" {...register('product')} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Next of Kin Name <span className="form-step">*</span>
                </label>
                <input
                  type="text"
                  {...register('nextOfKin', { required: 'Next of kin name is required' })}
                  className="form-input"
                />
                {(showButtonWarning || formErrors.nextOfKin) && (
                  <span className="form-error">{formErrors.nextOfKin?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Next of Kin Mobile <span className="form-step">*</span>
                </label>
                <div className="phone-group">
                  <select
                    {...register('nextOfKinMobileCountry')}
                    className="form-select country-code"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    {...register('nextOfKinMobile', {
                      required: 'Next of kin mobile is required',
                      pattern: { value: /^\d{10,15}$/, message: 'Must be 10–15 digits' },
                    })}
                    onChange={(e) => handlePhoneChange(e, 'nextOfKinMobile')}
                    className="form-input phone-input"
                  />
                </div>
                {(showButtonWarning || formErrors.nextOfKinMobile) && (
                  <span className="form-error">{formErrors.nextOfKinMobile?.message}</span>
                )}
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="form-button enabled"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !isStepValid(watch(), 3)}
                className={`form-button ${isStepValid(watch(), 3) && !loading ? 'enabled' : 'disabled'}`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="checkmark">
                <img src={check} alt="Checkmark" className="checkmark" />
                <svg viewBox="0 0 52 52" className="checkmark-circle">
                  <circle cx="26" cy="26" r="25" fill="none" />
                  <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <p className="modal-message">Form submitted successfully!</p>
            </div>
          </div>
        )}
        <div className="mt-6 text-sm text-center text-gray-600 space-y-2">
          <p>
            Already have an account?{' '}
            <Link to="/Auth/login/" className="text-brandBlue font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;