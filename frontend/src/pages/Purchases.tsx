import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Truck, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    costPrice: number;
}

interface PurchaseItem {
    product: string;
    name: string;
    costPrice: number;
    quantity: number;
    total: number;
}

const Purchases = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<PurchaseItem[]>([]);
    const [supplierName, setSupplierName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/products', config);
                setProducts(data);
            } catch (error) {
                toast.error('Failed to load products');
            }
        };
        fetchProducts();
    }, [user]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.product === product._id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.costPrice }
                    : item
            ));
        } else {
            setCart([...cart, {
                product: product._id,
                name: product.name,
                costPrice: product.costPrice,
                quantity: 1,
                total: product.costPrice
            }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product !== productId));
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item =>
            item.product === productId
                ? { ...item, quantity: newQuantity, total: newQuantity * item.costPrice }
                : item
        ));
    };

    const updateCostPrice = (productId: string, newPrice: number) => {
        if (newPrice < 0) return;
        setCart(cart.map(item =>
            item.product === productId
                ? { ...item, costPrice: newPrice, total: item.quantity * newPrice }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + item.total, 0);
    };

    const handlePurchase = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const purchaseData = {
                supplierName: supplierName || 'Unknown Supplier',
                items: cart,
                totalAmount: calculateTotal(),
                date: new Date()
            };

            await axios.post('http://localhost:5000/api/purchases', purchaseData, config);
            toast.success('Purchase recorded successfully!');
            setCart([]);
            setSupplierName('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Purchase failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Product Selection */}
            <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Select Products to Purchase</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product._id}
                                onClick={() => addToCart(product)}
                                className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md text-left transition-all bg-white"
                            >
                                <h3 className="font-medium text-slate-800 truncate">{product.name}</h3>
                                <div className="mt-2 text-sm text-slate-500">Cost: ₹{product.costPrice}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Purchase Cart */}
            <div className="bg-white rounded-xl shadow-sm flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <Truck className="mr-2" size={20} /> Purchase Order
                    </h2>
                </div>

                <div className="p-4 border-b border-slate-100">
                    <input
                        type="text"
                        placeholder="Supplier Name"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-400 mt-10">
                            <Truck size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No items selected</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product} className="bg-slate-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Qty</label>
                                        <div className="flex items-center border border-slate-300 rounded bg-white">
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                                className="px-2 py-1 hover:bg-slate-100"
                                            >-</button>
                                            <span className="flex-1 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                                className="px-2 py-1 hover:bg-slate-100"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Cost</label>
                                        <input
                                            type="number"
                                            value={item.costPrice}
                                            onChange={(e) => updateCostPrice(item.product, Number(e.target.value))}
                                            className="w-full px-2 py-1 border border-slate-300 rounded outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-2 font-bold text-slate-700">
                                    Total: ₹{item.total}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">Total Cost</span>
                        <span className="text-2xl font-bold text-slate-800">₹{calculateTotal()}</span>
                    </div>
                    <button
                        onClick={handlePurchase}
                        disabled={cart.length === 0 || loading}
                        className={`w-full py-3 rounded-lg font-bold text-white flex justify-center items-center space-x-2 ${cart.length === 0 || loading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Confirm Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Purchases;
