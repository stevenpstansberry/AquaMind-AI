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

const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * Sends a GET request to a specified API endpoint.
 *
 * @async
 * @function getFromAPI
 * @param {string} endpoint - The API endpoint to send the GET request to.
 * @param {Object} [options={}] - Optional configurations (e.g., headers).
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const getFromAPI = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making GET request to:", url);

  try {
    const response = await axios.get(url, options);

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    handleAPIError(error);
  }
};

/**
 * Sends a POST request to a specified API endpoint with data.
 *
 * @async
 * @function postToAPI
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @param {Object} [options={}] - Optional configurations (e.g., headers).
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const postToAPI = async (endpoint, data, options = {}) => {
  const url = `${baseURL}${endpoint}`; // Construct the full URL

  console.log("Making POST request to:", url);
  console.log("Request Data:", data);
  console.log("Request Headers:", options.headers || {});

  try {
    const response = await axios.post(url, data, options);

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.log("Response Headers:", response.headers);

    return response.data;
  } catch (error) {
    handleAPIError(error);
  }
};

/**
 * Sends a PUT request to a specified API endpoint with data.
 *
 * @async
 * @function putToAPI
 * @param {string} endpoint - The API endpoint to send the PUT request to.
 * @param {Object} data - The data to be sent in the body of the PUT request.
 * @param {Object} [options={}] - Optional configurations (e.g., headers).
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const putToAPI = async (endpoint, data, options = {}) => {
  const url = `${baseURL}${endpoint}`;

  console.log("Making PUT request to:", url);
  console.log("Request Data:", data);

  try {
    const response = await axios.put(url, data, options);

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    handleAPIError(error);
  }
};

/**
 * Sends a DELETE request to a specified API endpoint.
 *
 * @async
 * @function delFromAPI
 * @param {string} endpoint - The API endpoint to send the DELETE request to.
 * @param {Object} [options={}] - Optional configurations (e.g., headers).
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const delFromAPI = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;

  console.log("Making DELETE request to:", url);

  try {
    const response = await axios.delete(url, options);

    console.log("Response Status:", response.status);

    return response.data;
  } catch (error) {
    handleAPIError(error);
  }
};

/**
 * Handles API errors by logging detailed information and re-throwing the error.
 *
 * @function handleAPIError
 * @param {Object} error - The error object caught from the API request.
 * @throws Will re-throw the provided error after logging.
 */
const handleAPIError = (error) => {
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
 * Registers or logs in a user via Google OAuth by sending a POST request to the API.
 *
 * @async
 * @function OAuthGoogle
 * @param {Object} JWT - The JWT token provided by Google.
 * @returns {Promise<Object>} Response data from the API, including the JWT token.
 */
export const OAuthGoogle = async (JWT) => {
  return postToAPI("/oauth", JWT);
};

/**
 * Registers a new user by sending a POST request to the API.
 *
 * @async
 * @function registerUser
 * @param {Object} userData - The user data for registration (email, password, firstName).
 * @returns {Promise<Object>} Response data from the API, including the JWT token.
 */
export const registerUser = async (userData) => {
  return postToAPI("/register", userData);
};

/**
 * Registers a new user by sending a POST request to the API.
 *
 * @async
 * @function editUser
 * @param {Object} userData - The user data for registration (email, password, firstName).
 * @returns {Promise<Object>} Response data from the API
 */
export const editUser = async (userData) => {
  return putToAPI("/editUser", userData);
};

/**
 * Registers a new user by sending a POST request to the API.
 *
 * @async
 * @function deleteUser
 * @param {Object} userData - The user data for registration (email, password, firstName).
 * @returns {Promise<Object>} Response data from the API
 */
export const deleteUser = async (userData) => {
  return delFromAPI("/deleteUser", userData);
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
 * @param {Object} aquariumData - The aquarium data.
 * @returns {Promise<Object>} Response data from the API.
 */
export const createAquarium = async (aquariumData) => {
  return postToAPI("/aquariums", aquariumData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
    },
  });
};

/**
 * Retrieves all aquariums for the authenticated user.
 *
 * @async
 * @function getUserAquariums
 * @returns {Promise<Array>} An array of aquarium objects.
 */
export const getUserAquariums = async () => {
  return getFromAPI("/user/aquariums", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

/**
 * Retrieves a specific aquarium by ID for the authenticated user.
 *
 * @async
 * @function getAquariumById
 * @param {string} aquariumId - The ID of the aquarium to retrieve.
 * @returns {Promise<Object>} The aquarium object.
 */
export const getAquariumById = async (aquariumId) => {
  return getFromAPI(`/aquariums/${aquariumId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

/**
 * Retrieves a specific aquarium by ID for the authenticated user.
 *
 * @async
 * @function getDetailsById
 * @param {string} detailsId - The ID of the aquarium to retrieve.
 * @param {string} type - The type of the item which details are being retrieved. (species, plant, equipment)
 * @returns {Promise<Object>} The aquarium object.
 */
export const getDetailsById = async (detailsId, type) => {
  return getFromAPI(`/details/${detailsId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "X-Detail-Type": `${type}`,
    },
  });
};

/**
 * Retrieves a specific aquarium by ID for the authenticated user.
 *
 * @async
 * @function getAllDetails
 * @param {string} type - The type of the item which details are being retrieved. (species, plants, equipment)
 * @returns {Promise<Object>} The aquarium object.
 */
export const getAllDetails = async (type) => {
  return getFromAPI(`/details/all/${type}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "X-Detail-Type": `${type}`,
    },
  });
};

/**
 * Updates an existing aquarium by sending a PUT request to the API.
 *
 * @async
 * @function updateAquarium
 * @param {string} aquariumId - The ID of the aquarium to update.
 * @param {Object} aquariumData - The updated aquarium data.
 * @returns {Promise<Object>} Response data from the API.
 */
export const updateAquarium = async (aquariumId, aquariumData) => {
  const stripData = (items) =>
    items.map((item) => {
      const { id, count, name } = item;
      return { id, count, name };
    });

  // Create a deep copy of aquariumData
  const aquariumDataCopy = JSON.parse(JSON.stringify(aquariumData));

  if (aquariumDataCopy.species) {
    aquariumDataCopy.species = stripData(aquariumDataCopy.species);
  }

  if (aquariumDataCopy.plants) {
    aquariumDataCopy.plants = stripData(aquariumDataCopy.plants);
  }

  console.log("Aquarium data copy: ", aquariumDataCopy);

  return putToAPI(`/aquariums/${aquariumId}`, aquariumDataCopy, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

/**
 * Deletes an aquarium by sending a DELETE request to the API.
 *
 * @async
 * @function deleteAquarium
 * @param {string} aquariumId - The ID of the aquarium to delete.
 * @returns {Promise<Object>} Response data from the API.
 */
export const deleteAquarium = async (aquariumId) => {
  return delFromAPI(`/aquariums/${aquariumId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const openai_base_url = process.env.REACT_APP_OPENAI_API_URL;

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
  const url = `${openai_base_url}${endpoint}`; // Base URL + endpoint

  console.log("Making POST request to:", url);
  console.log("Request Data:", JSON.stringify(data, null, 2)); // Pretty print the request data for clarity

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": openaiKey,
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
