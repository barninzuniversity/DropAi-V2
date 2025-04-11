import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiAward, FiTrendingUp, FiUsers, FiTarget, FiCpu, FiShield } from 'react-icons/fi'

const AboutPage = () => {
  // Refs for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [missionRef, missionInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true })

  // Team members data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      bio: 'Former AI researcher with a passion for e-commerce and customer experience.'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      bio: 'Machine learning expert specializing in recommendation systems and personalization.'
    },
    {
      name: 'Marcus Williams',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      bio: 'E-commerce veteran with over 10 years of experience in product management.'
    },
    {
      name: 'Leila Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      bio: 'Supply chain expert who has optimized logistics for major e-commerce platforms.'
    }
  ]

  // AI features
  const aiFeatures = [
    {
      icon: <FiTarget className="text-3xl text-primary-500" />,
      title: 'Personalized Recommendations',
      description: 'Our AI analyzes your preferences and browsing history to suggest products you\'ll love.'
    },
    {
      icon: <FiTrendingUp className="text-3xl text-primary-500" />,
      title: 'Dynamic Pricing',
      description: 'Smart algorithms optimize pricing based on market trends, demand, and your shopping patterns.'
    },
    {
      icon: <FiCpu className="text-3xl text-primary-500" />,
      title: 'Smart Search',
      description: 'Natural language processing helps you find exactly what you\'re looking for, even with complex queries.'
    },
    {
      icon: <FiUsers className="text-3xl text-primary-500" />,
      title: 'Customer Insights',
      description: 'We learn from customer feedback to continuously improve our product selection and service.'
    },
    {
      icon: <FiShield className="text-3xl text-primary-500" />,
      title: 'Fraud Protection',
      description: 'Advanced AI systems protect your transactions and personal information.'
    },
    {
      icon: <FiAward className="text-3xl text-primary-500" />,
      title: 'Quality Assurance',
      description: 'Our AI vets suppliers and products to ensure you receive only the highest quality items.'
    }
  ]

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container">
          <motion.div
            ref={heroRef}
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">DropAI</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              We're revolutionizing online shopping with artificial intelligence, creating a personalized
              experience that connects you with products you'll love from around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              ref={missionRef}
              initial={{ opacity: 0, x: -50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At DropAI, we believe that shopping should be effortless, enjoyable, and tailored to your unique preferences.
                Our mission is to harness the power of artificial intelligence to create the most personalized shopping
                experience possible.
              </p>
              <p className="text-gray-700 mb-6">
                We're not just another e-commerce platform. We're building a smart shopping assistant that learns what you love,
                discovers products that match your style, and ensures they're delivered to your door with minimal environmental impact.
              </p>
              <p className="text-gray-700">
                By combining cutting-edge AI technology with a curated selection of high-quality products from around the world,
                we're creating a new kind of shopping experience that's as unique as you are.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="Our team working on AI solutions"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 rounded-lg z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent-100 rounded-full z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our AI-Powered Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We leverage advanced artificial intelligence to create a shopping experience that's
              smarter, more intuitive, and tailored to your preferences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            ref={teamRef}
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a diverse group of experts in AI, e-commerce, and supply chain management,
              united by our passion for creating the future of online shopping.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage