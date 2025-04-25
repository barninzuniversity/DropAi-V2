/**
 * Utility script to set up an admin account
 * Run this in your browser console to set up an admin account
 */

function setupAdminAccount() {
  // Get the current user from localStorage
  const storedUser = localStorage.getItem('auth-storage');
  
  if (storedUser) {
    try {
      // Parse the stored user data
      const userData = JSON.parse(storedUser);
      
      // Update with admin privileges
      const adminUser = {
        ...userData,
        state: {
          ...userData.state,
          user: {
            ...userData.state.user,
            role: 'admin'
          }
        }
      };
      
      // Save back to localStorage
      localStorage.setItem('auth-storage', JSON.stringify(adminUser));
      
      console.log('✅ User updated with admin privileges:', adminUser.state.user);
      console.log('Please refresh the page to see the changes.');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  } else {
    console.log('No user found in localStorage. Please log in first.');
  }
}

// Export the function
export default setupAdminAccount; 