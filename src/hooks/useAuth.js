import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// This hook simply gets the AuthContext and returns it
// It makes using the auth functionality cleaner in components
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;