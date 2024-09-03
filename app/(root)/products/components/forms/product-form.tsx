"use client";

import * as z from "zod";
import { useState } from "react";
import { Product } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama harus lebih dari 1 karakter" }),
  stock: z.coerce.number().min(1),
  price: z.coerce.number().min(1),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product | null;
}

const ProductForm = ({ initialData }: ProductFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Ubah produk" : "Buat produk";
  const description = initialData ? "Ubah produk" : "Tambah Produk baru";
  const toastMessage = initialData
    ? "Produk berhasil di update"
    : "Produk berhasil dibuat";
  const action = initialData ? "Save Changes" : "Simpan";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          stock: parseInt(String(initialData?.stock)),
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          stock: 0,
          price: 0,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/product/${initialData.id}`, data);
      } else {
        await axios.post("/api/product", data);
      }
      router.refresh();
      toast.success(toastMessage);
      setTimeout(() => {
        router.push("/products");
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
        await axios.delete(`/api/product/${initialData.id}`);
      }

      toast.success("product deleted.");
      router.refresh();
      router.push("/product");
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
          <div className="grid lg:grid-cols-3 grid-cols-1  gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Produk"
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
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barang tersedia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jumlah barang tersedia"
                      type="number"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Harga"
                      type="number"
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", ",", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
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
            className="ml-auto w-full lg:w-auto"
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

export default ProductForm;
