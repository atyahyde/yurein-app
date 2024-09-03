import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    const body = await req.json();

    const { name, phone } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("phone is required", { status: 400 });
    }

    const contact = await prisma.contact.updateMany({
      where: {
        id: params.contactId,
      },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("[CONTACT_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    if (!params.contactId) {
      return new NextResponse("Contact ID is required", { status: 400 });
    }

    const contact = await prisma.contact.deleteMany({
      where: {
        id: params.contactId,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("[CONTACT_DELETE] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
