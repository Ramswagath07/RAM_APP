import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const Reports = () => {
    const { user } = useAuth();
    const [chartsData, setChartsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/analytics/charts', config);
                setChartsData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Business Reports</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                    <Calendar className="mr-2" size={20} /> Monthly Performance (Last 6 Months)
                </h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartsData?.barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Sales" fill="#3b82f6" name="Total Sales" />
                            <Bar dataKey="Expenses" fill="#ef4444" name="Total Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional reports can be added here: Profit/Loss table, Category breakdown table, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Profit Analysis</h3>
                    <p className="text-slate-500 text-sm">
                        Profit is calculated as Total Sales - Cost of Goods Sold (estimated).
                        Expenses are tracked separately.
                    </p>
                    {/* Placeholder for detailed profit table */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg text-center text-slate-500">
                        Detailed profit report coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
