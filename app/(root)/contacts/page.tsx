import React, { Suspense } from "react";
import ContactTableComponent from "./components/contact-table";
import Search from "./components/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getContactPages, getContacts } from "@/lib/data";
import PaginationComponent from "@/components/ui/paginationComponent";

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

  const totalPages = await getContactPages(query);
  const contacts = await getContacts(query, currentPage);

  return (
    <>
      <div className="max-w-screen-md mx-auto mt-5">
        <div className="flex justify-between items-center mb-5">
          <Search />
          <Button asChild>
            <Link href={"/contacts/new"}>Create</Link>
          </Button>
        </div>
        <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
          <div className="flex items-center justify-between gap-1 mb-5">
            <ContactTableComponent data={contacts} />
          </div>
        </Suspense>
        <PaginationComponent totalPages={totalPages} />
      </div>
    </>
  );
};

export default ContactPage;
