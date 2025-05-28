import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual login logic here
    
    toast({
      title: "Login Successful",
      description: "Welcome back to Marquez!",
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-md border border-gold-600/20 rounded-lg p-8
                        shadow-xl animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gold-400 mb-2">Welcome Back</h1>
              <p className="text-gray-400">Sign in to your Marquez account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-3 pl-12
                             text-white placeholder-gray-400 focus:outline-none focus:border-gold-400
                             transition-all duration-300"
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox bg-gray-800 border-gold-600/20 rounded
                             text-gold-500 focus:ring-gold-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-gold-400 hover:text-gold-300 transition-colors duration-300">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-3 px-4 rounded-lg
                         font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                         transform hover:scale-105"
              >
                Sign In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <p className="text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 