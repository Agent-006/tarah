// app/admin/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Info, TrendingUp, Users, Package, FileText, RefreshCw, Tag, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { OverviewChart } from "@/components/admin/overview-chart";
import { useAdminOrderStore } from "@/store/admin/adminOrderStore";
import { useAdminProductStore } from "@/store/admin/adminProductStore";
import { useAdminBlogStore } from "@/store/admin/adminBlogStore";
import { useAdminUserStore } from "@/store/admin/adminUserStore";
// Add more imports for analytics, tables, and widgets as needed

export default function AdminDashboard() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    const { orders = [], fetchOrders, isLoading: ordersLoading, error: ordersError } = useAdminOrderStore();
    const { products = [], fetchProducts, isLoading: productsLoading, error: productsError } = useAdminProductStore();
    const { allPosts = [], fetchAllPosts, isLoading: blogsLoading, error: blogsError } = useAdminBlogStore();
    const { users = [], fetchUsers, isLoading: usersLoading, error: usersError } = useAdminUserStore();

    useEffect(() => {
        if (sessionStatus === "authenticated" && session?.user?.role === "CUSTOMER") {
            router.replace("/");
        }
    }, [sessionStatus, session?.user?.role, router]);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchAllPosts();
        fetchUsers();
    }, [fetchOrders, fetchProducts, fetchAllPosts, fetchUsers]);

    if (sessionStatus === "authenticated" && session?.user?.role === "CUSTOMER") {
        return null;
    }

    const isLoading = ordersLoading || productsLoading || blogsLoading || usersLoading;
    const isError = ordersError || productsError || blogsError || usersError;

    // Metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalBlogs = allPosts.length;
    const totalUsers = users.length;
    const totalCategories = products.reduce((acc, p) => acc + (p.categories?.length || 0), 0);
    const topProducts = products.slice(0, 5);
    const topBlogs = allPosts.slice(0, 5);
    const recentOrders = orders.slice(0, 5);
    const totalRefunds = orders.filter(o => o.status === "REFUNDED").length;
    // If products have a 'stock' property directly
    // Find products with any variant having low stock
    const lowStockProducts = products.filter((product) =>
        product.variants?.some((variant) => variant.inventory && variant.inventory.stock < 5)
    );
    type User = { role: string };
    const activeCustomers = users.filter((u: User) => u.role === "CUSTOMER").length;
    const trafficSources = [
        { name: "Organic", value: 60 },
        { name: "Paid", value: 25 },
        { name: "Referral", value: 15 }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <span className="text-muted-foreground text-sm">Welcome, {session?.user?.fullName || session?.user?.email || "Admin"}</span>
            </div>
            {isLoading && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground"><Loader2 className="animate-spin" /> Loading dashboard data...</div>
            )}
            {isError && (
                <div className="text-red-600 font-semibold">{isError}</div>
            )}
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><TrendingUp className="text-green-600" size={20} /><CardTitle>Revenue</CardTitle>
                        <Tooltip content="Total revenue from all orders."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div></CardContent>
                </Card>
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><Package className="text-blue-600" size={20} /><CardTitle>Products</CardTitle>
                        <Tooltip content="Total products listed."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalProducts}</div></CardContent>
                </Card>
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><RefreshCw className="text-yellow-600" size={20} /><CardTitle>Orders</CardTitle>
                        <Tooltip content="Total orders placed."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalOrders}</div></CardContent>
                </Card>
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><FileText className="text-purple-600" size={20} /><CardTitle>Blogs</CardTitle>
                        <Tooltip content="Total blogs published."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalBlogs}</div></CardContent>
                </Card>
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><Users className="text-pink-600" size={20} /><CardTitle>Users</CardTitle>
                        <Tooltip content="Total registered users."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalUsers}</div></CardContent>
                </Card>
                <Card className="relative group">
                    <CardHeader className="flex items-center gap-2"><Tag className="text-red-600" size={20} /><CardTitle>Refunds</CardTitle>
                        <Tooltip content="Total refunded orders."><Info className="ml-1 text-muted-foreground" size={16} /></Tooltip>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalRefunds}</div></CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-lg border border-blue-100">
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-2">
                            <Link href="/admin/products/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition flex items-center gap-2"><Package size={16}/> Add Product</Link>
                            <Link href="/admin/blogs/create-blog" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-purple-700 transition flex items-center gap-2"><FileText size={16}/> Write Blog</Link>
                            <Link href="/admin/orders" className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-yellow-600 transition flex items-center gap-2"><RefreshCw size={16}/> View Orders</Link>
                            <Link href="/admin/users" className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-pink-700 transition flex items-center gap-2"><Users size={16}/> Manage Users</Link>
                    </div></CardContent>
                </Card>
                <Card className="shadow-lg border border-green-100">
                    <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
                    <CardContent><span className="text-green-600 font-semibold flex items-center gap-2"><Activity size={16}/> All systems operational</span></CardContent>
                </Card>
                <Card className="shadow-lg border border-purple-100">
                    <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalCategories}</div></CardContent></Card>
                <Card className="shadow-lg border border-pink-100">
                    <CardHeader><CardTitle>Active Customers</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{activeCustomers}</div></CardContent></Card>
            </div>

            {/* Analytics & Top Items */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-lg border border-green-100">
                    <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
                    <CardContent className="pl-2"><OverviewChart orders={orders} /></CardContent>
                </Card>
                <Card className="col-span-3 shadow-lg border border-blue-100">
                    <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {topProducts.map(product => (
                            <li key={product.id} className="text-blue-700 font-medium flex items-center gap-2">
                                <Package size={14}/> {product.name}
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
                <Card className="col-span-3 shadow-lg border border-purple-100">
                    <CardHeader><CardTitle>Top Blogs</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {topBlogs.map(blog => (
                            <li key={blog.id} className="text-purple-700 font-medium flex items-center gap-2">
                                <FileText size={14}/> {blog.title}
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
            </div>

            {/* Recent Tables */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="shadow-lg border border-yellow-100">
                    <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {recentOrders.map(order => (
                            <li key={order.id} className="text-muted-foreground flex items-center gap-2">
                                <RefreshCw size={14}/> Order #{order.id} placed
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
                <Card className="shadow-lg border border-red-100">
                    <CardHeader><CardTitle>Low Stock Products</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {lowStockProducts.map((product) => (
                            <li key={product.id} className="text-red-700 font-medium flex items-center gap-2">
                                <Package size={14}/> {product.name} (
                                {product.variants?.map((variant) =>
                                    variant.inventory && variant.inventory.stock < 5
                                        ? `${variant.inventory.stock}`
                                        : null
                                ).filter(Boolean).join(", ")}
                                )
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
            </div>

            {/* Traffic Sources & Activity Feed */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="shadow-lg border border-green-100">
                    <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {trafficSources.map(src => (
                            <li key={src.name} className="text-green-700 font-medium flex items-center gap-2">
                                <TrendingUp size={14}/> {src.name}: {src.value}%
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
                <Card className="shadow-lg border border-blue-100">
                    <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                    <CardContent><ul className="text-xs space-y-1">
                        {recentOrders.map(order => (
                            <li key={order.id} className="text-muted-foreground flex items-center gap-2">
                                <Activity size={14}/> Order #{order.id} placed
                            </li>
                        ))}
                        {topBlogs.map(blog => (
                            <li key={blog.id} className="text-purple-700 font-medium flex items-center gap-2">
                                <FileText size={14}/> Blog: {blog.title}
                            </li>
                        ))}
                    </ul></CardContent>
                </Card>
            </div>
        </div>
    );
}
