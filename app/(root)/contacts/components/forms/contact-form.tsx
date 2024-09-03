"use client";

import * as z from "zod";
import { useState } from "react";
import { Contact } from "@prisma/client";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getContacts } from "@/lib/data";
import Spinner from "@/components/ui/spinner";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(6, { message: "Nama harus lebih dari 6 karakter" }),
  phone: z
    .string()
    .min(1, { message: "Nama harus lebih dari 6 karakter" })
    .max(12, { message: "Phone number is too long" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  initialData: Contact | null;
}

const ContactForm = ({ initialData }: ContactFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit contact" : "Create contact";
  const description = initialData ? "Edit a contact" : "Add a new contact";
  const toastMessage = initialData ? "Contact updated" : "Contact created";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/contact/${initialData.id}`, data);
      } else {
        await axios.post("/api/contact", data);
      }
      router.refresh();
      toast.success(toastMessage);
      setTimeout(() => {
        router.push("/contacts");
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
        await axios.delete(`/api/contact/${initialData.id}`);
      }

      toast.success("Contact deleted.");
      router.refresh();
      router.push("/contacts");
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama" disabled={loading} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
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

export default ContactForm;
