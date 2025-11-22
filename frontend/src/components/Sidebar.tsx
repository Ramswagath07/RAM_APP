import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Truck, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/inventory', label: 'Inventory', icon: Package },
        { path: '/sales', label: 'Sales', icon: ShoppingCart },
        { path: '/purchases', label: 'Purchases', icon: Truck },
        { path: '/expenses', label: 'Expenses', icon: DollarSign },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-blue-400">Shri Balaji</h1>
                <p className="text-xs text-slate-400">Pipes & Electricals</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
