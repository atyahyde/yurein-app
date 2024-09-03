"use server";

import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 5;

export const getCustomers = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const customers = await prisma.customer.findMany({
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
    return customers;
  } catch (error) {
    throw new Error("Failed to fetch customer data");
  }
};

export const getCustomerPages = async (query: string) => {
  try {
    const customers = await prisma.customer.count({
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
    const totalPages = Math.ceil(Number(customers) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getOrders = async (
  query: string,
  currentPage: number,
  customerId: string
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const orders = await prisma.order.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        customerId,
        product: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      include: {
        product: true,
      },
    });
    return orders;
  } catch (error) {
    throw new Error("Failed to fetch order data");
  }
};

export const getOrderPages = async (query: string, customerId: string) => {
  try {
    const orders = await prisma.order.count({
      where: {
        customerId,
        product: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
    });
    const totalPages = Math.ceil(Number(orders) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
