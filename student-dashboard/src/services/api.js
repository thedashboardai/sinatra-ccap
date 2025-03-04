// src/services/api.js
import axios from "axios";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJo7W6NhDkFyMJv4vO3Hd9GaRPCBljrWw",
  authDomain: "sinatra-ccap.firebaseapp.com",
  projectId: "sinatra-ccap",
  storageBucket: "sinatra-ccap.firebasestorage.app",
  messagingSenderId: "628301408266",
  appId: "1:628301408266:web:fd46a78ab927033bc597f3",
  measurementId: "G-FHPB4FR785",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth services
export const authService = {
  // Login user - fixed to properly send the Bearer token
  login: async (email, password) => {
    try {
      // Step 1: First authenticate with Firebase to get the ID token
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      console.log("Firebase token obtained:", idToken);

      // Step 2: Use that token to authenticate with the backend
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/auth/login`,
        data: { email, password },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log("RR", response);
      // Store token and user data
      localStorage.setItem("token", idToken);

      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Reset password with Firebase
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: "Password reset email sent successfully." };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  // Reset password directly with backend
  changePassword: async (email, newPassword) => {
    try {
      const response = await axios({
        method: "put",
        url: `${API_BASE_URL}/auth/reset-password`,
        data: { email, newPassword },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("user");
  },

  // Logout user
  logout: async () => {
    try {
      // Only sign out from Firebase if we're signed in
      if (auth.currentUser) {
        await auth.signOut();
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage even if Firebase logout fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Profile services
export const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "get",
        url: `${API_BASE_URL}/profile`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "put",
        url: `${API_BASE_URL}/profile/update`,
        data: profileData,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
};

// Portfolio services
export const portfolioService = {
  // Get all portfolio items
  getPortfolio: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "get",
        url: `${API_BASE_URL}/portfolio`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get portfolio error:", error);
      throw error;
    }
  },

  // Get a specific portfolio item
  getPortfolioItem: async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "get",
        url: `${API_BASE_URL}/portfolio/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get portfolio item error:", error);
      throw error;
    }
  },

  getUploadUrl: async (fileName, fileType = "image/jpeg") => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/portfolio/upload-url`,
        data: { fileName, fileType },
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get upload URL error:", error);
      throw error;
    }
  },

  uploadFileToS3: async (uploadURL, file) => {
    try {
      // Create a blob with the correct MIME type
      const blob = new Blob([file], { type: file.type });

      // Use XMLHttpRequest for more control over the upload process
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadURL, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.onload = () => {
          if (xhr.status === 200) {
            // Extract the S3 URL from the signed URL
            const s3Url = uploadURL.split("?")[0];
            resolve(s3Url);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error during upload"));
        };

        xhr.send(file);
      });
    } catch (error) {
      console.error("Upload file error:", error);
      throw error;
    }
  },

  // Add a new portfolio item
  addPortfolioItem: async (item) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/portfolio/add`,
        data: item,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Add portfolio item error:", error);
      throw error;
    }
  },

  // Update a portfolio item
  updatePortfolioItem: async (id, item) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "put",
        url: `${API_BASE_URL}/portfolio/${id}`,
        data: item,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Update portfolio item error:", error);
      throw error;
    }
  },

// Direct upload to S3 through our backend
directUpload: async (file) => {
  try {
    const token = localStorage.getItem('token');
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/portfolio/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Direct upload error:', error);
    throw error;
  }
},

  // Delete a portfolio item
  deletePortfolioItem: async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "delete",
        url: `${API_BASE_URL}/portfolio/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Delete portfolio item error:", error);
      throw error;
    }
  },
};

export default {
  auth: authService,
  profile: profileService,
  portfolio: portfolioService,
};
