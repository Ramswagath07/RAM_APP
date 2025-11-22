import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [chartsData, setChartsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };

                const statsRes = await axios.get('http://localhost:5000/api/analytics/dashboard', config);
                const chartsRes = await axios.get('http://localhost:5000/api/analytics/charts', config);

                setStats(statsRes.data);
                setChartsData(chartsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Stock Value</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{stats?.totalStockValue?.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Today's Sales</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{stats?.todaySalesTotal?.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Today's Profit</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{stats?.todayProfit?.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-2">{stats?.lowStockCount}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales vs Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartsData?.barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Sales" fill="#3b82f6" />
                                <Bar dataKey="Expenses" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales by Category</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartsData?.pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartsData?.pieChartData?.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Low Stock Alert Section */}
            {stats?.lowStockProducts?.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                        <AlertTriangle className="mr-2" size={20} /> Low Stock Alerts
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Min Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {stats.lowStockProducts.map((product: any) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.minStock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
