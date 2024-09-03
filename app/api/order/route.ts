import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDER_GET] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerId,
      productId,
      status,
      qty,

      desc,
      dateOrder,
      paymentType,
    } = body;

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

    const order = await prisma.order.create({
      data: {
        customerId,
        productId,
        status,
        qty,
        desc,
        dateOrder,
        paymentType,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_POST] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
