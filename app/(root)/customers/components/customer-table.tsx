"use client";

import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

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
import { Customer } from "@prisma/client";
import { FaEye } from "react-icons/fa";

interface CustomerTableProps {
  data: Customer[];
}

const CustomerTableComponent = ({ data }: CustomerTableProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/customer/${customerId}`);
      router.refresh();
      toast.success("Pelanggan telah terhapus.");
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
            <TableHead>Nama Pelanggan</TableHead>
            <TableHead>Nomor Telepon</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                {format(customer.createdAt, "dd MMMM yyyy")}
              </TableCell>
              <TableCell className="flex items-center">
                <Button asChild variant="outline" size="icon" className="mr-2">
                  <Link href={`/customers/${customer.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon" className="mr-2">
                  <Link href={`/customers/${customer.id}/detail`}>
                    <FaEye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setOpen(true);
                    setCustomerId(customer.id);
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
                Pelanggan tidak ditemukan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default CustomerTableComponent;
