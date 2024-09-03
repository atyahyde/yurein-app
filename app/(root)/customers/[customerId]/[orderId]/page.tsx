import { prisma } from "@/lib/prisma";
import CustomerOrderForm from "@/app/(root)/customers/components/forms/customer-order-form";

const CustomerOrderFormPage = async ({
  params,
}: {
  params: { orderId: string; customerId: string };
}) => {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
  });

  const products = await prisma.product.findMany();

  return (
    <div className="w-full flex-col">
      <div className="flex-1  p-8 pt-6">
        <CustomerOrderForm
          initialData={order}
          customerId={params.customerId}
          products={products}
        />
      </div>
    </div>
  );
};

export default CustomerOrderFormPage;
