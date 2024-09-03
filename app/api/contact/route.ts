import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();
    return NextResponse.json(contacts);
  } catch (error) {
    console.log("[CONTACT_GET] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone } = body;

    if (!name) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("[CONTACT_POST] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
