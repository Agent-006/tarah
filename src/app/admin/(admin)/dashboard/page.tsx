// app/admin/dashboard/page.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Loader2,
    TrendingUp,
    Users,
    Package,
    FileText,
    RefreshCw,
    Tag,
    Activity,
    UserPlus,
    RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/admin/overview-chart";
// Dynamically import chart components (example: Bar, Pie, Line from recharts or similar)
const ProductsBarChart = dynamic(
    () => import("@/components/ui/products-bar-chart"),
    { ssr: false }
);
const BlogsBarChart = dynamic(() => import("@/components/ui/blogs-bar-chart"), {
    ssr: false,
});
const OrdersLineChart = dynamic(
    () => import("@/components/ui/orders-line-chart"),
    { ssr: false }
);
import { useAdminOrderStore } from "@/store/admin/adminOrderStore";
import { useAdminProductStore } from "@/store/admin/adminProductStore";
import { useAdminBlogStore } from "@/store/admin/adminBlogStore";
import { useAdminUserStore } from "@/store/admin/adminUserStore";
// Add more imports for analytics, tables, and widgets as needed

export default function AdminDashboard() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        orders = [],
        fetchOrders,
        isLoading: ordersLoading,
        error: ordersError,
    } = useAdminOrderStore();
    const {
        products = [],
        fetchProducts,
        isLoading: productsLoading,
        error: productsError,
    } = useAdminProductStore();
    const {
        allPosts = [],
        fetchAllPosts,
        isLoading: blogsLoading,
        error: blogsError,
    } = useAdminBlogStore();
    const {
        users = [],
        fetchUsers,
        isLoading: usersLoading,
        error: usersError,
    } = useAdminUserStore();

    useEffect(() => {
        if (
            sessionStatus === "authenticated" &&
            session?.user?.role === "CUSTOMER"
        ) {
            router.replace("/");
        }
    }, [sessionStatus, session?.user?.role, router]);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchAllPosts();
        fetchUsers();
    }, [fetchOrders, fetchProducts, fetchAllPosts, fetchUsers]);

    if (
        sessionStatus === "authenticated" &&
        session?.user?.role === "CUSTOMER"
    ) {
        return null;
    }

    const isLoading =
        ordersLoading || productsLoading || blogsLoading || usersLoading;
    const isError = ordersError || productsError || blogsError || usersError;

    // Refresh all data
    const handleRefreshData = async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchOrders(),
            fetchProducts(),
            fetchAllPosts(),
            fetchUsers(),
        ]);
        setLastRefreshed(new Date());
        setIsRefreshing(false);
    };

    // Metrics
    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
    );
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalBlogs = allPosts.length;
    const totalUsers = users.length;
    // Removed unused: totalCategories
    const topProducts = products.slice(0, 5);
    const topBlogs = allPosts.slice(0, 5);
    const recentOrders = orders.slice(0, 5);
    const recentUsers = users.slice(0, 10); // Get recent 10 users
    const totalRefunds = orders.filter((o) => o.status === "REFUNDED").length;
    // If products have a 'stock' property directly
    // Find products with any variant having low stock
    const lowStockProducts = products.filter((product) =>
        product.variants?.some(
            (variant) => variant.inventory && variant.inventory.stock < 5
        )
    );

    // Prepare chart data
    const topProductsChartData = topProducts.map((product) => ({
        name: product.name,
        value: product.variants?.reduce(
            (sum, v) => sum + (v.inventory?.stock || 0),
            0
        ),
    }));
    const topBlogsChartData = topBlogs.map((blog) => ({
        name: blog.title,
        value: blog.views?.length || 0,
    }));
    const recentOrdersChartData = recentOrders.map((order) => ({
        name: `#${order.id}`,
        value: Number(order.totalAmount),
    }));

    return (
        <main className="flex flex-col gap-10 px-4 py-8 md:px-12 lg:px-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 drop-shadow">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground text-base mt-1">
                            Welcome,{" "}
                            <span className="font-semibold text-blue-700">
                                {session?.user?.fullName ||
                                    session?.user?.email ||
                                    "Admin"}
                            </span>
                        </p>
                        {lastRefreshed && (
                            <p className="text-sm text-muted-foreground">
                                Last refreshed:{" "}
                                {lastRefreshed.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center items-end gap-3 mt-2 md:mt-0">
                    <div className="flex gap-3 mt-4 md:mt-2">
                        <Link
                            href="/admin/products/add-product"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-150 flex items-center gap-2"
                        >
                            Add Product
                        </Link>
                        <Link
                            href="/admin/blogs/create-blog"
                            className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all duration-150 flex items-center gap-2"
                        >
                            Write Blog
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="px-5 py-2 rounded-lg bg-yellow-500 text-gray-900 font-semibold shadow-lg hover:bg-yellow-600 transition-all duration-150 flex items-center gap-2"
                        >
                            View Orders
                        </Link>
                        <Link
                            href="/admin/users"
                            className="px-5 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow-lg hover:bg-pink-700 transition-all duration-150 flex items-center gap-2"
                        >
                            Manage Users
                        </Link>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-2">
                        <button
                            onClick={handleRefreshData}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-200 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh dashboard data"
                        >
                            <RotateCcw
                                size={16}
                                className={`${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading & Error States */}
            {isLoading && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground animate-pulse">
                    <Loader2 className="animate-spin" /> Loading dashboard
                    data...
                </div>
            )}
            {isError && (
                <div className="text-red-600 font-semibold rounded-lg p-2 bg-red-50 shadow">
                    {isError}
                </div>
            )}

            {/* Stats Cards */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
                {[
                    {
                        title: "Revenue",
                        value: `₹${totalRevenue.toFixed(2)}`,
                        icon: (
                            <TrendingUp className="text-green-600" size={24} />
                        ),
                        color: "from-green-100 to-green-50",
                    },
                    {
                        title: "Products",
                        value: totalProducts,
                        icon: <Package className="text-blue-600" size={24} />,
                        color: "from-blue-100 to-blue-50",
                    },
                    {
                        title: "Orders",
                        value: totalOrders,
                        icon: (
                            <RefreshCw className="text-yellow-600" size={24} />
                        ),
                        color: "from-yellow-100 to-yellow-50",
                    },
                    {
                        title: "Blogs",
                        value: totalBlogs,
                        icon: (
                            <FileText className="text-purple-600" size={24} />
                        ),
                        color: "from-purple-100 to-purple-50",
                    },
                    {
                        title: "Users",
                        value: totalUsers,
                        icon: <Users className="text-pink-600" size={24} />,
                        color: "from-pink-100 to-pink-50",
                    },
                    {
                        title: "Refunds",
                        value: totalRefunds,
                        icon: <Tag className="text-red-600" size={24} />,
                        color: "from-red-100 to-red-50",
                    },
                ].map((stat) => (
                    <Card
                        key={stat.title}
                        className={`bg-gradient-to-br ${stat.color} shadow-lg hover:scale-[1.03] transition-transform duration-150 rounded-xl group`}
                    >
                        <CardHeader className="flex items-center gap-2">
                            {stat.icon}
                            <CardTitle className="group-hover:text-blue-900 transition-colors duration-150">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-blue-900 drop-shadow-sm">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Charts & Analytics */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white/80 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-150">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Revenue Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OverviewChart orders={orders} />
                        <div className="mt-6">
                            <OrdersLineChart
                                data={recentOrdersChartData}
                                xKey="name"
                                yKey="value"
                                title="Recent Orders Value"
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-blue-50/80 shadow-xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Top Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductsBarChart
                            data={topProductsChartData}
                            xKey="name"
                            yKey="value"
                            title="Top Products by Stock"
                        />
                        <ul className="text-sm space-y-2 mt-4">
                            {topProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="text-blue-700 font-semibold flex items-center gap-2 hover:bg-blue-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <Package size={16} /> {product.name}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="col-span-7 w-full bg-purple-50/80 shadow-xl rounded-xl -py-6">
                    <CardHeader className="bg-white rounded-t-xl border-b border-purple-100 shadow-sm">
                        <CardTitle className="text-2xl pt-6 font-bold text-purple-900">
                            Top Blogs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row w-full gap-8 items-stretch bg-white rounded-b-xl p-6">
                        <div className="md:w-2/3 w-full flex items-center justify-center">
                            <div className="w-full h-72 bg-white rounded-xl shadow-lg p-4 flex items-center justify-center">
                                <BlogsBarChart
                                    data={topBlogsChartData}
                                    xKey="name"
                                    yKey="value"
                                    title="Top Blogs by Views"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                        <div className="md:w-1/3 w-full flex flex-col justify-center">
                            <ul className="text-base space-y-3 mt-2 max-h-72 overflow-y-auto pr-2">
                                {topBlogs.map((blog) => (
                                    <li
                                        key={blog.id}
                                        className="text-purple-800 font-semibold flex items-center gap-3 hover:bg-purple-100 rounded-lg px-3 py-2 transition-colors duration-100 shadow-sm cursor-pointer"
                                    >
                                        <FileText
                                            size={18}
                                            className="text-purple-500"
                                        />
                                        <span className="truncate">
                                            {blog.title}
                                        </span>
                                    </li>
                                ))}
                                {topBlogs.length === 0 && (
                                    <li className="text-muted-foreground text-center py-4">
                                        No top blogs found
                                    </li>
                                )}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Tables */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card className="bg-yellow-50/80 shadow-xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-2">
                            {recentOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className="text-muted-foreground flex items-center gap-2 hover:bg-yellow-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <RefreshCw size={16} /> Order #{order.id}{" "}
                                    placed
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-red-50/80 shadow-xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Low Stock Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-2">
                            {lowStockProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="text-red-700 font-semibold flex items-center gap-2 hover:bg-red-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <Package size={16} /> {product.name} (
                                    {product.variants
                                        ?.map((variant) =>
                                            variant.inventory &&
                                            variant.inventory.stock < 5
                                                ? `${variant.inventory.stock}`
                                                : null
                                        )
                                        .filter(Boolean)
                                        .join(", ")}
                                    )
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Users & Activity Feed */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card className="bg-green-50/80 shadow-xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Recent Users/Customers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-2">
                            {recentUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="text-green-700 font-semibold flex items-center gap-2 hover:bg-green-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <UserPlus size={16} />
                                    <div className="flex flex-col">
                                        <span>
                                            {user.fullName || user.email}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.role} •{" "}
                                            {user.createdAt
                                                ? new Date(
                                                      user.createdAt
                                                  ).toLocaleDateString()
                                                : "Recently"}
                                        </span>
                                    </div>
                                </li>
                            ))}
                            {recentUsers.length === 0 && (
                                <li className="text-muted-foreground text-center py-4">
                                    No recent users found
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50/80 shadow-xl rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-blue-900">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrdersLineChart
                            data={recentOrdersChartData}
                            xKey="name"
                            yKey="value"
                            title="Recent Orders Value"
                        />
                        <ul className="text-sm space-y-2 mt-4">
                            {recentOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className="text-muted-foreground flex items-center gap-2 hover:bg-blue-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <Activity size={16} /> Order #{order.id}{" "}
                                    placed
                                </li>
                            ))}
                            {topBlogs.map((blog) => (
                                <li
                                    key={blog.id}
                                    className="text-purple-700 font-semibold flex items-center gap-2 hover:bg-blue-100 rounded px-2 py-1 transition-colors duration-100"
                                >
                                    <FileText size={16} /> Blog: {blog.title}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
