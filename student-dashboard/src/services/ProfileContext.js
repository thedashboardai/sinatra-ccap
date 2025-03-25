import React, { createContext, useState, useContext, useEffect } from 'react';
import { profileService, portfolioService } from './api';

// Create context
const ProfileContext = createContext();

// Map of work preference UUIDs to readable values
const WORK_PREFERENCE_MAP = {
  '95391dde-8139-4fdd-b515-33aba697b302': 'Morning (6AM - 10AM)',
  'a0d0083f-8cc7-4f30-888a-beb24304659a': 'Afternoon (10AM - 2PM)',
  '02d2b352-7fe9-47e5-aa8f-766031faf3c4': 'Evening (2PM - 6PM)'
};

// Map of job interest UUIDs to readable values
const JOB_INTEREST_MAP = {
  'df832319-251b-4f01-968c-4bc4028cf126': 'Culinary',
  '9e4ad21c-1863-4a66-8ded-fed975b6c3d9': 'Baking and Pastry'
};

// Profile provider component
export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // Default empty profile data structure
    first_name: '',
    last_name: '',
    preferred_name: '',
    mailing_address: '',
    address_line_2: null,
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    date_of_birth: '',
    high_school: '',
    graduation_year: '',
    willing_to_relocate: false,
    relocation_states: [],
    hours_per_week: 40,
    work_preference: [],
    work_preference_readable: [],
    available_weekends: false,
    current_job: false,
    current_employer: '',
    current_position: '',
    current_work_hours: 0,
    past_job: false,
    past_employer: '',
    past_position: '',
    past_work_hours: 0,
    has_resume: false,
    resume_url: '',
    ready_to_work: true,
    start_date: '',
    food_handlers_card: false,
    food_handlers_card_url: null,
    servsafe_credential: false,
    culinary_class_years: 0,
    job_interests: [],
    job_interests_readable: [],
    bio: 'Passionate about creating unforgettable dining experiences, I bring artistry and precision to every dish I craft. With a love for fresh, high-quality ingredients and a deep understanding of flavor balance, I specialize in elevating traditional recipes with modern techniques. My kitchen is my canvas, where I blend innovation with culinary heritage to delight the senses. Whether it’s crafting delicate sushi rolls, vibrant salads, or perfectly grilled seafood, I believe that every plate tells a story. Follow my journey through flavors and textures as I bring the finest culinary experiences to your table.',
    profile_picture_url: '',
    transportation: 'drive'
  });
  
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [isPortfolioFetched, setIsPortfolioFetched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await profileService.getProfile();
      console.log("Fetched profile data:", data);
      
      // Map work preferences from UUIDs to readable values
      const workPreferenceReadable = Array.isArray(data.work_preference) 
        ? data.work_preference.map(uuid => WORK_PREFERENCE_MAP[uuid] || uuid)
        : [];
        
      // Map job interests from UUIDs to readable values
      const jobInterestsReadable = Array.isArray(data.job_interests)
        ? data.job_interests.map(uuid => JOB_INTEREST_MAP[uuid] || uuid)
        : [];
        
      setProfileData(prevData => ({
        ...prevData,
        ...data,
        work_preference_readable: workPreferenceReadable,
        job_interests_readable: jobInterestsReadable,
        // Format date fields properly if they exist
        date_of_birth: data.date_of_birth || '',
        start_date: data.start_date || '',
        // Set transportation based on existing data or default to 'drive'
        transportation: data.transportation || 'drive',
        // Ensure available_weekends is a boolean
        available_weekends: !!data.available_weekends
      }));
      
      setIsProfileFetched(true);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await portfolioService.getPortfolio();
      console.log("Fetched portfolio data:", data);
      setPortfolioData(data);
      setIsPortfolioFetched(true);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  // Validate profile data
  const validateProfile = (data) => {
    const errors = {};
    
    // Required fields validation
    if (!data.first_name) errors.first_name = "First name is required";
    if (!data.last_name) errors.last_name = "Last name is required";
    if (!data.mailing_address) errors.mailing_address = "Mailing address is required";
    if (!data.phone_number) errors.phone_number = "Phone number is required";
    
    // Phone number format validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (data.phone_number && !phoneRegex.test(data.phone_number.replace(/[^0-9+]/g, ''))) {
      errors.phone_number = "Please enter a valid phone number";
    }
    
    // Date validation
    if (data.date_of_birth) {
      const dobDate = new Date(data.date_of_birth);
      if (isNaN(dobDate.getTime())) {
        errors.date_of_birth = "Please enter a valid date";
      }
    }
    
    // Numeric validations
    if (data.graduation_year && (isNaN(data.graduation_year) || data.graduation_year < 0)) {
      errors.graduation_year = "Please enter a valid graduation year";
    }
    
    if (data.hours_per_week && (isNaN(data.hours_per_week) || data.hours_per_week < 0)) {
      errors.hours_per_week = "Please enter a valid number of hours";
    }
    
    if (data.culinary_class_years && (isNaN(data.culinary_class_years) || data.culinary_class_years < 0)) {
      errors.culinary_class_years = "Please enter a valid number of years";
    }
    
    return errors;
  };

  // Update profile data (local state only)
  const updateProfileData = (newData) => {
    const updatedData = {
      ...profileData,
      ...newData
    };
    
    // Validate the updated data
    const errors = validateProfile(updatedData);
    setValidationErrors(errors);
    
    setProfileData(updatedData);
    return Object.keys(errors).length === 0;
  };

  // Update portfolio data (local state only)
  const updatePortfolioData = (newData) => {
    setPortfolioData(newData);
  };

  // Save profile data to server
  const saveProfile = async () => {
    setLoading(true);
    setError(null);
    
    // Validate before saving
    const errors = validateProfile(profileData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError("Please fix the validation errors before saving");
      setLoading(false);
      return false;
    }
    
    try {
      // Prepare data for API - convert readable values back to UUIDs if needed
      const apiData = { ...profileData };
      
      // Remove the readable fields that shouldn't be sent to the API
      delete apiData.work_preference_readable;
      delete apiData.job_interests_readable;
      
      const result = await profileService.updateProfile(apiData);
      console.log("Profile update result:", result);
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to save profile data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add portfolio item
  const savePortfolioItem = async (item) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await portfolioService.addPortfolioItem(item);
      console.log("Portfolio item added:", result);
      
      // Update the portfolio data
      setPortfolioData(prevData => [...prevData, result]);
      return result;
    } catch (err) {
      console.error("Error adding portfolio item:", err);
      setError("Failed to save portfolio item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update portfolio item
  const updatePortfolioItem = async (id, item) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await portfolioService.updatePortfolioItem(id, item);
      console.log("Portfolio item updated:", result);
      
      // Update the portfolio data
      setPortfolioData(prevData => 
        prevData.map(item => item.id === id ? result : item)
      );
      return result;
    } catch (err) {
      console.error("Error updating portfolio item:", err);
      setError("Failed to update portfolio item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio item
  const deletePortfolioItem = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await portfolioService.deletePortfolioItem(id);
      console.log("Portfolio item deleted:", result);
      
      // Update the portfolio data
      setPortfolioData(prevData => prevData.filter(item => item.id !== id));
      return result;
    } catch (err) {
      console.error("Error deleting portfolio item:", err);
      setError("Failed to delete portfolio item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload portfolio image
  const uploadPortfolioImage = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a unique filename
      const timestamp = new Date().getTime();
      const fileName = `dish_${timestamp}_${file.name}`;
      
      // Get a signed URL for S3 upload
      const uploadURL = await portfolioService.getUploadUrl(fileName);
      
      // Upload the image to S3
      const imageUrl = await portfolioService.uploadFileToS3(uploadURL, file);
      return imageUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Prepare context value
  const value = {
    profileData,
    portfolioData,
    updateProfileData,
    updatePortfolioData,
    loading,
    error,
    fetchProfile,
    fetchPortfolio,
    saveProfile,
    savePortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    uploadPortfolioImage,
    isProfileFetched,
    isPortfolioFetched,
    validationErrors,
    workPreferenceMap: WORK_PREFERENCE_MAP,
    jobInterestMap: JOB_INTEREST_MAP
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;