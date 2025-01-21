import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon, PlusIcon, MinusIcon, CheckCircleIcon, UploadIcon, XIcon } from './components/Icons';
import ProductViewer from './components/ProductViewer';
import { useFormHistory } from './hooks/useFormHistory';

interface CameraPosition {
  angle: number;
  position: [number, number, number];
  label: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  numberOfProducts: number;
  photosPerProduct: number;
  cameraPositions: CameraPosition[];
  currentProductIndex: number;
  uploadedPhotos: { [key: number]: File[] };
  usePhotoUpload: boolean | undefined;
  productDescriptions: string[];
  productNames: string[];
  extraServices: {
    [key: number]: {
      transparentBackground: boolean;
      customBackgroundColor: boolean;
      customBackgroundColorValues: string[];
    }
  };
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  postalCode: '',
  city: '',
  numberOfProducts: 1,
  photosPerProduct: 5,
  cameraPositions: [],
  currentProductIndex: 0,
  uploadedPhotos: {},
  usePhotoUpload: undefined,
  productDescriptions: [''],
  productNames: [''],
  extraServices: {
    0: {
      transparentBackground: false,
      customBackgroundColor: false,
      customBackgroundColorValues: Array(5).fill('#FFFFFF')
    }
  }
};

function ProductPhotographyOrderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { state: formData, setState: setFormData } = useFormHistory<FormData>(initialFormData);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [show3DViewer, setShow3DViewer] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    // Update form data
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleNextStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      // Check each required field for step 1
      if (!formData.firstName) newErrors.firstName = 'Dit veld is verplicht';
      if (!formData.lastName) newErrors.lastName = 'Dit veld is verplicht';
      if (!formData.address) newErrors.address = 'Dit veld is verplicht';
      if (!formData.city) newErrors.city = 'Dit veld is verplicht';
      
      // Email validation
      if (!formData.email) {
        newErrors.email = 'Dit veld is verplicht';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Voer een geldig e-mailadres in';
      }
      
      // Postal code validation
      if (!formData.postalCode) {
        newErrors.postalCode = 'Dit veld is verplicht';
      } else if (!/^\d{4}\s?[A-Za-z]{2}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Voer een geldige postcode in (bijv. 1234 AB)';
      }
    } else if (currentStep === 2) {
      // Validate product names in step 2
      for (let i = 0; i < formData.numberOfProducts; i++) {
        if (!formData.productNames[i]?.trim()) {
          newErrors[`productName${i}`] = 'Product naam is verplicht';
        }
      }
    }

    setValidationErrors(newErrors);

    // Only proceed if there are no errors
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleExtraServiceChange = (productIndex: number, service: 'transparentBackground' | 'customBackgroundColor' | 'customBackgroundColorValues', value: boolean | string | string[]) => {
    const updatedFormData = { ...formData };
    
    // Initialize this product's services if they don't exist
    if (!updatedFormData.extraServices[productIndex]) {
      updatedFormData.extraServices[productIndex] = {
        transparentBackground: false,
        customBackgroundColor: false,
        customBackgroundColorValues: new Array(formData.photosPerProduct).fill('#FFFFFF')
      };
    }

    // If we're enabling the custom background color, ensure the colors array is initialized
    if (service === 'customBackgroundColor' && value === true) {
      updatedFormData.extraServices[productIndex] = {
        ...updatedFormData.extraServices[productIndex],
        customBackgroundColor: true,
        customBackgroundColorValues: new Array(formData.photosPerProduct).fill('#FFFFFF')
      };
    } else {
      // For other changes, just update the specific value
      updatedFormData.extraServices[productIndex] = {
        ...updatedFormData.extraServices[productIndex],
        [service]: value
      };
    }

    setFormData(updatedFormData);
  };

  const calculateTotalPrice = () => {
    let basePrice = 31.50 * formData.numberOfProducts;
    let extraServicesPrice = 0;
    let photosPrice = formData.photosPerProduct * 5 * formData.numberOfProducts; // €5 per foto

    Object.entries(formData.extraServices).forEach(([productIndex, services]) => {
      if (parseInt(productIndex) < formData.numberOfProducts) {
        if (services.transparentBackground) {
          extraServicesPrice += 3 * formData.photosPerProduct;
        }
        if (services.customBackgroundColor) {
          extraServicesPrice += 3 * formData.photosPerProduct;
        }
      }
    });

    return basePrice + extraServicesPrice + photosPrice;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    const files = event.target.files;
    if (files) {
      const existingFiles = formData.uploadedPhotos[productIndex] || [];
      const newFiles = Array.from(files);
      
      // Calculate how many more files we can add
      const remainingSlots = 5 - existingFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        setFormData({
          ...formData,
          uploadedPhotos: {
            ...formData.uploadedPhotos,
            [productIndex]: [...existingFiles, ...filesToAdd]
          }
        });
      }

      // Show warning if user tried to add more than allowed
      if (newFiles.length > remainingSlots) {
        alert(`Maximaal 5 foto's per product toegestaan. Alleen de eerste ${remainingSlots} foto${remainingSlots === 1 ? '' : '\'s'} ${remainingSlots === 1 ? 'is' : 'zijn'} toegevoegd.`);
      }
    }
  };

  const removeFile = (productIndex: number, fileIndex: number) => {
    const newUploadedPhotos = { ...formData.uploadedPhotos };
    if (newUploadedPhotos[productIndex]) {
      newUploadedPhotos[productIndex] = newUploadedPhotos[productIndex].filter((_, index) => index !== fileIndex);
    }
    setFormData({
      ...formData,
      uploadedPhotos: newUploadedPhotos
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A051B] via-[#1A0B3C] to-[#0A051B]">
      {/* Navigation */}
      <nav className="relative bg-black/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 relative">
            <Link 
              to="/" 
              className="flex items-center mb-4 md:mb-0 group relative hover:opacity-80 transition-opacity"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <CameraIcon className="w-8 h-8 mr-2 group-hover:rotate-12 transition-all duration-300 text-blue-400 relative" />
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent relative">
                PRODUCTINBEELD.NL
              </span>
            </Link>

            <div className="flex space-x-6">
              <Link 
                to="/productfotografie" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Productfotografie
              </Link>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/10">
          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10"></div>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === currentStep
                      ? 'bg-blue-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-black/50 text-gray-400'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Persoonlijke informatie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Voornaam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.firstName ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.firstName ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      required
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Achternaam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.lastName ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.lastName ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      required
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.email ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.address ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.address ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      required
                    />
                    {validationErrors.address && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.postalCode ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.postalCode ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      placeholder="1234 AB"
                      required
                    />
                    {validationErrors.postalCode && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full rounded-lg bg-black/50 border ${validationErrors.city ? 'border-red-500' : 'border-white/10'} text-white px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.city ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                      required
                    />
                    {validationErrors.city && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Volgende stap
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Product Information */}
                     {currentStep === 2 && (
                       <div className="space-y-6">
                         {/* YouTube Video Section */}
                         <div className="max-w-4xl mx-auto mb-8">
                           <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden">
                             <iframe
                               className="absolute top-0 left-0 w-full h-full"
                               src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                               title="Product Information Video"
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               allowFullScreen
                             ></iframe>
                           </div>
                         </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Product informatie</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Aantal producten
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setFormData({ ...formData, numberOfProducts: Math.max(1, formData.numberOfProducts - 1) })}
                        className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-medium text-white w-8 text-center">
                        {formData.numberOfProducts}
                      </span>
                      <button
                        onClick={() => setFormData({ ...formData, numberOfProducts: formData.numberOfProducts + 1 })}
                        className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                      <span className="text-gray-400 ml-2">
                        (€31,50 per product)
                      </span>
                    </div>
                  </div>

                  {Array.from({ length: formData.numberOfProducts }).map((_, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-medium text-white">Product {index + 1}</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Product naam <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.productNames[index] || ''}
                          onChange={(e) => {
                            const newNames = [...formData.productNames];
                            newNames[index] = e.target.value;
                            setFormData({
                              ...formData,
                              productNames: newNames
                            });
                            setValidationErrors(prev => ({
                              ...prev,
                              [`productName${index}`]: ''
                            }));
                          }}
                          placeholder="Naam van het product..."
                          className={`w-full rounded-lg bg-black/50 border ${
                            validationErrors[`productName${index}`] ? 'border-red-500' : 'border-white/10'
                          } text-white px-4 py-2 focus:outline-none focus:ring-2 ${
                            validationErrors[`productName${index}`] ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                          }`}
                        />
                        {validationErrors[`productName${index}`] && (
                          <p className="mt-1 text-sm text-red-500">{validationErrors[`productName${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Product beschrijving
                        </label>
                        <textarea
                          value={formData.productDescriptions[index] || ''}
                          onChange={(e) => {
                            const newDescriptions = [...formData.productDescriptions];
                            newDescriptions[index] = e.target.value;
                            setFormData({
                              ...formData,
                              productDescriptions: newDescriptions
                            });
                          }}
                          placeholder="Beschrijf het product..."
                          className="w-full rounded-lg bg-black/50 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Foto's per product
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setFormData({ ...formData, photosPerProduct: Math.max(1, formData.photosPerProduct - 1) })}
                        className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-medium text-white w-8 text-center">
                        {formData.photosPerProduct}
                      </span>
                      <button
                        onClick={() => setFormData({ ...formData, photosPerProduct: formData.photosPerProduct + 1 })}
                        className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                      <span className="text-gray-400 ml-2">
                        (€5,- per foto)
                      </span>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="mt-8 p-6 bg-black/50 rounded-xl border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">Prijsoverzicht</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Basis prijs ({formData.numberOfProducts} producten)</span>
                        <span>€{(31.50 * formData.numberOfProducts).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-blue-400">
                        <span>Foto's ({formData.photosPerProduct} per product)</span>
                        <span>€{(formData.photosPerProduct * 5 * formData.numberOfProducts).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between font-medium text-white text-lg">
                        <span>Subtotaal</span>
                        <span>€{calculateTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  Vorige stap
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Volgende stap
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Photo Upload or Camera Positions */}
                     {currentStep === 3 && (
                       <div className="space-y-6">
                         {/* YouTube Video Section */}
                         <div className="max-w-4xl mx-auto mb-8">
                           <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden">
                             <iframe
                               className="absolute top-0 left-0 w-full h-full"
                               src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                               title="Camera Positions Guide"
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               allowFullScreen
                             ></iframe>
                           </div>
                         </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Bepaal de camera posities</h2>
                <p className="text-gray-400 mb-6">
                  Voor elk product heb je {formData.photosPerProduct} foto's gekozen. Bepaal hier vanuit welke hoeken deze foto's gemaakt moeten worden.
                </p>
                
                <div className="space-y-8">
                  {/* Product Progress Bar */}
                  <div className="flex items-center justify-between bg-black/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">Product:</span>
                      <div className="flex space-x-2">
                        {Array.from({ length: formData.numberOfProducts }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setFormData({ ...formData, currentProductIndex: index, cameraPositions: [] })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === formData.currentProductIndex
                                ? 'bg-blue-500 text-white'
                                : index < formData.currentProductIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-black/50 text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="font-medium text-white">{formData.cameraPositions.length}</span>
                      <span> van </span>
                      <span className="font-medium text-white">{formData.photosPerProduct}</span>
                      <span> hoeken geselecteerd</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            usePhotoUpload: false
                          });
                          setShow3DViewer(true);
                        }}
                      className={`flex-1 p-6 rounded-lg border ${
                        formData.usePhotoUpload === false
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-black/50 hover:bg-black/70'
                      } transition-colors`}
                    >
                      <CameraIcon className="w-8 h-8 mx-auto mb-3 text-white" />
                      <span className="block text-white font-medium text-lg mb-2">Gebruik 3D viewer</span>
                      <p className="text-sm text-gray-400">Klik op het model om camera posities vast te leggen</p>
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          usePhotoUpload: true
                        });
                        setShow3DViewer(false);
                      }}
                      className={`flex-1 p-6 rounded-lg border ${
                        formData.usePhotoUpload === true
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-black/50 hover:bg-black/70'
                      } transition-colors`}
                    >
                      <UploadIcon className="w-8 h-8 mx-auto mb-3 text-white" />
                      <span className="block text-white font-medium text-lg mb-2">Upload eigen foto's</span>
                      <p className="text-sm text-gray-400">Upload je eigen productfoto's als je die al hebt</p>
                    </button>
                  </div>

                  {formData.usePhotoUpload ? (
                    <div className="space-y-6">
                      {Array.from({ length: formData.numberOfProducts }).map((_, productIndex) => (
                        <div key={productIndex} className="p-6 bg-black/50 rounded-xl border border-white/10">
                          <h3 className="text-lg font-medium text-white mb-4">
                            {formData.productNames[productIndex] || `Product ${productIndex + 1}`}
                          </h3>
                          
                          <div className="space-y-4">
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[productIndex] = el}
                              onChange={(e) => handleFileChange(e, productIndex)}
                              multiple
                              accept="image/*"
                              className="hidden"
                              max={5}
                              onClick={(e) => {
                                // Reset value to allow selecting the same file again
                                (e.target as HTMLInputElement).value = '';
                              }}
                            />
                            
                            <button
                              onClick={() => fileInputRefs.current[productIndex]?.click()}
                              className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-colors"
                            >
                              <UploadIcon className="w-6 h-6 mx-auto mb-2" />
                              <span className="block">
                                Klik om foto's te uploaden
                                <br />
                                <span className="text-sm text-gray-400">
                                  ({formData.uploadedPhotos[productIndex]?.length || 0}/5 foto's)
                                </span>
                              </span>
                            </button>

                            {formData.uploadedPhotos[productIndex]?.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {formData.uploadedPhotos[productIndex].map((file, fileIndex) => (
                                  <div key={fileIndex} className="relative group">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Upload ${fileIndex + 1}`}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                      onClick={() => removeFile(productIndex, fileIndex)}
                                      className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <XIcon className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : show3DViewer && (
                    <div className="space-y-6">
                      <div className="p-6 bg-black/50 rounded-xl border border-white/10">
                        <ProductViewer
                          onPositionLock={(position) => {
                            setFormData({
                              ...formData,
                              cameraPositions: [...formData.cameraPositions, position]
                            });
                          }}
                          maxPositions={formData.photosPerProduct}
                          currentProduct={formData.currentProductIndex + 1}
                          totalProducts={formData.numberOfProducts}
                          onProductComplete={() => {
                            setFormData({
                              ...formData,
                              currentProductIndex: formData.currentProductIndex + 1,
                              cameraPositions: []
                            });
                          }}
                          onProductChange={(index) => {
                            setFormData({
                              ...formData,
                              currentProductIndex: index,
                              cameraPositions: []
                            });
                          }}
                          lockedPositions={formData.cameraPositions}
                          onPositionRemove={(index) => {
                            setFormData({
                              ...formData,
                              cameraPositions: formData.cameraPositions.filter((_, i) => i !== index)
                            });
                          }}
                          productName={formData.productNames[formData.currentProductIndex]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  Vorige stap
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Volgende stap
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Extra Services */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* YouTube Video Section */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Extra Services Guide"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Extra services per product</h2>
                
                <div className="space-y-8">
                  {Array.from({ length: formData.numberOfProducts }).map((_, productIndex) => {
                    const services = formData.extraServices[productIndex] || {
                      transparentBackground: false,
                      customBackgroundColor: false,
                      customBackgroundColorValues: new Array(formData.photosPerProduct).fill('#FFFFFF')
                    };

                    return (
                      <div key={productIndex} className="bg-black/50 rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">
                          {formData.productNames[productIndex] || `Product ${productIndex + 1}`}
                        </h3>
                        
                        <div className="space-y-6">
                          {/* Transparent Background Option */}
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`transparent-${productIndex}`}
                                  checked={services.transparentBackground}
                                  onChange={(e) => handleExtraServiceChange(productIndex, 'transparentBackground', e.target.checked)}
                                  className="w-4 h-4 rounded border-white/10 bg-black/50 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor={`transparent-${productIndex}`} className="text-lg font-medium text-white">
                                  Transparante achtergrond
                                </label>
                              </div>
                              <p className="mt-2 text-gray-400">
                                Verwijder de achtergrond van je foto's voor een professionele uitstraling.
                              </p>
                              <p className="mt-2 text-blue-400 font-medium">
                                + €{(3 * formData.photosPerProduct).toFixed(2)} (€3,- per foto)
                              </p>
                            </div>
                          </div>

                          {/* Custom Background Color Option */}
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`background-${productIndex}`}
                                  checked={services.customBackgroundColor}
                                  onChange={(e) => {
                                    // Initialize color array when checkbox is checked
                                    const value = e.target.checked;
                                    handleExtraServiceChange(productIndex, 'customBackgroundColor', value);
                                    if (value) {
                                      handleExtraServiceChange(
                                        productIndex,
                                        'customBackgroundColorValues',
                                        Array(formData.photosPerProduct).fill('#FFFFFF')
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-white/10 bg-black/50 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor={`background-${productIndex}`} className="text-lg font-medium text-white">
                                  Aangepaste achtergrondkleur
                                </label>
                              </div>
                              <p className="mt-2 text-gray-400">
                                Kies voor elke foto een eigen achtergrondkleur.
                              </p>
                              {services.customBackgroundColor && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <p className="col-span-full mb-2">
                                    <div className="bg-blue-500/10 p-4 rounded-lg">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-blue-400 font-bold text-lg">
                                          {formData.photosPerProduct} {formData.photosPerProduct === 1 ? 'foto' : "foto's"}
                                        </span>
                                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                          Stap 2 ✓
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-white font-medium">
                                          Kies voor elke foto een eigen achtergrondkleur
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                          Selecteer hieronder per foto de gewenste achtergrondkleur
                                        </span>
                                      </div>
                                    </div>
                                  </p>
                                  {Array.from({ length: formData.photosPerProduct }).map((_, photoIndex) => (
                                    <div key={photoIndex} className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-blue-500/20 transition-all group">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                          <label className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                            Foto {photoIndex + 1} van {formData.photosPerProduct}
                                          </label>
                                        </div>
                                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                          Kies hieronder een kleur
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="flex-1 flex items-center gap-3">
                                          <div className="relative group/color">
                                            <input
                                              type="color"
                                              value={services.customBackgroundColorValues[photoIndex] || '#FFFFFF'}
                                              onChange={(e) => {
                                                const newColors = [...(services.customBackgroundColorValues || Array(formData.photosPerProduct).fill('#FFFFFF'))];
                                                newColors[photoIndex] = e.target.value;
                                                handleExtraServiceChange(productIndex, 'customBackgroundColorValues', newColors);
                                              }}
                                              className="w-10 h-10 rounded-lg border-2 border-white/10 bg-transparent cursor-pointer group-hover/color:border-blue-500/50 transition-colors"
                                            />
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none">
                                              Kies een kleur
                                            </div>
                                          </div>
                                          <input
                                            type="text"
                                            value={services.customBackgroundColorValues[photoIndex] || '#FFFFFF'}
                                            onChange={(e) => {
                                              const newColors = [...(services.customBackgroundColorValues || Array(formData.photosPerProduct).fill('#FFFFFF'))];
                                              newColors[photoIndex] = e.target.value;
                                              handleExtraServiceChange(productIndex, 'customBackgroundColorValues', newColors);
                                            }}
                                            className="flex-1 sm:flex-none w-full sm:w-32 rounded bg-black/50 border border-white/10 hover:border-blue-500/20 focus:border-blue-500 text-white px-3 py-2 text-sm transition-colors"
                                            placeholder="#FFFFFF"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <p className="mt-2 text-blue-400 font-medium">
                                + €{(3 * formData.photosPerProduct).toFixed(2)} (€3,- per foto)
                 ```jsx
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                   })}
                </div>

                {/* Price Summary */}
                <div className="mt-8 p-6 bg-black/50 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Prijsoverzicht</h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Basis prijs ({formData.numberOfProducts} producten)</span>
                      <span>€{(31.50 * formData.numberOfProducts).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-blue-400">
                      <span>Foto's ({formData.photosPerProduct} per product)</span>
                      <span>€{(formData.photosPerProduct * 5 * formData.numberOfProducts).toFixed(2)}</span>
                    </div>
                    {Object.entries(formData.extraServices).map(([productIndex, services]) => {
                      if (parseInt(productIndex) < formData.numberOfProducts) {
                        return (
                          <div key={productIndex} className="space-y-1">
                            {(services.transparentBackground || services.customBackgroundColor) && (
                              <div className="text-sm text-gray-400 mt-2">
                                {formData.productNames[parseInt(productIndex)] || `Product ${parseInt(productIndex) + 1}`}
                              </div>
                            )}
                            {services.transparentBackground && (
                              <div className="flex justify-between pl-4">
                                <span>Transparante achtergrond ({formData.photosPerProduct} foto's)</span>
                                <span>+ €{(3 * formData.photosPerProduct).toFixed(2)}</span>
                              </div>
                            )}
                            {services.customBackgroundColor && (
                              <div className="space-y-2">
                                <div className="flex justify-between pl-4">
                                  <span>Aangepaste achtergrondkleuren ({formData.photosPerProduct} foto's)</span>
                                  <span>+ €{(3 * formData.photosPerProduct).toFixed(2)}</span>
                                </div>
                                <div className="pl-8 grid grid-cols-2 gap-2">
                                  {services.customBackgroundColorValues.map((color, colorIndex) => (
                                    <div key={colorIndex} className="flex items-center space-x-2 text-sm text-gray-400">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                                      <span>Foto {colorIndex + 1}: {color}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between font-medium text-white text-lg">
                      <span>Totaal</span>
                      <span>€{calculateTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  Vorige stap
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Volgende stap
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Controleer je bestelling</h2>
                
                <div className="space-y-8">
                  {/* Personal Information Review */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Persoonlijke informatie</h3>
                    <div className="grid grid-cols-2 gap-4 text-gray-300">
                      <div>
                        <span className="block text-sm text-gray-400">Naam</span>
                        <span>{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-400">E-mail</span>
                        <span>{formData.email}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-400">Adres</span>
                        <span>{formData.address}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-400">Postcode & Stad</span>
                        <span>{formData.postalCode} {formData.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Information Review */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Product informatie</h3>
                    <div className="space-y-6">
                      {Array.from({ length: formData.numberOfProducts }).map((_, index) => (
                        <div key={index} className="bg-black/50 p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-2">
                            {formData.productNames[index] || `Product ${index + 1}`}
                          </h4>
                          <div className="text-gray-300 space-y-2">
                            <p className="text-sm">{formData.productDescriptions[index]}</p>
                            <div className="text-sm text-gray-400">
                              <span className="block">Aantal foto's: {formData.photosPerProduct}</span>
                              {formData.extraServices[index]?.transparentBackground && (
                                <span className="block">• Transparante achtergrond</span>
                              )}
                              {formData.extraServices[index]?.customBackgroundColor && (
                                <div>
                                  <span className="block mb-2">• Aangepaste achtergrondkleuren:</span>
                                  <div className="ml-4 grid grid-cols-2 gap-2">
                                    {(formData.extraServices[index].customBackgroundColorValues || []).map((color, colorIndex) => (
                                      <div key={colorIndex} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded border border-white/10" style={{ backgroundColor: color }} />
                                        <span className="text-sm">Foto {colorIndex + 1}: {color}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Price Summary */}
                  <div className="bg-black/50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Totaal overzicht</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Basis prijs ({formData.numberOfProducts} producten)</span>
                        <span>€{(31.50 * formData.numberOfProducts).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-blue-400">
                        <span>Foto's ({formData.photosPerProduct} per product)</span>
                        <span>€{(formData.photosPerProduct * 5 * formData.numberOfProducts).toFixed(2)}</span>
                      </div>
                      {Object.entries(formData.extraServices).map(([productIndex, services]) => {
                        if (parseInt(productIndex) < formData.numberOfProducts) {
                          return (
                            <div key={productIndex} className="space-y-1">
                              {(services.transparentBackground || services.customBackgroundColor) && (
                                <div className="text-sm text-gray-400 mt-2">
                                  {formData.productNames[parseInt(productIndex)] || `Product ${parseInt(productIndex) + 1}`}
                                </div>
                              )}
                              {services.transparentBackground && (
                                <div className="flex justify-between pl-4">
                                  <span>Transparante achtergrond ({formData.photosPerProduct} foto's)</span>
                                  <span>+ €{(3 * formData.photosPerProduct).toFixed(2)}</span>
                                </div>
                              )}
                              {services.customBackgroundColor && (
                                <div className="flex justify-between pl-4">
                                  <span>Aangepaste achtergrondkleur ({formData.photosPerProduct} foto's)</span>
                                  <span>+ €{(3 * formData.photosPerProduct).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between font-medium text-white text-lg">
                        <span>Totaal</span>
                        <span>€{calculateTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  Vorige stap
                </button>
                <button
                  onClick={() => {
                    // Handle form submission
                    console.log('Form submitted:', formData);
                  }}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Bestelling plaatsen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPhotographyOrderForm;
