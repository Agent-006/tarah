import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from "@/store/admin/adminOrderStore";

interface RecentSalesProps {
    orders: Order[];
}

export function RecentSales({ orders }: RecentSalesProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">
                            <div className="flex flex-col">
                                <span>{order.customer.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {order.customer.email}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    order.status === "DELIVERED"
                                        ? "secondary"
                                        : order.status === "CANCELLED"
                                        ? "destructive"
                                        : "default"
                                }
                            >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                            ₹{order.totalAmount.toFixed(2)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
