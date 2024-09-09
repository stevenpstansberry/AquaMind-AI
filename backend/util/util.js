/**
 * @fileoverview Utility function for building HTTP responses for AWS Lambda.
 * 
 * @file backend/utils/util.js
 * 
 * Provides the `buildResponse()` function to create standardized HTTP responses 
 * with CORS headers for API Gateway and AWS Lambda integrations.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

/**
 * Builds a standardized HTTP response for AWS Lambda functions.
 * 
 * @function buildResponse
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {Object} body - The body of the response.
 * @returns {Object} The formatted HTTP response object with headers.
 * 
 * @description
 * This function creates a standardized HTTP response object for AWS Lambda functions
 * that integrates with API Gateway. It includes CORS headers to allow cross-origin
 * requests, supporting a variety of HTTP methods and headers.
 */
function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  }
  
  module.exports.buildResponse = buildResponse;
  