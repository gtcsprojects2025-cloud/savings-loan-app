import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './register.css';
import gtcslogo from '../../assets/gtcslogo.png';
import check from '../../assets/check.png';

function Register() {
  const [formData, setFormData] = useState({
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
    guarantor1: '',
    guarantor1MobileCountry: '+234',
    guarantor1Mobile: '',
    guarantor2: '',
    guarantor2MobileCountry: '+234',
    guarantor2Mobile: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showButtonWarning, setShowButtonWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const countryCodes = [
    { code: '+234', name: 'Nigeria (+234)' },
    { code: '+1', name: 'USA (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+91', name: 'India (+91)' },
  ];

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        console.log('Modal timer complete, showing success');
        setShowModal(false);
        // redirect to /#
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = ['primaryPhone', 'otherPhone', 'referenceMobile', 'guarantor1Mobile', 'guarantor2Mobile'].includes(name)
      ? value.replace(/\D/g, '')
      : value;
    setFormData({ ...formData, [name]: cleanedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (['nin', 'bvn'].includes(name) && value.trim()) {
      if (!/^\d{11}$/.test(value)) {
        newErrors[name] = 'Must be exactly 11 digits';
      }
    }
    if (name === 'email' && value.trim()) {
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
        newErrors.email = 'Invalid email format';
      }
    }
    if (['primaryPhone', 'guarantor1Mobile'].includes(name) && value.trim()) {
      if (!/^\d{10,15}$/.test(value)) {
        newErrors[name] = 'Must be 10–15 digits';
      }
    }
    if (['otherPhone', 'referenceMobile', 'guarantor2Mobile'].includes(name) && value.trim()) {
      if (!/^\d{10,15}$/.test(value)) {
        newErrors[name] = 'Must be 10–15 digits';
      }
    }
    if (name === 'password' && value.trim()) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(value)) {
        newErrors.password = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character';
      }
    }
    if (name === 'confirmPassword' && value.trim()) {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};
    const step1RequiredFields = [
      'title', 'lastName', 'firstName', 'dob', 'email', 'password', 'confirmPassword'
    ];
    const step2RequiredFields = ['primaryPhone', 'nin', 'bvn', 'residentialAddress', 'residentialState'];
    const step3RequiredFields = ['guarantor1', 'guarantor1Mobile'];

    const fieldsToValidate = step === 1 ? step1RequiredFields : (step === 2 ? step2RequiredFields : step3RequiredFields);

    fieldsToValidate.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = 'Please fill this field';
      } else {
        if (field === 'nin' && !/^\d{11}$/.test(formData.nin)) {
          newErrors.nin = 'Must be exactly 11 digits';
        }
        if (field === 'bvn' && !/^\d{11}$/.test(formData.bvn)) {
          newErrors.bvn = 'Must be exactly 11 digits';
        }
        if (field === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (field === 'primaryPhone' && !/^\d{10,15}$/.test(formData.primaryPhone)) {
          newErrors.primaryPhone = 'Must be 10–15 digits';
        }
        if (field === 'guarantor1Mobile' && !/^\d{10,15}$/.test(formData.guarantor1Mobile)) {
          newErrors.guarantor1Mobile = 'Must be 10–15 digits';
        }
        if (field === 'password' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(formData.password)) {
          newErrors.password = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character';
        }
        if (field === 'confirmPassword' && formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    });

    if (formData.otherPhone.trim() && !/^\d{10,15}$/.test(formData.otherPhone)) {
      newErrors.otherPhone = 'Must be 10–15 digits';
    }
    if (formData.referenceMobile.trim() && !/^\d{10,15}$/.test(formData.referenceMobile)) {
      newErrors.referenceMobile = 'Must be 10–15 digits';
    }
    if (formData.guarantor2Mobile.trim() && !/^\d{10,15}$/.test(formData.guarantor2Mobile)) {
      newErrors.guarantor2Mobile = 'Must be 10–15 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (step) => {
    const step1RequiredFields = [
    'title', 'lastName', 'firstName', 'dob', 'email', 'password', 'confirmPassword'
    ];
    const step2RequiredFields = ['primaryPhone', 'nin', 'bvn', 'residentialAddress', 'residentialState'];
    const step3RequiredFields = ['guarantor1', 'guarantor1Mobile'];

    const fields = step === 1 ? step1RequiredFields : (step === 2 ? step2RequiredFields : step3RequiredFields);
    const isValid = fields.every((field) => {
      if (!formData[field].trim()) {
        console.log(`Field ${field} is empty`);
        return false;
      }
      if (field === 'nin' && !/^\d{11}$/.test(formData.nin)) {
        console.log(`Field ${field} invalid: ${formData.nin}`);
        return false;
      }
      if (field === 'bvn' && !/^\d{11}$/.test(formData.bvn)) {
        console.log(`Field ${field} invalid: ${formData.bvn}`);
        return false;
      }
      if (field === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
        console.log(`Field ${field} invalid: ${formData.email}`);
        return false;
      }
      if (field === 'primaryPhone' && !/^\d{10,15}$/.test(formData.primaryPhone)) {
        console.log(`Field ${field} invalid: ${formData.primaryPhone}`);
        return false;
      }
      if (field === 'guarantor1Mobile' && !/^\d{10,15}$/.test(formData.guarantor1Mobile)) {
        console.log(`Field ${field} invalid: ${formData.guarantor1Mobile}`);
        return false;
      }
      if (field === 'password' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(formData.password)) {
        console.log(`Field ${field} invalid: Password does not meet requirements`);
        return false;
      }
      if (field === 'confirmPassword' && formData.confirmPassword !== formData.password) {
        console.log(`Field ${field} invalid: Passwords do not match`);
        return false;
      }
      return true;
    });
    console.log(`isStepValid(${step}): ${isValid}, formData:`, formData);
    return isValid;
  };

  const handleButtonInteraction = (e, step) => {
    e.preventDefault();
    if (!isStepValid(step)) {
      setShowButtonWarning(true);
      validateStep(step);
    } else if (step === 1) {
      setCurrentStep(2);
      setShowButtonWarning(false);
    } else if (step === 2) {
      setCurrentStep(3);
      setShowButtonWarning(false);
    } else {
      const dateJoined = format(new Date(), 'yyyy-MM-dd');
      const submittedData = {
        ...formData,
        primaryPhone: `${formData.primaryPhoneCountry}${formData.primaryPhone}`,
        otherPhone: formData.otherPhone ? `${formData.otherPhoneCountry}${formData.otherPhone}` : '',
        referenceMobile: formData.referenceMobile ? `${formData.referenceMobileCountry}${formData.referenceMobile}` : '',
        guarantor1Mobile: `${formData.guarantor1MobileCountry}${formData.guarantor1Mobile}`,
        guarantor2Mobile: formData.guarantor2Mobile ? `${formData.guarantor2MobileCountry}${formData.guarantor2Mobile}` : '',
        dateJoined
      };
      console.log('Form submitted:', submittedData);
      setShowModal(true);
    }
  };



  return (
    <div className="Register-container">
      <div className="form-card">
        <img src={gtcslogo} alt="GTCS Logo" className="form-logo" />
        <h1 className="form-title">
          GTCS Registration Form - <span className='form-step'>(Step {currentStep})</span> 
        </h1>

        {currentStep === 1 && (
          <form onSubmit={(e) => handleButtonInteraction(e, 1)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title  <span className='form-step'>*</span></label>
                <select name="title" value={formData.title} onChange={handleChange} required
                  className="form-select">
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Other">Other</option>
                </select>
                {(showButtonWarning || errors.title) && errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name  <span className='form-step'>*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.lastName) && errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">First Name  <span className='form-step'>*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.firstName) && errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Other Name</label>
                <input type="text" name="otherName" value={formData.otherName} onChange={handleChange} onBlur={handleBlur}
                  className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth  <span className='form-step'>*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.dob) && errors.dob && <span className="form-error">{errors.dob}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address  <span className='form-step'>*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.email) && errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password  <span className='form-step'>*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.password) && errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password  <span className='form-step'>*</span></label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.confirmPassword) && errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isStepValid(1)}
              className={`form-button full-width ${isStepValid(1) ? 'enabled' : 'disabled'}`}
              onClick={() => !isStepValid(1) && setShowButtonWarning(true)}
              onMouseLeave={() => setShowButtonWarning(false)}
            >
              Next
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={(e) => handleButtonInteraction(e, 2)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Primary Phone Number  <span className='form-step'>*</span></label>
                <div className="phone-group">
                  <select name="primaryPhoneCountry" value={formData.primaryPhoneCountry} onChange={handleChange}
                    className="form-select country-code">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <input type="tel" name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} onBlur={handleBlur} required
                    className="form-input phone-input" />
                </div>
                {(showButtonWarning || errors.primaryPhone) && errors.primaryPhone && <span className="form-error">{errors.primaryPhone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Other Phone</label>
                <div className="phone-group">
                  <select name="otherPhoneCountry" value={formData.otherPhoneCountry} onChange={handleChange}
                    className="form-select country-code">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <input type="tel" name="otherPhone" value={formData.otherPhone} onChange={handleChange} onBlur={handleBlur}
                    className="form-input phone-input" />
                </div>
                {(showButtonWarning || errors.otherPhone) && errors.otherPhone && <span className="form-error">{errors.otherPhone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">NIN  <span className='form-step'>*</span></label>
                <input type="text" name="nin" value={formData.nin} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.nin) && errors.nin && <span className="form-error">{errors.nin}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">BVN  <span className='form-step'>*</span></label>
                <input type="text" name="bvn" value={formData.bvn} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.bvn) && errors.bvn && <span className="form-error">{errors.bvn}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Residential Address  <span className='form-step'>*</span></label>
                <textarea name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.residentialAddress) && errors.residentialAddress && <span className="form-error">{errors.residentialAddress}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Residential State  <span className='form-step'>*</span></label>
                <input type="text" name="residentialState" value={formData.residentialState} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.residentialState) && errors.residentialState && <span className="form-error">{errors.residentialState}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Office Address</label>
                <textarea name="officeAddress" value={formData.officeAddress} onChange={handleChange} onBlur={handleBlur}
                  className="form-input" />
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
                disabled={!isStepValid(2)}
                className={`form-button ${isStepValid(2) ? 'enabled' : 'disabled'}`}
                onClick={() => !isStepValid(2) && setShowButtonWarning(true)}
                onMouseLeave={() => setShowButtonWarning(false)}
              >
                Next
              </button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={(e) => handleButtonInteraction(e, 3)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Reference Name</label>
                <input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} onBlur={handleBlur}
                  className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Reference Mobile</label>
                <div className="phone-group">
                  <select name="referenceMobileCountry" value={formData.referenceMobileCountry} onChange={handleChange}
                    className="form-select country-code">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <input type="tel" name="referenceMobile" value={formData.referenceMobile} onChange={handleChange} onBlur={handleBlur}
                    className="form-input phone-input" />
                </div>
                {(showButtonWarning || errors.referenceMobile) && errors.referenceMobile && <span className="form-error">{errors.referenceMobile}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Product</label>
                <input type="text" name="product" value={formData.product} onChange={handleChange} onBlur={handleBlur}
                  className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Guarantor 1  <span className='form-step'>*</span></label>
                <input type="text" name="guarantor1" value={formData.guarantor1} onChange={handleChange} onBlur={handleBlur} required
                  className="form-input" />
                {(showButtonWarning || errors.guarantor1) && errors.guarantor1 && <span className="form-error">{errors.guarantor1}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Guarantor 1 Mobile  <span className='form-step'>*</span></label>
                <div className="phone-group">
                  <select name="guarantor1MobileCountry" value={formData.guarantor1MobileCountry} onChange={handleChange}
                    className="form-select country-code">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <input type="tel" name="guarantor1Mobile" value={formData.guarantor1Mobile} onChange={handleChange} onBlur={handleBlur} required
                    className="form-input phone-input" />
                </div>
                {(showButtonWarning || errors.guarantor1Mobile) && errors.guarantor1Mobile && <span className="form-error">{errors.guarantor1Mobile}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Loan Guarantor 2</label>
                <input type="text" name="guarantor2" value={formData.guarantor2} onChange={handleChange} onBlur={handleBlur}
                  className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Guarantor 2 Mobile</label>
                <div className="phone-group">
                  <select name="guarantor2MobileCountry" value={formData.guarantor2MobileCountry} onChange={handleChange}
                    className="form-select country-code">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <input type="tel" name="guarantor2Mobile" value={formData.guarantor2Mobile} onChange={handleChange} onBlur={handleBlur}
                    className="form-input phone-input" />
                </div>
                {(showButtonWarning || errors.guarantor2Mobile) && errors.guarantor2Mobile && <span className="form-error">{errors.guarantor2Mobile}</span>}
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
                disabled={!isStepValid(3)}
                className={`form-button ${isStepValid(3) ? 'enabled' : 'disabled'}`}
                onClick={() => !isStepValid(3) && setShowButtonWarning(true)}
                onMouseLeave={() => setShowButtonWarning(false)}
              >
                Submit
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
      </div>
    </div>
  );
}

export default Register;