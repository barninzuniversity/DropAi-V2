import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Helper function to ensure admin privileges
  const ensureAdminPrivileges = (userObj) => {
    if (!userObj) return null;
    
    // Create a new object to avoid mutation issues
    return {
      ...userObj,
      isAdmin: true,
      role: 'admin'
    };
  };
  
  // Debug function to log state changes
  const logAuthState = (message, data = {}) => {
    console.log(`[AuthContext] ${message}`, {
      user,
      loading,
      isAuthenticated: !!user,
      ...data
    });
  };
  
  // Check if the user is already logged in when the app loads
  useEffect(() => {
    logAuthState('Initializing authentication');
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          let parsedUser = JSON.parse(storedUser);
          
          // Ensure admin privileges regardless of what's stored
          parsedUser = ensureAdminPrivileges(parsedUser);
          
          // Update localStorage with the admin privileges
          localStorage.setItem('user', JSON.stringify(parsedUser));
          
          setUser(parsedUser);
          logAuthState('User restored from storage with admin privileges', { parsedUser });
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('user');
          logAuthState('Failed to parse user data, removed from storage', { error });
        }
      } else {
        logAuthState('No user found in storage');
      }
    } catch (error) {
      console.error('Error checking authentication state:', error);
      logAuthState('Error in authentication initialization', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  // Register a new user
  const register = async (email, password, name) => {
    logAuthState('Attempting registration', { email, name });
    try {
      // This is just a mock implementation
      // Replace with actual API call to your backend
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user with admin privileges
      const newUser = ensureAdminPrivileges({
        id: Date.now().toString(), 
        email, 
        name
      });
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      logAuthState('Registration successful', { newUser });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      logAuthState('Registration failed', { error });
      toast.error('Registration failed: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (email, password) => {
    logAuthState('Attempting login', { email });
    try {
      // Replace with actual API call to your backend
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create admin user
      const loggedInUser = ensureAdminPrivileges({
        id: Date.now().toString(), 
        email, 
        name: 'Admin User'
      });
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      logAuthState('Login successful', { loggedInUser });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      logAuthState('Login failed', { error });
      toast.error('Login failed: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = () => {
    logAuthState('Logging out');
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    logAuthState('Logout complete');
  };
  
  // For debugging - force login as admin
  const debugLoginAsAdmin = () => {
    const adminUser = ensureAdminPrivileges({ 
      id: 'admin-debug', 
      email: 'admin@example.com', 
      name: 'Debug Admin'
    });
    
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    logAuthState('Debug admin login', { adminUser });
    toast.success('Debug: Logged in as admin');
    return true;
  };
  
  // Special function to force admin privileges for an existing user
  const makeUserAdmin = () => {
    if (!user) return;
    
    const adminUser = ensureAdminPrivileges(user);
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    logAuthState('User promoted to admin', { adminUser });
    toast.success('Admin privileges granted');
  };

  const authValues = {
    user,
    loading,
    login,
    register,
    logout,
    debugLoginAsAdmin,
    makeUserAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
