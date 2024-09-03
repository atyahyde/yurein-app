import { prisma } from "@/lib/prisma";
import CustomerForm from "@/app/(root)/customers/components/forms/customer-form";

const CustomerDetailPage = async ({
  params,
}: {
  params: { customerId: string };
}) => {
  const customer = await prisma.customer.findUnique({
    where: { id: params.customerId },
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1  p-8 pt-6">
        <CustomerForm initialData={customer} />
      </div>
    </div>
  );
};

export default CustomerDetailPage;
