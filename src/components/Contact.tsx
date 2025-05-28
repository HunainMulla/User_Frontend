
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gold-400 animate-fade-in">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
            Have questions about our fragrances or want to learn more about Marquez? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h3 className="text-2xl font-bold text-gold-300 mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gold-500/20 p-3 rounded-lg">
                  <Mail className="text-gold-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Email</h4>
                  <p className="text-gray-400">contact@marquez-fragrances.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gold-500/20 p-3 rounded-lg">
                  <Phone className="text-gold-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gold-500/20 p-3 rounded-lg">
                  <MapPin className="text-gold-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Address</h4>
                  <p className="text-gray-400">123 Luxury Avenue<br />New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-gold-500/10 to-gold-600/5 rounded-lg border border-gold-600/20">
              <h4 className="text-xl font-semibold text-gold-300 mb-4">Business Hours</h4>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                <p>Saturday: 10:00 AM - 6:00 PM</p>
                <p>Sunday: 12:00 PM - 5:00 PM</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gold-300 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gold-600/30 rounded-lg 
                           text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none 
                           transition-colors duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gold-300 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gold-600/30 rounded-lg 
                           text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none 
                           transition-colors duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gold-300 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gold-600/30 rounded-lg 
                           text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none 
                           transition-colors duration-300 resize-none"
                  placeholder="Tell us about your fragrance preferences or any questions you have..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-4 
                         font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 
                         transform hover:scale-105 flex items-center justify-center space-x-2
                         relative overflow-hidden group"
              >
                <span className="relative z-10">Send Message</span>
                <Send className="relative z-10" size={20} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                              transition-transform duration-700"></div>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 text-center border-t border-gold-600/20 pt-8">
          <p className="text-gray-400">
            © 2024 Marquez Fragrances. All rights reserved. | Crafted with passion for luxury.
          </p>
        </div>
      </div>
    </section>
  );
};
