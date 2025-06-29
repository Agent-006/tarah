"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  variant: {
    id: string;
    name: string;
    sku: string;
    image?: string;
  };
  quantity: number;
  price: number;
  total: number;
}

interface OrderData {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  status: string;
  paymentStatus: string;
  transactions: any[];
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "RETURNED", label: "Returned", color: "bg-gray-100 text-gray-800" },
];

const PAYMENT_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "AUTHORIZED",
    label: "Authorized",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "CAPTURED",
    label: "Captured",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "PARTIALLY_REFUNDED",
    label: "Partially Refunded",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "FULLY_REFUNDED",
    label: "Fully Refunded",
    color: "bg-red-100 text-red-800",
  },
  { value: "FAILED", label: "Failed", color: "bg-red-100 text-red-800" },
];

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Unwrap params using React.use()
  const { id } = usePromise(params);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Order not found");
          router.push("/admin/orders");
          return;
        }
        throw new Error("Failed to fetch order");
      }

      const orderData = await response.json();
      setOrder(orderData);
      setOrderStatus(orderData.status);
      setPaymentStatus(orderData.paymentStatus);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: orderStatus,
          paymentStatus: paymentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: updatedOrder.status,
              paymentStatus: updatedOrder.paymentStatus,
            }
          : null
      );
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statuses = type === "order" ? ORDER_STATUSES : PAYMENT_STATUSES;
    const statusConfig = statuses.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p>Order not found</p>
        <Button asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
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
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Status & Payment Status Update */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="order-status">Current Status</Label>
              <div className="mt-1">
                {getStatusBadge(order.status, "order")}
              </div>
            </div>

            <div>
              <Label htmlFor="payment-status">Payment Status</Label>
              <div className="mt-1">
                {getStatusBadge(order.paymentStatus, "payment")}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="order-status-select">Update Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-status-select">
                  Update Payment Status
                </Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={updateOrderStatus}
                disabled={
                  updating ||
                  (orderStatus === order.status &&
                    paymentStatus === order.paymentStatus)
                }
                className="w-full"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <User className="w-4 h-4" />
                Customer Details
              </h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <strong>Name:</strong> {order.customer.name}
                </div>
                <div>
                  <strong>Email:</strong> {order.customer.email}
                </div>
                {order.customer.phone && (
                  <div>
                    <strong>Phone:</strong> {order.customer.phone}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h3>
              <div className="text-sm">
                <div>{order.address.street}</div>
                <div>
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.postalCode}
                </div>
                <div>{order.address.country}</div>
              </div>
            </div>

            <Separator />

            {/* Order Dates */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" />
                Timeline
              </h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <strong>Order Placed:</strong> {formatDate(order.createdAt)}
                </div>
                <div>
                  <strong>Last Updated:</strong> {formatDate(order.updatedAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  {item.variant.image ? (
                    <Image
                      src={item.variant.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Variant: {item.variant.name} | SKU: {item.variant.sku}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="text-right font-medium">
                  {formatCurrency(item.total)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>{formatCurrency(Number(order.taxAmount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>{formatCurrency(Number(order.shippingFee))}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(Number(order.totalAmount))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      {order.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Amount:</strong>{" "}
                      {formatCurrency(Number(transaction.amount))}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(transaction.status, "payment")}
                    </div>
                    <div>
                      <strong>Provider:</strong> {transaction.provider}
                    </div>
                    <div>
                      <strong>Date:</strong> {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
