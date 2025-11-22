import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Store Settings</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Store Profile</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                defaultValue="Shri Balaji Pipes and Electricals"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter store address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Save size={20} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
