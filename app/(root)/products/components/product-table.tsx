"use client";

import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

interface ProductTableProps {
  data: Product[];
}

const ProductTableComponent = ({ data }: ProductTableProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/product/${productId}`);
      router.refresh();
      toast.success("Product deleted.");
    } catch (error) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Jumlah Tersedia</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{formatPrice(Number(product.price))}</TableCell>
              <TableCell>{format(product.createdAt, "dd MMMM yyyy")}</TableCell>
              <TableCell className="flex items-center">
                <Button asChild variant="outline" size="icon" className="mr-2">
                  <Link href={`/products/${product.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setOpen(true);
                    setProductId(product.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Produk tidak ditemukan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductTableComponent;
