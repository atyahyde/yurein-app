"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderProps } from "@/app/(root)/customers/[customerId]/detail/page";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AlertModal from "@/components/modals/alert-modal";
import { OrderStatus } from "@/app/(root)/customers/domain/enums/order-status";

interface InfoCardProps {
  data: OrderProps;
  customerId: string;
}

const variantMap: {
  [key: string]:
    | "blue"
    | "secondary"
    | "success"
    | "destructive"
    | "default"
    | "outline";
} = {
  outline: "outline",
  blue: "blue",
  secondary: "secondary",
  success: "success",
  destructive: "destructive",
};

const OrderCard = ({ data, customerId }: InfoCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const orderStatus = OrderStatus.find(data.status);

  const variant:
    | "blue"
    | "secondary"
    | "success"
    | "destructive"
    | "default"
    | "outline"
    | null
    | undefined =
    (orderStatus?.bgColor && variantMap[orderStatus.bgColor.toString()]) ||
    "default";
  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/order/${orderId}`);
      router.refresh();
      toast.success("Pesanan telah terhapus.");
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
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-start">
              {data.dateOrder && format(data.dateOrder, "dd MMMM yyyy")}{" "}
              <Badge variant={variant}>{orderStatus?.text}</Badge>
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-semibold">{data.name}</div>
          <div className="text-muted-foreground">{data.desc}</div>
          <div className="pt-4">
            Harga satuan:{" "}
            <span className="font-semibold">
              {formatPrice(Number(data.price))}
            </span>
          </div>
          <div>
            Jumlah Pemesanan:{" "}
            <span className="font-semibold">{data.qty.toString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground flex justify-end">x</span>
            <Separator className="mb-4" />
            <div className="font-semibold">
              Total {formatPrice(Number(data.price) * data.qty)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <Link href={`../${customerId}/${data.id}`}>Edit</Link>
          </Button>
          <Button
            className="ml-2"
            variant="destructive"
            onClick={() => {
              setOpen(true);
              setOrderId(data.id);
            }}
          >
            Hapus
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default OrderCard;
