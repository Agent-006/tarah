import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
    {
        id: 1,
        product: "Gradient Graphic Full Sleves T-shirt + 4",
        status: "COMPLETED",
        date: "Dec 30, 2019 07:52",
        total: "$80",
        statusColor: "text-green-600",
    },
    {
        id: 2,
        product: "Gradient Graphic Full Sleves T-shirt + 4",
        status: "RETURNED",
        date: "Dec 30, 2019 07:52",
        total: "$80",
        statusColor: "text-yellow-500",
    },
    {
        id: 3,
        product: "Gradient Graphic Full Sleves T-shirt + 4",
        status: "CANCELLED",
        date: "Dec 30, 2019 07:52",
        total: "$80",
        statusColor: "text-red-600",
    },
];

export default function OrderHistory() {
    return (
        <div className="bg-white border rounded-md w-full">
            <div className="border-b px-6 py-4 font-semibold text-sm text-gray-800">
                ORDER HISTORY
            </div>
            <div className="grid grid-cols-5 px-6 py-2 text-xs text-gray-500 font-medium border-b">
                <div className="col-span-2">PRODUCT DETAILS</div>
                <div>STATUS</div>
                <div>DATE</div>
                <div>TOTAL</div>
                <div className="hidden sm:block">ACTION</div>
            </div>

            {orders.map((order) => (
                <div
                    key={order.id}
                    className="grid grid-cols-5 items-center px-6 py-4 text-sm border-b last:border-none"
                >
                    <div className="col-span-2 text-gray-800">
                        {order.product}
                    </div>
                    <div className={`${order.statusColor} font-semibold`}>
                        {order.status}
                    </div>
                    <div className="text-gray-700">{order.date}</div>
                    <div className="font-medium">{order.total}</div>
                    <div className="flex justify-end">
                        <Button variant="link" className="p-0 h-auto text-sm">
                            View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
