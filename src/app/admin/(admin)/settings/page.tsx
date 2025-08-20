import React from "react";

const SettingsPage = () => {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
                Admin Settings
            </h1>
            <div className="bg-white rounded-xl shadow p-8 space-y-8">
                {/* Profile Section */}
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <p className="font-medium text-gray-700">
                                Admin Name
                            </p>
                            <p className="text-sm text-gray-500">
                                admin@email.com
                            </p>
                        </div>
                    </div>
                </section>

                {/* Password Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Change Password
                    </h2>
                    <form className="space-y-4">
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full border rounded px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full border rounded px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full border rounded px-3 py-2"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                        >
                            Update Password
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
