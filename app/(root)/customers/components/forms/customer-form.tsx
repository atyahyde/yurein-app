"use client";

import * as z from "zod";
import { useState } from "react";
import { Customer, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama harus lebih dari 1 karakter" }),
  phone: z
    .string()
    .min(1, { message: "Telepon harus lebih dari 1 karakter" })
    .max(12, { message: "Nomor telepon terlalu panjang" }),
  address: z.string().min(1, { message: "alamat harus lebih dari 1 karakter" }),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  initialData: Customer | null;
}

const CustomerForm = ({ initialData }: CustomerFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Ubah pelanggan" : "Buat pelanggan";
  const description = initialData ? "Ubah pelanggan" : "Tambah pelanggan baru";
  const toastMessage = initialData
    ? "Pelanggan berhasil di update"
    : "Pelanggan berhasil dibuat";
  const action = initialData ? "Simpan perubahan" : "Simpan";

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/customer/${initialData.id}`, data);
      } else {
        await axios.post("/api/customer", data);
      }
      router.refresh();
      toast.success(toastMessage);
      setTimeout(() => {
        router.push("/customers");
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
        await axios.delete(`/api/customer/${initialData.id}`);
      }

      toast.success("customer deleted.");
      router.refresh();
      router.push("/customers");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelanggan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Pelanggan"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Handphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor Handphone"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alamat Pelanggan"
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

export default CustomerForm;
