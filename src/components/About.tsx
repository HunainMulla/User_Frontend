
import React from 'react';
import { Award, Heart, Star } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only the finest ingredients sourced from around the world"
    },
    {
      icon: Heart,
      title: "Passionate Craftsmanship",
      description: "Each fragrance is carefully crafted with love and attention to detail"
    },
    {
      icon: Star,
      title: "Exclusive Experience",
      description: "Unique scents that reflect your personality and style"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gold-400">
              The Art of Fragrance
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Marquez represents the pinnacle of luxury fragrance artistry. Founded with a passion for 
              creating exceptional scents, we combine traditional perfumery techniques with modern innovation 
              to deliver fragrances that are both timeless and contemporary.
            </p>
            
            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
              Our master perfumers work tirelessly to ensure that every bottle contains not just a fragrance, 
              but an experience that resonates with your soul and becomes part of your personal story.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 animate-slide-up"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="bg-gold-500/20 p-3 rounded-lg">
                    <feature.icon className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gold-300 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-2xl p-8 
                          border border-gold-600/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-8xl mb-8 animate-float">🏺</div>
                <h3 className="text-2xl font-bold text-gold-300 mb-4">
                  Crafted with Excellence
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Every Marquez fragrance undergoes a meticulous creation process, 
                  from the initial concept to the final bottling, ensuring unparalleled quality 
                  and sophistication in every drop.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gold-400 rounded-full opacity-60 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-gold-300 rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};
