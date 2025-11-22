import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Expense {
    _id: string;
    title: string;
    category: string;
    amount: number;
    date: string;
    note: string;
}

const Expenses = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Rent',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const fetchExpenses = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/expenses', config);
            setExpenses(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load expenses');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post('http://localhost:5000/api/expenses', formData, config);
            toast.success('Expense added');
            setShowModal(false);
            setFormData({
                title: '',
                category: 'Rent',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
            fetchExpenses();
        } catch (error) {
            toast.error('Failed to add expense');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this expense?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                await axios.delete(`http://localhost:5000/api/expenses/${id}`, config);
                toast.success('Expense deleted');
                fetchExpenses();
            } catch (error) {
                toast.error('Failed to delete expense');
            }
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
                    <p className="text-slate-500">Total: <span className="font-bold text-red-600">₹{totalExpenses.toLocaleString()}</span></p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Note</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                            ) : expenses.map((expense) => (
                                <tr key={expense._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {format(new Date(expense.date), 'dd MMM yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{expense.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{expense.note}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                                        ₹{expense.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(expense._id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Shop Rent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Rent">Rent</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="number"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
                                <textarea
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
