import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export function EscrowTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "E-commerce Business Owner",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Using this escrow service transformed our international transactions. We've seen a 40% increase in cross-border sales because customers trust the payment process.",
      rating: 5,
      highlight: "40% increase in sales"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Freelance Developer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "As a freelancer, payment security is everything. This platform gives my clients confidence and ensures I get paid fairly for my work. The dispute resolution saved me $5,000 on one project alone.",
      rating: 5,
      highlight: "Saved $5,000"
    },
    {
      id: 3,
      name: "David Rodriguez",
      role: "Import/Export Manager",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      content: "We process six-figure transactions weekly. The enterprise features give us complete control while keeping everything secure. The 24/7 support has been invaluable for our global operations.",
      rating: 5,
      highlight: "Six-figure security"
    },
    {
      id: 4,
      name: "Emily Wilson",
      role: "Small Business Owner",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      content: "The simple interface made escrow accessible for my first big wholesale order. I felt protected throughout the entire $25,000 transaction. Now I use it for all my business deals.",
      rating: 4,
      highlight: "$25,000 transaction"
    },
    {
      id: 5,
      name: "James Park",
      role: "Tech Startup CEO",
      avatar: "https://randomuser.me/api/portraits/men/81.jpg",
      content: "Integrating their API was seamless. We now offer escrow directly in our SaaS platform, creating new revenue streams. Their developer documentation is excellent.",
      rating: 5,
      highlight: "API integration"
    }
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section id="testimonials" className="relative py-20 bg-gradient-to-br from-gray-50 to-green-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 overflow-hidden">
        <div className="absolute top-0 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our users say about their experience.
          </p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="relative">
          {/* Desktop testimonials grid */}
          <div className="hidden md:grid grid-cols-3 gap-8 mb-12">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start mb-6">
                  <Quote className="w-8 h-8 text-green-500 opacity-20" />
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-full inline-block">
                  {testimonial.highlight}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile testimonial carousel */}
          <div className="md:hidden">
            <motion.div
              key={testimonials[activeIndex].id}
              className="bg-white p-8 rounded-xl shadow-sm mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start mb-6">
                <Quote className="w-8 h-8 text-green-500 opacity-20" />
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonials[activeIndex].content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[activeIndex].role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-full inline-block">
                {testimonials[activeIndex].highlight}
              </div>
            </motion.div>

            <div className="flex justify-center items-center space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full ${activeIndex === index ? 'bg-green-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-20 bg-white rounded-2xl shadow-sm p-8 md:p-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Join Our Community of Trusted Users
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Rated excellent by businesses and individuals worldwide
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                <p className="text-gray-600 text-sm">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
                <p className="text-gray-600 text-sm">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$250M+</div>
                <p className="text-gray-600 text-sm">In Transactions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-gray-600 text-sm">Customer Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}