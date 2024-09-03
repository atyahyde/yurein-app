import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await req.json();

    const { customerId, productId, status, qty, desc, paymentType, dateOrder } =
      body;

    if (!customerId) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!status) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!qty) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!paymentType) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const order = await prisma.order.updateMany({
      where: {
        id: params.orderId,
      },
      data: {
        customerId,
        productId,
        status,
        qty,
        desc,
        paymentType,
        dateOrder,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const order = await prisma.order.deleteMany({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_DELETE] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
