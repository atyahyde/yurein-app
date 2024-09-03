"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ContactSchema = z.object({
  name: z.string().min(6, { message: "Nama harus lebih dari 6 karakter" }),
  phone: z
    .string()
    .min(1, { message: "Nama harus lebih dari 6 karakter" })
    .max(12, { message: "Phone number is too long" }),
});

export const saveContact = async (prevState: any, formData: FormData) => {
  const validatedFields = ContactSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.contact.create({
      data: {
        name: validatedFields.data.name,
        phone: validatedFields.data.phone,
      },
    });
  } catch (error) {
    return { message: "Failed to save contact" };
  }

  revalidatePath("/contacts");
  redirect("/contacts");
};
