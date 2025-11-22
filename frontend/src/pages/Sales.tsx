import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ShoppingCart, FileText, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    sellingPrice: number;
    stock: number;
}

interface CartItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

const Sales = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch products for selection
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
        if (product.stock <= 0) {
            toast.error('Product out of stock');
            return;
        }

        const existingItem = cart.find(item => item.product === product._id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error('Not enough stock');
                return;
            }
            setCart(cart.map(item =>
                item.product === product._id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                    : item
            ));
        } else {
            setCart([...cart, {
                product: product._id,
                name: product.name,
                price: product.sellingPrice,
                quantity: 1,
                total: product.sellingPrice
            }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product !== productId));
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const product = products.find(p => p._id === productId);
        if (!product) return;

        if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items in stock`);
            return;
        }

        setCart(cart.map(item =>
            item.product === productId
                ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + item.total, 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const saleData = {
                customerName: customerName || 'Walk-in Customer',
                items: cart,
                totalAmount: calculateTotal(),
                paymentMethod: 'Cash' // Can add dropdown later
            };

            await axios.post('http://localhost:5000/api/sales', saleData, config);
            toast.success('Sale completed successfully!');
            setCart([]);
            setCustomerName('');
            // Refresh products to get updated stock
            const { data } = await axios.get('http://localhost:5000/api/products', config);
            setProducts(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Product Selection Section */}
            <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Select Products</h2>
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
                                disabled={product.stock <= 0}
                                className={`p-4 rounded-lg border text-left transition-all ${product.stock <= 0
                                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                        : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md'
                                    }`}
                            >
                                <h3 className="font-medium text-slate-800 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-blue-600 font-bold">₹{product.sellingPrice}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock <= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {product.stock} left
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart / Billing Section */}
            <div className="bg-white rounded-xl shadow-sm flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <ShoppingCart className="mr-2" size={20} /> Current Bill
                    </h2>
                </div>

                <div className="p-4 border-b border-slate-100">
                    <input
                        type="text"
                        placeholder="Customer Name (Optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-400 mt-10">
                            <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                                    <p className="text-xs text-slate-500">₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                                        <button
                                            onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                        >-</button>
                                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                        >+</button>
                                    </div>
                                    <span className="font-bold text-slate-800 w-16 text-right">₹{item.total}</span>
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">Total Amount</span>
                        <span className="text-2xl font-bold text-slate-800">₹{calculateTotal()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                        className={`w-full py-3 rounded-lg font-bold text-white flex justify-center items-center space-x-2 ${cart.length === 0 || loading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all'
                            }`}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <FileText size={20} />
                                <span>Generate Bill</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;
