/**
 * Inventory Verification Tool
 * 
 * This utility helps diagnose issues with the inventory persistence system.
 * Include this in your project during development to debug storage problems.
 */

// Run the verification check
export const verifyInventorySystem = () => {
  try {
    console.group('🔍 Inventory System Verification');
    
    // Check localStorage
    const localData = localStorage.getItem('dropai-inventory-data');
    console.log('localStorage exists:', !!localData);
    if (localData) {
      try {
        const parsedLocal = JSON.parse(localData);
        console.log('localStorage product count:', parsedLocal.length);
        console.log('First product:', parsedLocal[0]);
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    }
    
    // Check sessionStorage
    const sessionData = sessionStorage.getItem('dropai-inventory-data');
    console.log('sessionStorage exists:', !!sessionData);
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData);
        console.log('sessionStorage product count:', parsedSession.length);
      } catch (e) {
        console.error('Failed to parse sessionStorage data:', e);
      }
    }
    
    // Check storage consistency
    if (localData && sessionData) {
      console.log('Storage consistency:', localData === sessionData ? 'MATCH ✓' : 'MISMATCH ✗');
    }
    
    // Check last save time
    const lastSaveLocal = localStorage.getItem('dropai-inventory-lastSave');
    const lastSaveSession = sessionStorage.getItem('dropai-inventory-lastSave');
    console.log('Last save (localStorage):', lastSaveLocal || 'Never');
    console.log('Last save (sessionStorage):', lastSaveSession || 'Never');
    
    // Browser storage limits
    const estimatedSize = localData ? (localData.length * 2) / 1024 : 0;
    console.log(`Estimated storage usage: ~${estimatedSize.toFixed(2)} KB`);
    if (estimatedSize > 4000) {
      console.warn('⚠️ Storage size approaching browser limits!');
    }
    
    // Storage permission check
    try {
      const testKey = '_test_storage_' + Date.now();
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      console.log('Storage write permission: ✓');
    } catch (e) {
      console.error('Storage write permission: ✗', e);
      console.warn('⚠️ No permission to write to storage! This will prevent inventory persistence.');
    }
    
    console.groupEnd();
    
    // Return verification data
    return {
      hasLocalStorage: !!localData,
      hasSessionStorage: !!sessionData,
      storageConsistent: localData === sessionData,
      lastSaveLocal,
      lastSaveSession,
      estimatedSize,
      writePermission: true
    };
  } catch (e) {
    console.error('Verification failed:', e);
    return { error: e.message };
  }
};

// Run this in browser console to check inventory data
window.checkInventory = () => {
  const verification = verifyInventorySystem();
  console.table(verification);
  
  return verification;
};

// Test that storage is working properly
window.testStorage = () => {
  console.group('🧪 Storage Test');
  try {
    // Test data
    const testData = { test: 'data', timestamp: Date.now() };
    
    // Try localStorage
    localStorage.setItem('_test_data', JSON.stringify(testData));
    const localResult = localStorage.getItem('_test_data');
    console.log('localStorage write/read:', !!localResult ? '✓' : '✗');
    localStorage.removeItem('_test_data');
    
    // Try sessionStorage
    sessionStorage.setItem('_test_data', JSON.stringify(testData));
    const sessionResult = sessionStorage.getItem('_test_data');
    console.log('sessionStorage write/read:', !!sessionResult ? '✓' : '✗');
    sessionStorage.removeItem('_test_data');
    
    console.log('Storage test completed successfully');
    console.groupEnd();
    return { localStorage: !!localResult, sessionStorage: !!sessionResult };
  } catch (e) {
    console.error('Storage test failed:', e);
    console.groupEnd();
    return { error: e.message };
  }
};

// Automatically run verification when this script loads
verifyInventorySystem();