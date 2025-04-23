import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiPhone } from 'react-icons/fi'

const ContactPage = () => {
  // Refs for scroll animations
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [infoRef, infoInView] = useInView({ threshold: 0.1, triggerOnce: true })

  // Contact information
  const contactInfo = [
    {
      icon: <FiMail className="text-2xl text-primary-500" />,
      title: 'Email Us',
      details: 'barninzshop@gmail.com',
      action: 'mailto:barninzshop@gmail.com',
      actionText: 'Send Email'
    },
    {
      icon: <FiPhone className="text-2xl text-primary-500" />,
      title: 'Call Us',
      details: '+216 28 647 334',
      action: 'tel:+21628647334',
      actionText: 'Call Now'
    }
  ]

  return (
    <div className="pt-24 pb-16">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container">
          <motion.div
            ref={headerRef}
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Have questions about our AI-powered shopping platform? Our team is here to help.
              Reach out to us using any of the methods below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {/* Contact Information - Now centered and more prominent */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, y: 30 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Contact Information</h2>
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={info.title}
                  className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={infoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{info.title}</h3>
                    <p className="text-gray-600 mb-3">{info.details}</p>
                    <a 
                      href={info.action} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                    >
                      {info.actionText} →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
