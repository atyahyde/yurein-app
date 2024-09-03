import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    console.log("[CUSTOMER_GET] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const customer = await prisma.customer.create({
      data: {
        name,
        address,
        phone,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMER_POST] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
