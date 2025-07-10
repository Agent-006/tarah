"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Calendar,
  Package,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  quantity: number;
  price: number;
  variant: {
    name: string;
    product: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

interface WishlistItem {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
  };
}

interface CustomerData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  addresses: Address[];
  orders: Order[];
  wishlistItems: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  RETURNED: { label: "Returned", color: "bg-gray-100 text-gray-800" },
};

const PAYMENT_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  AUTHORIZED: { label: "Authorized", color: "bg-blue-100 text-blue-800" },
  CAPTURED: { label: "Captured", color: "bg-green-100 text-green-800" },
  PARTIALLY_REFUNDED: {
    label: "Partially Refunded",
    color: "bg-orange-100 text-orange-800",
  },
  FULLY_REFUNDED: { label: "Fully Refunded", color: "bg-red-100 text-red-800" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-800" },
};

export default function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params using React.use()
  const { id } = usePromise(params);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Customer not found");
          router.push("/admin/customers");
          return;
        }
        throw new Error("Failed to fetch customer");
      }

      const customerData = await response.json();
      setCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to load customer details");
      router.push("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statuses = type === "order" ? ORDER_STATUSES : PAYMENT_STATUSES;
    const statusConfig = statuses[status as keyof typeof statuses];
    return (
      <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <p>Customer not found</p>
        <Button asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/customers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{customer.email}</span>
              </div>

              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <div>
                    Joined:{" "}
                    {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Orders:</span>
                <Badge variant="secondary">{customer.totalOrders}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Spent:</span>
                <Badge variant="default">
                  {formatCurrency(customer.totalSpent)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Addresses:</span>
                <Badge variant="outline">{customer.addresses.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Spent</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">
                  {customer.addresses.length}
                </div>
                <div className="text-sm text-muted-foreground">Addresses</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">
                  {customer.wishlistItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Wishlist</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      {customer.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Addresses ({customer.addresses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {customer.addresses.map((address) => (
                <div key={address.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Address</h4>
                    {address.isDefault && (
                      <Badge variant="default" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div>{address.street}</div>
                    <div>
                      {address.city}, {address.state} {address.postalCode}
                    </div>
                    <div>{address.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      {customer.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Orders ({customer.orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {customer.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Order #{order.id.slice(0, 8)}...
                        </span>
                        {getStatusBadge(order.status, "order")}
                        {getStatusBadge(order.paymentStatus, "payment")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item(s) •{" "}
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(Number(order.totalAmount))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist */}
      {customer.wishlistItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Wishlist ({customer.wishlistItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customer.wishlistItems.map((item) => (
                <div key={item.product.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(item.product.basePrice))}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href={`/admin/products/view/${item.product.id}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty States */}
      {customer.orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">
              This customer hasn&apos;t placed any orders.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
