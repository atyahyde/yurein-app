import React, { Suspense } from "react";

import Search from "./components/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import PaginationComponent from "@/components/ui/paginationComponent";
import ProductTableComponent from "./components/product-table";
import {
  getProductPages,
  getProducts,
} from "@/app/(root)/products/domain/data";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const ContactPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);

  const totalPages = await getProductPages(query);
  const contacts = await getProducts(query, currentPage);

  return (
    <>
      <div className="w-full mx-auto  p-8">
        <Heading
          title="Produk"
          description="Halaman ini berisikan list produk"
        />
        <Separator className="mt-5 mb-10" />
        <div className="lg:flex justify-between items-center mb-5">
          <Search />
          <Button asChild className="mt-4 lg:mt-0">
            <Link href={"/products/new"}>Tambah Produk</Link>
          </Button>
        </div>
        <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
          <div className="flex items-center justify-between gap-1 mb-5">
            <ProductTableComponent data={contacts} />
          </div>
        </Suspense>
        <PaginationComponent totalPages={totalPages} />
      </div>
    </>
  );
};

export default ContactPage;
