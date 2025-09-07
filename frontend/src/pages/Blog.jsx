import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Prime Investment Opportunities in Noida 2025",
      content:
        "Discover the most lucrative real estate investment zones in Mumbai with expert market analysis and projected returns for smart investors. From luxury residential projects to commercial hotspots, we cover key areas, growth trends, and insights to maximize your returns.",
      date: "August 21, 2024",
      image:
        "https://media.istockphoto.com/id/1150545984/photo/upscale-modern-mansion-with-pool.jpg?s=612x612&w=0&k=20&c=JT7qSGgmlGfiNiqJE2jw6rYwRcYCj9KBs7i2Rmyyypo=",
      category: "Investment",
      author: "ZipAcres Team",
    },
    {
      id: 2,
      title: "Complete Home Loan Guide: Tips & Tricks",
      content:
        "Master the art of securing the best home loan deals. Learn about documentation, credit score optimization, negotiation strategies, and tips for first-time buyers. Ensure you get the lowest interest rates and suitable repayment plans for a stress-free home buying experience.",
      date: "August 18, 2024",
      image:
        "https://media.istockphoto.com/id/1398608729/video/luxury-real-estate-at-twilight.jpg?s=640x640&k=20&c=4THof-AeWzEMr8nDWMEe_O9XuD1mrbycK9Ehg13Rr4I=",
      category: "Finance",
      author: "ZipAcres Team",
    },
    {
      id: 3,
      title: "Luxury Interior Trends Transforming Homes",
      content:
        "Explore cutting-edge interior design trends that are transforming modern living spaces. From sustainable materials to smart home integration, discover how these trends enhance both aesthetics and functionality in your dream home.",
      date: "August 15, 2025",
      image:
        "https://media.istockphoto.com/id/1687777643/photo/woman-buying-or-rent-new-home-she-holding-key-front-of-new-house-surprise-happy-young-asian.jpg?s=612x612&w=0&k=20&c=JnGYSz7i8mDrzNt3MqYPwx8MvtyUBvF1qCoHhfpLZos=",
      category: "Design",
      author: "ZipAcres Team",
    },
    {
      id: 4,
      title: "Smart City Projects: Future of Real Estate",
      content:
        "Government smart city initiatives are reshaping property values and creating new investment hotspots across major Indian cities. Learn how infrastructure, technology, and urban planning can influence your investment decisions and property appreciation.",
      date: "August 12, 2025",
      image:
        "https://media.istockphoto.com/id/468840563/photo/brother-and-sister-holding-hands-on-beach-path.jpg?s=612x612&w=0&k=20&c=o3MJw2YxcO1fQPMSSCcBiNzHMtDWQIB476dm6WMU-Ls=",
      category: "Technology",
      author: "ZipAcres Team",
    },
  ];

  const trustedCustomers = [
    {
      id: 1,
      name: "Amit Verma",
      image: "/images/rel1.jpeg",
      location: "Delhi",
      property: "Villa",
    },
    {
      id: 2,
      name: "Rashika Jha",
      image: "/images/rel2.jpeg",
      location: "Noida",
      property: "Apartment",
    },
    {
      id: 3,
      name: "Vikash Kumar",
      image: "/images/rel3.jpeg",
      location: "Meerut",
      property: "Office Space",
    },
    {
      id: 4,
      name: "Sarah Sha",
      image: "/images/rel4.jpeg",
      location: "Faridabad",
      property: "Flat",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-200  min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-br from-gray-300 rounded-2xl shadow-2xl border border-gray-200 p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-zinc-100 shadow-md mb-4">
              <svg
                className="w-8 h-8 text-indigo-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-900 mb-2">
              Unlock Zipacres Wisdom
            </h1>
            <p className="text-md text-gray-500 max-w-3xl mx-auto tracking-tigher">
              From market deep-dives to home decor trends, get the expert advice
              you need to navigate your real estate journey with confidence.
            </p>
          </div>
        </motion.div>

        {/* Blog Posts */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="group bg-zinc-200 rounded-3xl shadow-lg transition-all duration-500 overflow-hidden border border-gray-100"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="p-8">
                <div className="flex items-center text-sm text-zinc-800 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>By {post.author}</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-700 mb-4">
                  {post.title}
                </h3>
                <p className="text-zinc-600 tracking-tight leading-relaxed">{post.content}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted Customers */}
        <motion.div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-900 mb-1">
            Trusted Customers
          </h2>
          <p className="text-lg text-gray-500 tracking-tight mx-auto">
            Join thousands of satisfied customers who found their dream
            properties with us
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {trustedCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              variants={cardVariants}
              className="group bg-blue-900 rounded-2xl transition-all duration-500 overflow-hidden border border-gray-200"
            >
              <img
                src={customer.image}
                alt={customer.name}
                className="w-full h-48 object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-500"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-white">
                  {customer.name}
                </h3>
                <p className="text-sm text-white ">
                  {customer.location}{" "}
                </p>

                <p className="text-base text-blue-300 font-semibold">
                  {customer.property}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* YouTube Video */}
        <motion.div className="relative max-w-4xl  mx-auto rounded-3xl overflow-hidden shadow-2xl mb-24">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/8-GwOifS2MA?autoplay=1&mute=1&loop=1&playlist=8-GwOifS2MA&controls=1&rel=0&modestbranding=1"
              title="Real Estate Success Stories"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
