import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, stock } = body;

    if (!name) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!stock) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const contact = await prisma.product.create({
      data: {
        name,
        price,
        stock,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("[PRODUCT_POST] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
