import React, { useState,useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send, Globe, Instagram, Facebook, Twitter } from 'lucide-react';

const Contact = () => {

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-gold-400" />, 
      title: "Email Us",
      details: "info@marquezperfumes.com",
      subdetails: "support@marquezperfumes.com"
    },
    {
      icon: <Phone className="w-6 h-6 text-gold-400" />,
      title: "Call Us",
      details: "+91 7775032268",
      subdetails: "Mon - Fri, 9AM - 6PM EST"
    },
    {
      icon: <MapPin className="w-6 h-6 text-gold-400" />,
      title: "Visit Us",
      details: "Mumbai, Maharashtra, India",
      subdetails: "Chichani Khadinaka"
    },
    {
      icon: <Clock className="w-6 h-6 text-gold-400" />,
      title: "Store Hours",
      details: "Mon - Sat: 10AM - 8PM",
      subdetails: "Sunday: 12PM - 6PM"
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, name: "Instagram", link: "#" },
    { icon: <Facebook className="w-6 h-6" />, name: "Facebook", link: "#" },
    { icon: <Twitter className="w-6 h-6" />, name: "Twitter", link: "#" },
    { icon: <Globe className="w-6 h-6" />, name: "Website", link: "#" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent Successfully! ✨",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gold-400 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              We'd love to hear from you. Get in touch with our team for any questions, 
              custom fragrance requests, or personalized consultations.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={info.title}
                className="text-center bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 
                         hover:border-gold-400/50 transition-all duration-300 transform hover:scale-105
                         animate-slide-up"
                style={{animationDelay: `${0.4 + index * 0.1}s`}}
              >
                <div className="flex justify-center mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold text-gold-400 mb-2">{info.title}</h3>
                <p className="text-gray-300 text-sm mb-1">{info.details}</p>
                <p className="text-gray-400 text-xs">{info.subdetails}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up" style={{animationDelay: '0.8s'}}>
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 hover:border-gold-400/20 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gold-400 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                                 transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                               text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                               transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3
                               text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                               transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-4 
                             font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 
                             transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:hover:scale-100 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={18} />
                          Send Message
                        </>
                      )}
                    </span>
                    {!isSubmitting && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-700"></div>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="animate-slide-up" style={{animationDelay: '1.0s'}}>
              {/* Location Map Placeholder */}
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 mb-8 hover:border-gold-400/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gold-400 mb-4">Visit Our Flagship Store</h3>
                <div className="bg-gray-800/50 rounded-lg p-6 mb-4">
                  <div className="text-6xl text-center mb-4">🏢</div>
                  <p className="text-gray-300 text-center">
                    Experience our fragrances in person at our luxurious flagship store in the heart of Chinchani, Maharashtra, India.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>Address:</strong> Chinchani, Maharashtra, India 401503</p>
                  <p><strong>Nearest Subway:</strong> Times Square - 42nd Street</p>
                  {/* <p><strong>Parking:</strong> Valet parking available</p> */}
                </div>
              </div>

              {/* Services */}
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 mb-8 hover:border-gold-400/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gold-400 mb-4">Our Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span className="text-gray-300">Personal Fragrance Consultation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span className="text-gray-300">Custom Fragrance Creation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span className="text-gray-300">Gift Wrapping & Personalization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span className="text-gray-300">Fragrance Education Workshops</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span className="text-gray-300">Corporate & Bulk Orders</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 hover:border-gold-400/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gold-400 mb-4">Follow Us</h3>
                <p className="text-gray-300 mb-6">
                  Stay connected and discover the latest fragrances, behind-the-scenes content, and exclusive offers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.link}
                      className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg 
                               hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-gold-400">{social.icon}</span>
                      <span className="text-gray-300 text-sm">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 animate-slide-up" style={{animationDelay: '1.2s'}}>
            <h2 className="text-3xl font-bold text-center text-gold-400 mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Do you offer custom fragrances?",
                  answer: "Yes! We specialize in creating bespoke fragrances tailored to your preferences. Book a consultation to start your custom fragrance journey."
                },
                {
                  question: "What is your return policy?",
                  answer: "We offer a 30-day return policy for unopened items. For opened fragrances, we provide store credit within 14 days of purchase."
                },
                {
                  question: "Do you ship internationally?",
                  answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by location. Free shipping on orders over $150 within the US."
                },
                {
                  question: "How long do your fragrances last?",
                  answer: "Our fragrances are designed to last 6-8 hours on the skin. Longevity can vary based on skin type, application method, and environmental factors."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 hover:border-gold-400/20 transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-gold-400 mb-3">{faq.question}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 