import { prisma } from "@/lib/prisma";
import ProductForm from "../components/forms/product-form";

const ProductDetailPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  return (
    <div className="w-full flex-col">
      <div className="flex-1  p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
