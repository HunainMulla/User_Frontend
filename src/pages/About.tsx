import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Star, Award, Heart, Leaf, Globe, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Award className="w-8 h-8 text-gold-400" />,
      title: "Excellence",
      description: "We pursue perfection in every fragrance, using only the finest ingredients sourced from around the world."
    },
    {
      icon: <Heart className="w-8 h-8 text-gold-400" />,
      title: "Passion",
      description: "Our love for fragrance drives us to create scents that evoke emotions and create lasting memories."
    },
    {
      icon: <Leaf className="w-8 h-8 text-gold-400" />,
      title: "Sustainability",
      description: "We're committed to ethical sourcing and sustainable practices in our fragrance creation process."
    },
    {
      icon: <Globe className="w-8 h-8 text-gold-400" />,
      title: "Global Heritage",
      description: "Drawing inspiration from cultures worldwide to create unique and captivating fragrance experiences."
    }
  ];

  const milestones = [
    {
      year: "1995",
      title: "The Beginning",
      description: "Founded with a vision to create luxury fragrances that tell stories and evoke emotions."
    },
    {
      year: "2005",
      title: "International Expansion",
      description: "Expanded to international markets, bringing our signature scents to fragrance lovers worldwide."
    },
    {
      year: "2015",
      title: "Innovation in Craft",
      description: "Introduced revolutionary fragrance blending techniques and sustainable packaging solutions."
    },
    {
      year: "2024",
      title: "Digital Excellence",
      description: "Launched our premium online experience, making luxury fragrances accessible to all."
    }
  ];

  const team = [
    {
      name: "Elena Marquez",
      role: "Master Perfumer",
      image: "👩‍🔬",
      description: "With over 20 years of experience, Elena leads our fragrance creation with unmatched expertise."
    },
    {
      name: "Alessandro Torres",
      role: "Creative Director",
      image: "👨‍🎨",
      description: "Alessandro brings artistic vision to every bottle, ensuring each fragrance tells a unique story."
    },
    {
      name: "Sophia Chen",
      role: "Sustainability Officer",
      image: "🌱",
      description: "Sophia ensures our commitment to environmental responsibility in every aspect of our business."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gold-400 animate-fade-in">
              About Marquez
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              Where passion meets artistry, and every fragrance tells a story of luxury, 
              craftsmanship, and timeless elegance.
            </p>
          </div>

          {/* Brand Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
              <h2 className="text-4xl font-bold text-gold-400 mb-6">Our Story</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Born from a passion for creating extraordinary olfactory experiences, Marquez has been 
                crafting luxury fragrances for nearly three decades. Our journey began with a simple 
                belief: that scent has the power to transport, to inspire, and to create lasting memories.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Each bottle represents countless hours of dedication, from sourcing the finest raw materials 
                to the meticulous blending process that creates our signature scents. We don't just make 
                perfumes; we craft experiences that become part of your personal story.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-400">29</div>
                  <div className="text-gray-400 text-sm">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-400">150+</div>
                  <div className="text-gray-400 text-sm">Unique Fragrances</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-400">50k+</div>
                  <div className="text-gray-400 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
              <div className="text-9xl mb-6">🏛️</div>
              <p className="text-gray-400 italic">
                "Fragrance is the key to our memories, the bridge to our emotions"
              </p>
              <p className="text-gold-400 font-semibold mt-2">- Elena Marquez, Master Perfumer</p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gold-400 mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="text-center bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 
                           hover:border-gold-400/50 transition-all duration-300 transform hover:scale-105
                           animate-slide-up"
                  style={{animationDelay: `${0.8 + index * 0.1}s`}}
                >
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gold-400 mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gold-400 mb-12">Our Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gold-400 to-gold-600"></div>
              
              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-slide-up`}
                    style={{animationDelay: `${1.2 + index * 0.2}s`}}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-gray-900/50 border border-gold-600/20 rounded-lg p-6 hover:border-gold-400/50 transition-all duration-300">
                        <div className="text-2xl font-bold text-gold-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-3">{milestone.title}</h3>
                        <p className="text-gray-300">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline node */}
                    <div className="relative z-10 w-4 h-4 bg-gold-400 rounded-full border-4 border-black"></div>
                    
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gold-400 mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="text-center bg-gray-900/50 border border-gold-600/20 rounded-lg p-8 
                           hover:border-gold-400/50 transition-all duration-300 transform hover:scale-105
                           animate-slide-up"
                  style={{animationDelay: `${1.6 + index * 0.1}s`}}
                >
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gold-400 mb-2">{member.name}</h3>
                  <p className="text-gray-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-600/30 rounded-lg p-12 animate-slide-up" style={{animationDelay: '1.9s'}}>
            <h2 className="text-3xl font-bold text-gold-400 mb-4">Experience Our Fragrances</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the perfect scent that tells your unique story. Explore our collection of 
              luxury fragrances crafted with passion and precision.
            </p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-4 text-lg font-semibold 
                       hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105
                       relative overflow-hidden group"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 