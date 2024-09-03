"use client";

import * as z from "zod";
import { useState } from "react";
import { Order, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import AlertModal from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OrderStatus } from "@/app/(root)/customers/domain/enums/order-status";
import { PaymentType } from "@/app/(root)/customers/domain/enums/payment-type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  customerId: z
    .string()
    .min(1, { message: "Nama harus lebih dari 1 karakter" }),
  productId: z.string().min(1, { message: "Nama harus lebih dari 1 karakter" }),
  status: z.string().min(1, { message: "Nama harus lebih dari 1 karakter" }),
  qty: z.coerce.number().min(1),
  dateOrder: z.date(),

  desc: z.string(),
  paymentType: z
    .string()
    .min(1, { message: "Nama harus lebih dari 1 karakter" }),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData: Order | null;
  customerId: string;
  products: Product[];
}

const CustomerOrderForm = ({
  initialData,
  products,
  customerId,
}: OrderFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const orderStatus = OrderStatus.getValues();
  const paymentType = PaymentType.getValues();

  const title = initialData ? "Edit pesanan" : "Buat pesanan";
  const description = initialData ? "Edit pesanan" : "Tambah pesanan baru";
  const toastMessage = initialData
    ? "Pesanan berhasil di update"
    : "Pesanan berhasil dibuat";
  const action = initialData ? "Simpan perubahan" : "Buat Pesanan";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dateOrder: initialData.dateOrder ?? undefined,
        }
      : {
          customerId: customerId,
          productId: "",
          status: "new_order",
          qty: 0,
          dateOrder: undefined,
          desc: "",
          paymentType: "",
        },
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/order/${initialData.id}`, data);
      } else {
        await axios.post("/api/order", data);
      }
      router.refresh();
      toast.success(toastMessage);
      setTimeout(() => {
        if (initialData) {
          router.push(`/customers/${initialData.customerId}/detail`);
        } else {
          router.push(`/customers/${customerId}/detail`);
        }
      }, 1000);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(`/api/order/${initialData.id}`);
      }

      router.refresh();
      toast.success("pemesanan berhasil di delete.");
      setTimeout(() => {
        router.push(`/customers/${customerId}/detail`);
      }, 1000);
    } catch (error) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            {loading ? <Spinner /> : <Trash className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="customerId"
              defaultValue={customerId}
              render={({ field }) => (
                <FormItem hidden>
                  <FormLabel>Pelanggan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pelanggan"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Pemesanan</FormLabel>
                  {/* <FormControl> */}
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy")
                          ) : (
                            <span>Pilih Tanggal Pemesanan</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* </FormControl> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produk</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Pilih Produk"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData ? (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value?.toString()}
                            placeholder="Pilih Status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orderStatus.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Status"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah barang</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Jumlah barang"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe pembayaran</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value?.toString()}
                          placeholder="Pilih Tipe Pembayaran"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentType.map((payment) => (
                        <SelectItem key={payment.id} value={payment.id}>
                          {payment.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Pembayaran</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tipe Pembayaran"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="deskripsi"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-auto lg:w-auto w-full"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="w-full absolute bg-black opacity-20 inset-0 flex items-center justify-center  h-screen">
          <Spinner />
        </div>
      )}

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    </>
  );
};

export default CustomerOrderForm;
