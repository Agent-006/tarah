// components/admin/orders/columns.tsx
import { useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Order } from "@/store/admin/adminOrderStore";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.getValue("customer") as {
        name: string;
        id: string;
      };
      return `${customer.name}`; // Adjust based on your customer structure
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusClass =
        {
          pending: "bg-yellow-100 text-yellow-800",
          processing: "bg-blue-100 text-blue-800",
          completed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
        }[status as string] || "bg-gray-100 text-gray-800";

      return (
        <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
          {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: function ActionsCell({ row }) {
      const order = row.original;
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                toast.success("Order ID copied to clipboard");
              }}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              View Order
            </DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
