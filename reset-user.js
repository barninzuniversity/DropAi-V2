// You can run this in your browser console to reset the user data with admin privileges

(function resetUserWithAdminPrivileges() {
  // Get the current user from localStorage
  const storedUser = localStorage.getItem('user');
  
  if (storedUser) {
    try {
      // Parse the stored user data
      const userData = JSON.parse(storedUser);
      
      // Update with admin privileges
      const adminUser = {
        ...userData,
        isAdmin: true,
        role: 'admin'
      };
      
      // Save back to localStorage
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      console.log('✅ User updated with admin privileges:', adminUser);
      console.log('Please refresh the page to see the changes.');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  } else {
    console.log('No user found in localStorage.');
  }
})();