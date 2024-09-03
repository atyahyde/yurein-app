import React, { Suspense } from "react";

import Search from "./components/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import PaginationComponent from "@/components/ui/paginationComponent";

import {
  getCustomerPages,
  getCustomers,
} from "@/app/(root)/customers/domain/data";
import CustomerTableComponent from "@/app/(root)/customers/components/customer-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const CustomerPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);

  const totalPages = await getCustomerPages(query);
  const customers = await getCustomers(query, currentPage);

  return (
    <>
      <div className="w-full mx-auto  p-8">
        <Heading
          title="Pelanggan"
          description="Halaman ini berisikan list pelanggan"
        />
        <Separator className="mt-5 mb-10 overflow-hidden" />
        <div className="flex justify-between items-center mb-5">
          <Search />
          <Button asChild>
            <Link href={"/customers/new"}>Tambah Pelanggan</Link>
          </Button>
        </div>
        <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
          <div className="flex items-center justify-between gap-1 mb-5">
            <CustomerTableComponent data={customers} />
          </div>
        </Suspense>
        <PaginationComponent totalPages={totalPages} />
      </div>
    </>
  );
};

export default CustomerPage;
