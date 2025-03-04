import React, { createContext, useState, useContext, useEffect } from 'react';
import { profileService, portfolioService } from './api';

// Create context
const ProfileContext = createContext();

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
    high_school: '',
    graduation_year: '',
    willing_to_relocate: false,
    relocation_states: [],
    hours_per_week: 40,
    work_preference: [],
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
    food_handlers_card: false,
    food_handlers_card_url: null,
    servsafe_credential: false,
    culinary_class_years: 0,
    job_interests: []
  });
  
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [isPortfolioFetched, setIsPortfolioFetched] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await profileService.getProfile();
      console.log("Fetched profile data:", data);
      setProfileData(prevData => ({
        ...prevData,
        ...data
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

  // Update profile data (local state only)
  const updateProfileData = (newData) => {
    setProfileData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Update portfolio data (local state only)
  const updatePortfolioData = (newData) => {
    setPortfolioData(newData);
  };

  // Save profile data to server
  const saveProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await profileService.updateProfile(profileData);
      console.log("Profile update result:", result);
      return result;
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
    isPortfolioFetched
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