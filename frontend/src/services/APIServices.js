/**
 * @fileoverview Service to interact with the FitGraph API.
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

import axios from 'axios';

const aquaMindProdURL = process.env.REACT_APP_AQUAMIND_PROD_URL
axios.defaults.headers.common['X-Api-Key'] = process.env.REACT_APP_AQUAMIND_PROD_KEY

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
    const url = `${aquaMindProdURL}${endpoint}`; // Construct the full URL
    
    // Log the request details before making the request
    console.log('Making GET request to:', url);
    console.log('Request Headers:', {
      'X-Api-Key': process.env.REACT_APP_AQUAMIND_PROD_KEY, 
    });
    
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Api-Key': process.env.REACT_APP_AQUAMIND_PROD_KEY,
        },
      });
  
      // Log the response status and data
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.error('Response Error:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // Request made but no response received
        console.error('Request Error:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error', error.message);
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
    const url = `${aquaMindProdURL}${endpoint}`; // Construct the full URL
    
    // Log the request details before making the request
    console.log('Making POST request to:', url);
    console.log('Request Data:', data);
    console.log('Request Headers:', {
      'Content-Type': 'application/json', 
    });
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json', 
          'X-Api-Key': process.env.REACT_APP_AQUAMIND_PROD_KEY, 
        },
      });
      
      // Log the response status and data
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.error('Response Error:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // Request made but no response received
        console.error('Request Error:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error', error.message);
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
    return getFromAPI('/health');
  };  