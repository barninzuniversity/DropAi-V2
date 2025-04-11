// Mock product data for development
// In a real application, this would come from an API

export const featuredProducts = [
  {
    id: 1,
    name: 'Premium Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and crystal-clear sound. Perfect for music lovers and professionals on the go.',
    price: 129.99,
    discount: 15,
    rating: 4.8,
    reviews: 245,
    category: 'Electronics',
    tags: ['wireless', 'audio', 'bluetooth'],
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606220589611-53d8f3b2a7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 42,
    features: [
      'Active Noise Cancellation',
      'Bluetooth 5.2 Connectivity',
      'Up to 30 Hours Battery Life',
      'IPX7 Water Resistance',
      'Touch Controls'
    ],
    specifications: {
      brand: 'SoundCore',
      model: 'AirPro X7',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '30 hours',
      weight: '5.6g per earbud'
    }
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and smartphone notifications. Stay connected and monitor your health 24/7.',
    price: 89.99,
    discount: 0,
    rating: 4.6,
    reviews: 189,
    category: 'Fitness',
    tags: ['smartwatch', 'fitness', 'health'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 78,
    features: [
      '24/7 Heart Rate Monitoring',
      'Sleep Tracking',
      'Water Resistant up to 50m',
      '7-Day Battery Life',
      '15 Exercise Modes'
    ],
    specifications: {
      brand: 'FitTech',
      model: 'Pulse Pro',
      display: '1.3" AMOLED',
      batteryLife: '7 days',
      waterResistance: '5 ATM'
    }
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    description: 'Compact and powerful Bluetooth speaker with 360° sound and deep bass. Perfect for outdoor adventures or home entertainment.',
    price: 59.99,
    discount: 10,
    rating: 4.5,
    reviews: 132,
    category: 'Electronics',
    tags: ['speaker', 'bluetooth', 'portable'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558537348-c0f8e733989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 56,
    features: [
      '360° Sound Technology',
      '12 Hours Playtime',
      'IPX7 Waterproof',
      'Built-in Microphone',
      'Compact Design'
    ],
    specifications: {
      brand: 'SoundWave',
      model: 'Blast Mini',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '12 hours',
      weight: '340g'
    }
  },
  {
    id: 4,
    name: 'Minimalist Leather Wallet',
    description: 'Slim and elegant leather wallet with RFID protection. Holds up to 8 cards and features a convenient money clip.',
    price: 39.99,
    discount: 0,
    rating: 4.7,
    reviews: 98,
    category: 'Accessories',
    tags: ['wallet', 'leather', 'minimalist'],
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611010344444-5f9e4d86a6e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 120,
    features: [
      'Genuine Full-Grain Leather',
      'RFID Blocking Technology',
      'Holds 6-8 Cards',
      'Slim Profile Design',
      'Money Clip Included'
    ],
    specifications: {
      brand: 'Urban Craft',
      material: 'Full-Grain Leather',
      dimensions: '4.5" x 3.1" x 0.4"',
      weight: '70g',
      color: 'Vintage Brown'
    }
  },
  {
    id: 5,
    name: 'Smart Home Security Camera',
    description: 'HD security camera with motion detection, night vision, and two-way audio. Monitor your home from anywhere using the smartphone app.',
    price: 79.99,
    discount: 20,
    rating: 4.4,
    reviews: 156,
    category: 'Smart Home',
    tags: ['security', 'camera', 'smart home'],
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595676772777-79590234eb70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 35,
    features: [
      '1080p HD Video',
      'Motion Detection Alerts',
      'Night Vision',
      'Two-Way Audio',
      'Cloud Storage Option'
    ],
    specifications: {
      brand: 'SecureView',
      model: 'Guardian Pro',
      resolution: '1080p HD',
      fieldOfView: '130°',
      connectivity: 'Wi-Fi'
    }
  },
  {
    id: 6,
    name: 'Eco-Friendly Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Sustainable and stylish hydration solution.',
    price: 34.99,
    discount: 0,
    rating: 4.9,
    reviews: 215,
    category: 'Lifestyle',
    tags: ['water bottle', 'eco-friendly', 'sustainable'],
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1575377222312-dd1a1bd30674?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523362289600-a70b4a0e09a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 95,
    features: [
      'Double-Wall Vacuum Insulation',
      'Keeps Cold 24 Hours, Hot 12 Hours',
      'BPA-Free Materials',
      'Leak-Proof Design',
      'Sustainable Alternative to Plastic'
    ],
    specifications: {
      brand: 'EcoVessel',
      material: 'Stainless Steel',
      capacity: '20 oz',
      weight: '340g',
      dimensions: '9.5" x 2.8"'
    }
  }
];

// Export all products for use in other components
export const allProducts = [...featuredProducts];