/**
 * @fileoverview Service to interact with the API.
 *
 * @file src/services/APIServices.js
 *
 * Provides functions to interact with various API endpoints, including retrieving,
 * creating, and deleting workouts and splits, as well as handling contact form submissions.
 *
 * Utilizes Axios for HTTP requests.
 *
 * @author Steven Stansberry
 * @version 1.0.0
 */

import axios from "axios";

// Determine if we're in development or production mode
const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_AQUAMIND_DEV_URL // Localhost for dev
    : process.env.REACT_APP_AQUAMIND_PROD_URL; // Production URL for prod

/**
 * Sends a GET request to a specified API endpoint.
 *
 * @async
 * @function getFromAPI
 * @param {string} endpoint - The API endpoint to send the GET request to.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const getFromAPI = async (endpoint) => {
  const url = `${baseURL}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making GET request to:", url);

  try {
    const response = await axios.get(url, {
      headers: {},
    });

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Sends a POST request to a specified API endpoint with data.
 *
 * @async
 * @function postToAPI
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const postToAPI = async (endpoint, data) => {
  const url = `${baseURL}${endpoint}`; // Construct the full URL

  console.log("Making POST request to:", url);
  console.log("Request Data:", data);

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Performs health check on API
 *
 * @async
 * @function uploadWorkout
 * @returns {Promise<Object>} Response data from the API.
 */
export const healthCheck = async () => {
  return getFromAPI("/health");
};

/**
 * Registers a new user by sending a POST request to the API.
 *
 * @async
 * @function registerUser
 * @param {Object} userData - The user data for registration (email, password, fullName).
 * @returns {Promise<Object>} Response data from the API, including the JWT token.
 */
export const registerUser = async (userData) => {
  return postToAPI("/register", userData);
};

/**
 * Logs in a user by sending a POST request to the API.
 *
 * @async
 * @function loginUser
 * @param {Object} userData - The user credentials (email, password).
 * @returns {Promise<Object>} Response data from the API, including the JWT token.
 */
export const loginUser = async (userData) => {
  return postToAPI("/login", userData);
};

/**
 * Creates an aquarium by sending a POST request to the API.
 *
 * @async
 * @function createAquarium
 * @param {Object} aquariumData - The aquarim data
 * @returns {Promise<Object>} Response data from the API.
 */
export const createAquarium = async (aquariumData) => {
  return postToAPI("/aquariums", aquariumData);
};
/**
 * Generic function to send a POST request to the OpenAI API.
 *
 * @async
 * @function postToOpenAI
 * @param {string} endpoint - The OpenAI API endpoint.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} Response data from the OpenAI API.
 * @throws Will throw an error if the request fails.
 */
const postToOpenAI = async (endpoint, data) => {
  const url = `http://localhost:8082${endpoint}`; // Base URL + endpoint

  console.log("Making POST request to:", url);
  console.log("Request Data:", JSON.stringify(data, null, 2)); // Pretty print the request data for clarity

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Sends a conversation history to the OpenAI API.
 *
 * @async
 * @function sendMessageToOpenAI
 * @param {Array} chatHistory - An array of message objects representing the conversation history.
 * Each object should have a `role` (either 'user' or 'assistant') and `content`.
 * @returns {Promise<Object>} Response data from the OpenAI API.
 * @throws Will throw an error if the request fails.
 */
export const sendMessageToOpenAI = async (chatHistory) => {
  // Prepare the request payload based on the chat history
  const requestData = {
    messages: chatHistory,
  };

  // Use the generic post method to send the request
  return postToOpenAI("/openai/query", requestData);
};
