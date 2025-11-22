import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    category: string;
    brand: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
}

const Inventory = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Pipe',
        brand: '',
        unit: 'piece',
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 5,
    });

    const fetchProducts = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/products', config);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user?.token}` },
                };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };

            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData, config);
                toast.success('Product updated');
            } else {
                await axios.post('http://localhost:5000/api/products', formData, config);
                toast.success('Product added');
            }

            setShowModal(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'Pipe',
                brand: '',
                unit: 'piece',
                costPrice: 0,
                sellingPrice: 0,
                stock: 0,
                minStock: 5,
            });
            fetchProducts();
        } catch (error) {
            toast.error('Failed to save product');
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            brand: product.brand,
            unit: product.unit,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            stock: product.stock,
            minStock: product.minStock,
        });
        setShowModal(true);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            name: '',
                            category: 'Pipe',
                            brand: '',
                            unit: 'piece',
                            costPrice: 0,
                            sellingPrice: 0,
                            stock: 0,
                            minStock: 5,
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price (Sell)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">₹{product.sellingPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock <= product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {product.stock} {product.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Pipe">Pipe</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Water Pump">Water Pump</option>
                                    <option value="Submersible Pump">Submersible Pump</option>
                                    <option value="Electrical Item">Electrical Item</option>
                                    <option value="Spare Part">Spare Part</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="piece">Piece</option>
                                    <option value="meter">Meter</option>
                                    <option value="set">Set</option>
                                    <option value="bundle">Bundle</option>
                                    <option value="kg">Kg</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.sellingPrice}
                                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min Stock Alert</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="col-span-2 flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
