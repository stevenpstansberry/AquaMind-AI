

/**
 *  Retrieves currently logged in user from local storage
 * 
 * @function getUser
 * @returns {string | null} - The currently logged in user, or null if no user is logged in
 */
export const getUser = (): string | null => {
  return localStorage.getItem('user');
}
