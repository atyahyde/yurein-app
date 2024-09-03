import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const body = await req.json();

    const { name, address, phone } = body;

    if (!name) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!address) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const customer = await prisma.customer.updateMany({
      where: {
        id: params.customerId,
      },
      data: {
        name,
        address,
        phone,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    if (!params.customerId) {
      return new NextResponse("Customer ID is required", { status: 400 });
    }

    const customer = await prisma.customer.deleteMany({
      where: {
        id: params.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_DELETE] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
