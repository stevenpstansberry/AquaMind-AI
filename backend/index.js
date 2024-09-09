/**
 * @fileoverview Main entry point for the backend API handler. 
 * This file is responsible for handling all API request routing
 * and determining which service to invoke based on the request path and method.
 * 
 * @file backend/index.js
 * 
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

// imports
const util = require('./utils/util');





// Define API paths
const healthPath = '/health';



let username;

/**
 * AWS Lambda handler for processing API requests.
 * @param {Object} event - The incoming API Gateway request event.
 * @returns {Object} - API Gateway-compatible HTTP response.
 */
exports.handler = async (event) => {
    console.log('Request Event: ', event); // Log the event

    let response;
    switch(true) {
        // Health check route to verify server is running
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200, {message: 'health check reached'});
            break;


        // Default - All other routes
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};