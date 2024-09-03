"use server";

import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 5;

export const getProducts = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const products = await prisma.product.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return products;
  } catch (error) {
    throw new Error("Failed to fetch product data");
  }
};

export const getProductPages = async (query: string) => {
  try {
    const products = await prisma.product.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(Number(products) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
