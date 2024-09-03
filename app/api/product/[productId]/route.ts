import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
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

    const contact = await prisma.product.updateMany({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        stock,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
