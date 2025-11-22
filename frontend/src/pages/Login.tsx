import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, type User } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await axios.post<User>(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    email,
                    password,
                }
            );

            login(data);
            toast.success('Login successful!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };


    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <Toaster position="top-right" />
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to manage your store</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
