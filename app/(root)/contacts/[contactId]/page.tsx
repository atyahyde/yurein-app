import { prisma } from "@/lib/prisma";
import ContactForm from "../components/forms/contact-form";

const ContactDetailPage = async ({
  params,
}: {
  params: { contactId: string };
}) => {
  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1  p-8 pt-6">
        <ContactForm initialData={contact} />
      </div>
    </div>
  );
};

export default ContactDetailPage;
