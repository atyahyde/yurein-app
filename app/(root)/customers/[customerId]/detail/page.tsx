import { prisma } from "@/lib/prisma";
import Image from "next/image";

import { Product } from "@prisma/client";
import InfoCard from "@/app/(root)/customers/components/cards/info-card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import OrderCard from "@/app/(root)/customers/components/cards/order-card";
import { getOrderPages, getOrders } from "@/app/(root)/customers/domain/data";
import Search from "../../components/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PaginationComponent from "@/components/ui/paginationComponent";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderProps = {
  id: string;
  name: string;
  qty: number;
  price: Decimal;
  status: string;
  desc: string;
  dateOrder: Date | null;
  createdAt: Date;
  products: Product;
};

const CustomerDetailPage = async ({
  params,
  searchParams,
}: {
  params: { customerId: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const customer = await prisma.customer.findUnique({
    where: { id: params.customerId },
  });

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);

  const totalPages = await getOrderPages(query, params.customerId);
  const orders = await getOrders(query, currentPage, params.customerId);

  const transformedOrders = orders.map((order) => ({
    id: order.id,
    name: order.product.name,
    price: order.product.price,
    qty: order.qty,
    status: order.status,
    desc: order.desc,
    dateOrder: order.dateOrder,
    createdAt: order.createdAt,
    products: order.product,
  }));

  const total = transformedOrders
    .filter((item) => item.status === "paid")
    .reduce(
      (acc, current) => acc + Number(current.products.price) * current.qty,
      0
    );

  const newOrder = transformedOrders
    .filter((item) => item.status === "new_order")
    .reduce((acc, item) => acc + item.qty, 0);

  const unPaid = transformedOrders
    .filter((item) => item.status === "unpaid")
    .reduce((acc, item) => acc + Number(item.products.price) * item.qty, 0);

  const finishOrder = transformedOrders
    .filter((item) => item.status === "paid")
    .reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <div className="p-8 pt-6 w-full">
        <div className="flex items-center">
          <Image
            src="/img/no-profile.png"
            alt="image"
            width={50}
            height={50}
            className="rounded-full cover "
          />
          <div className="ml-4">
            <h5 className="text-xl font-bold">{customer?.name}</h5>
            <p className="text-sm text-muted-foreground">{customer?.phone}</p>
          </div>
        </div>
        <div className="mt-8 lg:flex justify-start items-center">
          <InfoCard
            position="start"
            title="Jumlah Pesanan Baru"
            content={newOrder.toString()}
          />
          <InfoCard
            position="middle"
            title="Total Belum di bayar"
            content={formatter.format(unPaid).replace(/(\.|,)00$/g, "")}
          />
          <InfoCard
            position="middle"
            title="Total Pesanan Selesai"
            content={finishOrder.toString()}
          />

          <InfoCard
            title="Total Pendapatan"
            position="last"
            content={formatter.format(total).replace(/(\.|,)00$/g, "")}
          />
        </div>
        <Separator className="my-8" />
        <div className="flex justify-between items-center mb-8">
          <Search />
          <Button asChild className="lg:ml-0 ml-4">
            <Link href={`../${customer?.id}/new`}>Tambah Order</Link>
          </Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
          {transformedOrders.map((item) => (
            <div key={item.id}>
              <OrderCard data={item} customerId={params.customerId} />
            </div>
          ))}
        </div>
        {transformedOrders.length === 0 && (
          <>
            <div className="justify-center items-center flex lg:-mt-[60px]">
              <Image
                src="/img/no-data.jpg"
                alt="image"
                width={500}
                height={500}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-center lg:text-xl font-bold -mt-[30px] lg:-mt-[50px]">
                Belum ada pesanan!
              </p>
            </div>
          </>
        )}
        <div className="mt-8">
          <PaginationComponent totalPages={totalPages} />
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPage;
