import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SHA256 from 'crypto-js/sha256';

const GTCSLogo = ({ className }) => (
    <div className={className}>
        <div className="text-orange-700 text-3xl font-normal">GTCS</div>
    </div>
);

const Checkmark = ({ className }) => (
    <svg className={className} viewBox="0 0 52 52">
        <circle className="checkmark-circle stroke-orange-600 stroke-4 fill-none" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark-check fill-none stroke-orange-600 stroke-4 stroke-linecap-round stroke-linejoin-round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
);

function UserRegistration() {
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        watch,
        setValue,
        reset,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            lastName: '',
            firstName: '',
            otherNames: '',
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
                reset();
                setCurrentStep(1);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal, reset, setCurrentStep]);

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
            if (data.password && data.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters long';
            }
            if (data.confirmPassword && data.confirmPassword !== data.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        if (step === 2) {
            if (data.nin && !/^\d{11}$/.test(data.nin)) {
                newErrors.nin = 'Invalid NIN: Must be exactly 11 digits';
            }
            if (data.bvn && !/^\d{11}$/.test(data.bvn)) {
                newErrors.bvn = 'Invalid BVN: Must be exactly 11 digits';
            }
            if (data.primaryPhone && !/^\d{10,15}$/.test(data.primaryPhone)) {
                newErrors.primaryPhone = 'Invalid phone number: Must be 10–15 digits';
            }
        }
        if (step === 3) {
            if (data.nextOfKinMobile && !/^\d{10,15}$/.test(data.nextOfKinMobile)) {
                newErrors.nextOfKinMobile = 'Invalid mobile number: Must be 10–15 digits';
            }
        }
        if (data.otherPhone?.trim() && !/^\d{10,15}$/.test(data.otherPhone)) {
            newErrors.otherPhone = 'Invalid phone number: Must be 10–15 digits';
        }
        if (data.referenceMobile?.trim() && !/^\d{10,15}$/.test(data.referenceMobile)) {
            newErrors.referenceMobile = 'Invalid mobile number: Must be 10–15 digits';
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

                // 👇 START OF MODIFICATION: Convert email to lowercase for the payload
                const lowercaseEmail = data.email.toLowerCase();
                // 👆 END OF MODIFICATION

                const formPayload = {
                    title: data.title,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    otherNames: data.otherNames,
                    DOB: data.dob,
                    // 👇 Use the lowercase email in the payload
                    email: lowercaseEmail,
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

                const response = await fetch('https://savings-loan-app.vercel.app/api/register', {
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

    const StepIndicator = ({ current }) => (
        <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ease-in-out transform ${
                            step === current
                                ? 'bg-orange-600 shadow-lg scale-110'
                                : step < current
                                    ? 'bg-orange-500 scale-105'
                                    : 'bg-gray-400'
                            }`}
                    >
                        {step}
                    </div>
                    {step < 3 && <div className={`h-1 w-12 mx-2 transition-colors duration-300 ${step < current ? 'bg-orange-500' : 'bg-gray-300'}`}></div>}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen w-full px-5 lg:px-0 bg-gray-50 flex items-center justify-center font-sans">
            <div className="w-full max-w-4xl bg-white border border-gray-200 shadow-2xl rounded-xl p-8 sm:p-10 my-8">

                <div className="text-center mb-10">
                    <GTCSLogo className="h-12 sm:h-14 w-auto mx-auto mb-4" />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-600 mb-2 tracking-tight">
                        User Registration Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">Step {currentStep}</p>
                </div>

                <StepIndicator current={currentStep} />

                {loading && currentStep === 3 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-sm text-center font-medium mb-4 shadow-inner">
                        Submitting form, please wait...
                    </div>
                )}

                {currentStep === 1 && (
                    <form onSubmit={handleSubmit((data) => onSubmit(data, 1))} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('title', { required: 'Invalid: Please select a title' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm appearance-none cursor-pointer bg-white hover:border-orange-400"
                                >
                                    <option value="">Select Title</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formErrors.title && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.title?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('lastName', { required: 'Invalid: Last name is required' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="e.g. Smith"
                                />
                                {formErrors.lastName && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.lastName?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('firstName', { required: 'Invalid: First name is required' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="e.g. John"
                                />
                                {formErrors.firstName && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.firstName?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Other Names</label>
                                <input
                                    type="text"
                                    {...register('otherNames')}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('dob', { required: 'Invalid: Date of birth is required' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                />
                                {formErrors.dob && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.dob?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Invalid: Email is required',
                                        pattern: {
                                            value: /^[^@]+@[^@]+\.[^@]+$/,
                                            message: 'Invalid email format'
                                        },
                                    })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="e.g. user@example.com"
                                />
                                {formErrors.email && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.email?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', {
                                            required: 'Invalid: Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Invalid: Password must be at least 8 characters long (letters, numbers, or symbols)',
                                            },
                                        })}
                                        className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-150 p-1"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.password?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword', {
                                            required: 'Invalid: Confirm password is required',
                                            validate: (value) => value === password || 'Invalid: Passwords do not match',
                                        })}
                                        className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-150 p-1"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.confirmPassword && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.confirmPassword?.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !isStepValid(watch(), 1)}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                                    isStepValid(watch(), 1) && !loading
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50 hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <span>Next</span>
                                <svg className={`w-5 h-5 transition-transform ${isStepValid(watch(), 1) ? 'translate-x-0' : '-translate-x-2 opacity-0'} duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                )}

                {currentStep === 2 && (
                    <form onSubmit={handleSubmit((data) => onSubmit(data, 2))} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Primary Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        {...register('primaryPhoneCountry')}
                                        className="flex-shrink-0 w-1/3 md:w-32 mt-1 px-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm cursor-pointer bg-white"
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
                                            required: 'Invalid: Primary phone is required',
                                            pattern: { value: /^\d{10,15}$/, message: 'Invalid: Must be 10–15 digits' },
                                        })}
                                        onChange={(e) => handlePhoneChange(e, 'primaryPhone')}
                                        className="flex-grow mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                        placeholder="e.g. 8012345678"
                                    />
                                </div>
                                {formErrors.primaryPhone && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.primaryPhone?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Other Phone</label>
                                <div className="flex space-x-2">
                                    <select
                                        {...register('otherPhoneCountry')}
                                        className="flex-shrink-0 w-1/3 md:w-32 mt-1 px-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm cursor-pointer bg-white"
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
                                            pattern: { value: /^\d{10,15}$/, message: 'Invalid: Must be 10–15 digits' },
                                        })}
                                        onChange={(e) => handlePhoneChange(e, 'otherPhone')}
                                        className="flex-grow mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                        placeholder="Optional"
                                    />
                                </div>
                                {formErrors.otherPhone && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.otherPhone?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    NIN <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('nin', {
                                        required: 'Invalid: NIN is required',
                                        pattern: { value: /^\d{11}$/, message: 'Invalid: Must be exactly 11 digits' },
                                    })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="National Identification Number (11 digits)"
                                />
                                {formErrors.nin && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.nin?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    BVN <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('bvn', {
                                        required: 'Invalid: BVN is required',
                                        pattern: { value: /^\d{11}$/, message: 'Invalid: Must be exactly 11 digits' },
                                    })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="Bank Verification Number (11 digits)"
                                />
                                {formErrors.bvn && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.bvn?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Residential Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register('residentialAddress', { required: 'Invalid: Residential address is required' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm min-h-[80px]"
                                    placeholder="Your full residential address"
                                />
                                {formErrors.residentialAddress && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.residentialAddress?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Residential State <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('residentialState', { required: 'Invalid: Residential state is required' })}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="e.g. Lagos"
                                />
                                {formErrors.residentialState && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.residentialState?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Office Address</label>
                                <textarea
                                    {...register('officeAddress')}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm min-h-[80px]"
                                    placeholder="Optional office address"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="w-1/2 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform bg-gray-600 hover:bg-gray-700 text-white shadow-gray-400/50 hover:scale-105 active:scale-95"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isStepValid(watch(), 2)}
                                className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                                    isStepValid(watch(), 2) && !loading
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50 hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <span>Next</span>
                                <svg className={`w-5 h-5 transition-transform ${isStepValid(watch(), 2) ? 'translate-x-0' : '-translate-x-2 opacity-0'} duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                )}

                {currentStep === 3 && (
                    <form onSubmit={handleSubmit((data) => onSubmit(data, 3))} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Reference Name</label>
                                <input
                                    type="text"
                                    {...register('referenceName')}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="Optional reference name"
                                />
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Reference Mobile</label>
                                <div className="flex space-x-2">
                                    <select
                                        {...register('referenceMobileCountry')}
                                        className="flex-shrink-0 w-1/3 md:w-32 mt-1 px-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm cursor-pointer bg-white"
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
                                            pattern: { value: /^\d{10,15}$/, message: 'Invalid: Must be 10–15 digits' },
                                        })}
                                        onChange={(e) => handlePhoneChange(e, 'referenceMobile')}
                                        className="flex-grow mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                        placeholder="Optional reference mobile"
                                    />
                                </div>
                                {formErrors.referenceMobile && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.referenceMobile?.message}</span>
                                )}
                            </div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Product</label>
                                <input
                                    type="text"
                                    {...register('product')}
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="Optional product choice"
                                />
                            </div>

                            <div className="hidden md:block"></div>

                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Next of Kin Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('nextOfKin', { required: 'Invalid: Next of kin name is required' })}
                                    type="text"
                                    className="mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                    placeholder="e.g. Jane Doe"
                                />
                                {formErrors.nextOfKin && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.nextOfKin?.message}</span>
                                )}
                            </div>
                            
                            <div className="relative space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Next of Kin Mobile <span className="text-red-500">*</span>
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        {...register('nextOfKinMobileCountry')}
                                        className="flex-shrink-0 w-1/3 md:w-32 mt-1 px-2 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm cursor-pointer bg-white"
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
                                            required: 'Invalid: Next of kin mobile is required',
                                            pattern: { value: /^\d{10,15}$/, message: 'Invalid: Must be 10–15 digits' },
                                        })}
                                        onChange={(e) => handlePhoneChange(e, 'nextOfKinMobile')}
                                        className="flex-grow mt-1 block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-150 ease-in-out sm:text-sm"
                                        placeholder="e.g. 8012345678"
                                    />
                                </div>
                                {formErrors.nextOfKinMobile && (
                                    <span className="mt-1 text-sm text-red-600 font-medium">{formErrors.nextOfKinMobile?.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                disabled={loading}
                                className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                                    loading 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-400/50 hover:scale-105 active:scale-95'
                                    }`}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isStepValid(watch(), 3)}
                                className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                                    isStepValid(watch(), 3) && !loading
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50 hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Success Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all duration-300 scale-100">
                            <Checkmark className="h-20 w-20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-orange-600 mb-2">Registration Successful!</h3>
                            <p className="text-gray-600 text-sm">Your account has been created successfully. The form will reset in a moment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserRegistration;