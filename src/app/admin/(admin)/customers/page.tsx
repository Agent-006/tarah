"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  UserPlus,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { DataTable } from "@/components/admin/customers/data-table";
import { columns, Customer } from "@/components/admin/customers/columns";
import { toast } from "sonner";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/customers");

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);

      // Calculate stats
      const totalCustomers = data.length;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const newThisMonth = data.filter((customer: Customer) => {
        const customerDate = new Date(customer.createdAt);
        return (
          customerDate.getMonth() === currentMonth &&
          customerDate.getFullYear() === currentYear
        );
      }).length;

      const totalRevenue = data.reduce(
        (sum: number, customer: Customer) => sum + customer.totalSpent,
        0
      );

      const customersWithOrders = data.filter(
        (customer: Customer) => customer.totalOrders > 0
      );

      const avgOrderValue =
        customersWithOrders.length > 0
          ? totalRevenue /
            customersWithOrders.reduce(
              (sum: number, customer: Customer) => sum + customer.totalOrders,
              0
            )
          : 0;

      setStats({
        totalCustomers,
        newThisMonth,
        totalRevenue,
        avgOrderValue,
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view customer information
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Customer growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">From all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.avgOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={customers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPage;
