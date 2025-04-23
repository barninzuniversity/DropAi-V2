// Sample product data
export const allProducts = [
  {
    id: "1", // Consistent string IDs
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    discount: 15,
    category: "Audio",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.2 connectivity",
      "Built-in voice assistant",
      "Foldable design"
    ],
    specifications: {
      brand: "SoundMaster",
      model: "WH-1000XM5",
      weight: "250g",
      batteryLife: "30 hours",
      warranty: "2 years"
    },
    rating: 4.8,
    reviews: 254,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29"
    ]
  },
  {
    id: "2",
    name: "Smart Fitness Tracker Watch",
    price: 199.95,
    discount: 0,
    category: "Wearables",
    description: "Advanced fitness tracking smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
    features: [
      "24/7 heart rate monitoring",
      "Built-in GPS",
      "Sleep quality analysis",
      "Water resistant to 50m",
      "7-day battery life"
    ],
    specifications: {
      brand: "FitTech",
      model: "Pulse Pro",
      weight: "48g",
      displaySize: "1.4 inches",
      warranty: "1 year"
    },
    rating: 4.6,
    reviews: 189,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1559311648-d9ef129ab432"
    ]
  },
  {
    id: "3",
    name: "Professional Camera Drone",
    price: 1299.00,
    discount: 10,
    category: "Photography",
    description: "High-performance drone with 4K camera, 3-axis gimbal, obstacle avoidance, and 30-minute flight time.",
    features: [
      "4K camera with 3-axis gimbal",
      "Intelligent obstacle avoidance",
      "30-minute flight time",
      "5km transmission range",
      "Follow-me mode"
    ],
    specifications: {
      brand: "AirVision",
      model: "Explorer Pro",
      weight: "950g",
      maxSpeed: "65 km/h",
      warranty: "1 year"
    },
    rating: 4.9,
    reviews: 98,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1524143986875-3b098d911b80",
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
    ]
  },
  {
    id: "4",
    name: "Ultra-Thin Laptop",
    price: 1499.00,
    discount: 5,
    category: "Computers",
    description: "Premium ultra-thin laptop with 14-inch 4K display, 16GB RAM, 1TB SSD, and all-day battery life.",
    features: [
      "14-inch 4K touch display",
      "16GB RAM, 1TB SSD",
      "Intel Core i7 processor",
      "12-hour battery life",
      "Backlit keyboard"
    ],
    specifications: {
      brand: "TechPro",
      model: "UltraBook X14",
      weight: "1.2kg",
      processor: "Intel Core i7-1165G7",
      warranty: "2 years"
    },
    rating: 4.7,
    reviews: 156,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f"
    ]
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    price: 349.95,
    discount: 0,
    category: "Furniture",
    description: "Fully adjustable ergonomic office chair with lumbar support, breathable mesh back, and padded armrests.",
    features: [
      "Adjustable lumbar support",
      "Breathable mesh back",
      "Padded armrests",
      "360° swivel",
      "Weight capacity: 150kg"
    ],
    specifications: {
      brand: "ComfortPlus",
      model: "ErgoFlex Pro",
      weight: "15kg",
      material: "Mesh and high-density foam",
      warranty: "5 years"
    },
    rating: 4.5,
    reviews: 87,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1573767291321-c0af2eaf5266",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8"
    ]
  }
]

// Export functions to get products
export const getProducts = (limit = undefined) => {
  if (limit) {
    return allProducts.slice(0, limit);
  }
  return allProducts;
}

// Add the getAllProducts function that EnhancedSearch is trying to import
export const getAllProducts = () => {
  return allProducts;
}

export const getProductById = (id) => {
  // Ensure we're comparing strings to strings
  const productId = String(id);
  return allProducts.find(p => String(p.id) === productId);
}

export const getRelatedProducts = (productId, limit = 4) => {
  // Get current product to find its category
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];
  
  // Find products in the same category, excluding the current product
  const relatedProducts = allProducts
    .filter(p => p.category === currentProduct.category && String(p.id) !== String(productId))
    .slice(0, limit);
    
  // If not enough related products, add random products from other categories
  if (relatedProducts.length < limit) {
    const remainingCount = limit - relatedProducts.length;
    const otherProducts = allProducts
      .filter(p => p.category !== currentProduct.category && String(p.id) !== String(productId))
      .slice(0, remainingCount);
      
    return [...relatedProducts, ...otherProducts];
  }
  
  return relatedProducts;
}
