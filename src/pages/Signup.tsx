import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual signup logic here
    
    toast({
      title: "Account Created",
      description: "Welcome to Marquez! Please sign in to continue.",
    });
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-6 md:py-12 md:pt-24">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-gray-900/50 backdrop-blur-md border border-gold-600/20 rounded-lg p-4 md:p-6
                        shadow-xl">
            <div className="text-center mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gold-400 mb-1">Create Account</h1>
              <p className="text-sm md:text-base text-gray-400">Join the Marquez luxury experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Create a password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400
                             hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Confirm your password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400
                             hover:text-white transition-colors duration-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-2.5 px-4 rounded-lg
                         font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                         transform hover:scale-105 mt-6"
              >
                Create Account
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gold-600/20
                           rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gold-600/20
                           rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  <img src="/facebook.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                  Facebook
                </button>
              </div>

              <p className="text-center text-gray-400 text-sm mt-4">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 