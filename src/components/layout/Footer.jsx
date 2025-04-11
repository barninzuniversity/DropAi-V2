import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiArrowRight } from 'react-icons/fi'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // In a real app, you would send this to your API
      console.log('Subscribing email:', email)
      setIsSubscribed(true)
      setEmail('')
      
      // Reset subscription status after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }
  }

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', path: '/products' },
        { name: 'New Arrivals', path: '/products?category=new' },
        { name: 'Best Sellers', path: '/products?category=best-sellers' },
        { name: 'Deals & Promotions', path: '/products?category=deals' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Shipping & Returns', path: '/shipping' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' },
      ],
    },
  ]

  const socialLinks = [
    { name: 'Instagram', icon: <FiInstagram />, url: 'https://instagram.com' },
    { name: 'Facebook', icon: <FiFacebook />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <FiTwitter />, url: 'https://twitter.com' },
    { name: 'YouTube', icon: <FiYoutube />, url: 'https://youtube.com' },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-block mb-6">
                <span className="text-2xl font-bold font-heading">DropAI</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Discover the future of online shopping with our AI-powered dropshipping platform. 
                We connect you with premium products from around the world, personalized just for you.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                    aria-label={social.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((column, columnIndex) => (
            <div key={column.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * columnIndex }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * linkIndex + 0.2 * columnIndex }}
                      viewport={{ once: true }}
                    >
                      <Link 
                        to={link.path} 
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 pb-4"
        >
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400 mb-6">Get the latest updates on new products and upcoming sales</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="input bg-gray-800 border-gray-700 text-white placeholder-gray-500 flex-grow"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-primary whitespace-nowrap"
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : (
                  <>
                    Subscribe <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          <p>&copy; {new Date().getFullYear()} DropAI. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer