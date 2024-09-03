"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { generatePagination } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const PaginationComponent = ({ totalPages }: { totalPages: number }) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  const paginationNumber = ({
    page,
    href,
    isActive,
    key,
  }: {
    page: number | string;
    href: string;
    isActive: boolean;
    key: number;
  }) => {
    return isActive ? (
      <PaginationItem key={key}>
        <PaginationLink isActive>{page}</PaginationLink>
      </PaginationItem>
    ) : (
      <PaginationItem key={key}>
        {page === "..." ? (
          <div className="mx-4 cursor-not-allowed">{page}</div>
        ) : (
          <Link href={href} className="mx-4">
            {page}
          </Link>
        )}
      </PaginationItem>
    );
  };

  const nextButton = currentPage >= totalPages;
  const prevButton = currentPage <= 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {prevButton ? (
            ""
          ) : (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="hover:bg-gray-100 cursor-pointer text-gray-900"
            >
              <HiChevronLeft size={20} />
            </Link>
          )}
        </PaginationItem>
        {allPages.map((page, index) => {
          return paginationNumber({
            key: index,
            page: page,
            href: createPageUrl(Number(page)),
            isActive: page === currentPage,
          });
        })}

        <PaginationItem>
          {nextButton ? (
            ""
          ) : (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="hover:bg-gray-100 cursor-pointer text-gray-900"
            >
              <HiChevronRight size={20} />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
