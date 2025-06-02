"use client"

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch,useSelector } from 'react-redux';
import {loginUser,logout} from '@/slice/loginSlice'
import { useAdmin } from '@/contexts/AdminContext';
import { createApiUrl } from '@/config/api';

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [message,setMessage] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { setAdminStatus, clearAdminStatus } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual login logic here
    
    toast({
      title: "Login Successful",
      description: "Welcome back to Marquez!",
    });
    
    navigate('/');
  };


  // const handleLogin=():void=>{ 

  //     fetch("http://localhost:3000/auth/login",{ 
  //       method:"POST",
  //       headers:{
  //         'Content-Type':'application/json',
  //       },
  //       body:JSON.stringify({ 
  //         email:email
  //         ,password:password
  //       })

  //     })
  //     .then((res)=>res.json())
  //     .then((data)=>{alert(data.message)
  //       setMessage(data.message)
  //     })
  //     .catch((error)=>console.log("There was an error in the backend asap",error))

      
        
  // } 

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    
    fetch(createApiUrl("auth/login"), { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: email,
            password: password
        })
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Login failed');
        }
        return res.json();
    })
    .then((data) => {
        if (data.success) {
            // Always mark user as logged in on successful login
            dispatch(loginUser());
            
            // Store the token if available
            if (data.token || (data.user && data.user.token)) {
                const token = data.token || data.user.token;
                localStorage.setItem('token', token);
            }
            
            // Check if user is admin and set admin status
            if (data.user && data.user.role === 'admin') {
                setAdminStatus(true);
                toast({
                    title: "Admin Login Successful",
                    description: `Welcome back, Admin! You now have access to admin features.`,
                });
            } else if (data.user && data.user.isAdmin) {
                // Alternative: if your backend sends isAdmin boolean
                setAdminStatus(true);
                toast({
                    title: "Admin Login Successful", 
                    description: `Welcome back, Admin! You now have access to admin features.`,
                });
            } else {
                // Regular user login
                clearAdminStatus(); // Ensure admin status is cleared for regular users
                toast({
                    title: "Login Successful",
                    description: data.message || "Welcome back to Marquez!",
                });
            }
            
            // Navigate to home page
            navigate('/');
        } else {
            // Show error message from server
            toast({
                title: "Error",
                description: data.message || "Login failed. Please try again.",
                variant: "destructive"
            });
        }
    })
    .catch((error) => {
        console.error("Login error:", error);
        toast({
            title: "Error",
            description: "Failed to connect to the server. Please try again later.",
            variant: "destructive"
        });
    });
};


    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-6 md:py-12 md:pt-24">
          <div className="w-full max-w-md animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-md border border-gold-600/20 rounded-lg p-4 md:p-6
                          shadow-xl">
              <div className="text-center mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gold-400 mb-1">Welcome Back</h1>
                <p className="text-sm md:text-base text-gray-400">Sign in to your Marquez account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gold-600/20 rounded-lg px-4 py-2 pl-12
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
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-2.5 px-4 rounded-lg
                          font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                          transform hover:scale-105 mt-2 md:mt-4"
                >
                  Sign In
                </button>

                {/* <div className="relative my-4">
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
                </div> */}

                <p className="text-center text-gray-400 text-sm mt-4">
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