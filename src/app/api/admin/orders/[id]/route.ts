import { authOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        address: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        transactions: {
          include: {
            paymentMethod: {
              select: {
                type: true,
                provider: true,
                cardLast4: true,
                cardBrand: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const formattedOrder = {
      id: order.id,
      customer: {
        id: order.user.id,
        name: `${order.user.firstName || ""} ${
          order.user.lastName || ""
        }`.trim(),
        email: order.user.email,
        phone: order.user.phone,
      },
      address: {
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
      },
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
        },
        variant: {
          id: item.variant.id,
          name: item.variant.name,
          sku: item.variant.sku,
          image: item.variant.images[0]?.url || null,
        },
        quantity: item.quantity,
        price: item.price,
        total: Number(item.price) * item.quantity,
      })),
      totalAmount: order.totalAmount,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingFee: order.shippingFee,
      status: order.status,
      paymentStatus: order.paymentStatus,
      transactions: order.transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        provider: transaction.provider,
        status: transaction.status,
        type: transaction.type,
        paymentMethod: transaction.paymentMethod
          ? {
              type: transaction.paymentMethod.type,
              provider: transaction.paymentMethod.provider,
              cardLast4: transaction.paymentMethod.cardLast4,
              cardBrand: transaction.paymentMethod.cardBrand,
            }
          : null,
        createdAt: transaction.createdAt,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Validate status values
    const validOrderStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ];
    const validPaymentStatuses = [
      "PENDING",
      "AUTHORIZED",
      "CAPTURED",
      "PARTIALLY_REFUNDED",
      "FULLY_REFUNDED",
      "FAILED",
    ];

    if (status && !validOrderStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      updatedAt: updatedOrder.updatedAt,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
