/**
 * Sample product data for e-commerce application
 * This file contains mock product data that can be used for development and testing
 */

export const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 59.99,
    description: "High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and travelers.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 120
  },
  {
    id: 2,
    name: "Smartphone Stand & Charger",
    price: 29.99,
    description: "Adjustable smartphone stand with built-in wireless charging capability. Compatible with most smartphones.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: true,
    rating: 4.2,
    reviews: 85
  },
  {
    id: 3,
    name: "Smart Home Hub",
    price: 129.99,
    description: "Control your smart home devices with ease. Compatible with Alexa, Google Assistant, and Apple HomeKit.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: false,
    rating: 4.0,
    reviews: 62
  },
  {
    id: 4,
    name: "Ultra-Slim Laptop Bag",
    price: 49.99,
    description: "Sleek, durable, and water-resistant laptop bag with multiple compartments for accessories.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 93
  },
  {
    id: 5,
    name: "Fitness Smart Watch",
    price: 89.99,
    description: "Track your fitness goals, monitor heart rate, and receive notifications. Water-resistant and long battery life.",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 215
  },
  {
    id: 6,
    name: "Portable Power Bank",
    price: 39.99,
    description: "High-capacity power bank with fast charging capability. Charge multiple devices simultaneously.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 78
  },
  {
    id: 7,
    name: "Mechanical Keyboard",
    price: 79.99,
    description: "Tactile mechanical keyboard with customizable RGB lighting. Perfect for gamers and programmers.",
    category: "Computer Accessories",
    image: "https://images.unsplash.com/photo-1595225476474-57ff36594612?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: false,
    featured: false,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 8,
    name: "Ergonomic Office Chair",
    price: 189.99,
    description: "Comfortable ergonomic chair with lumbar support and adjustable features. Ideal for long working hours.",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 112
  },
  {
    id: 9,
    name: "Premium Wireless Earbuds",
    price: 129.99,
    description: "High-quality wireless earbuds with noise cancellation and crystal-clear sound. Perfect for music lovers and professionals on the go.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 245
  },
  {
    id: 10,
    name: "Adjustable Standing Desk",
    price: 299.99,
    description: "Electric height-adjustable desk for a healthier work environment. Smooth transition between sitting and standing positions.",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    inStock: true,
    featured: false,
    rating: 4.9,
    reviews: 87
  }
];

/**
 * Helper function to get all products
 * @returns {Array} All products
 */
export const getProducts = () => products;

/**
 * Helper function to get featured products
 * @returns {Array} Featured products only
 */
export const getFeaturedProducts = () => products.filter(product => product.featured);

// For backward compatibility
export const getAllProducts = getProducts;
export const allProducts = products;
