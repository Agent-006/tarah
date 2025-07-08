
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";

import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
        orders: {
          select: {
            totalAmount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCustomers = customers.map((customer) => {
      const totalSpent = customer.orders.reduce((sum, order) => {
        return sum + Number(order.totalAmount);
      }, 0);

      return {
        id: customer.id,
        name:
          customer.fullName ||
          `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
          "No Name",
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        totalOrders: customer._count.orders,
        totalSpent: totalSpent,
        addressCount: customer._count.addresses,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
