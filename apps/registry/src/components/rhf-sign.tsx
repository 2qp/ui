"use client";

import { RHFSign } from "@/components/rhf/rhf-sign";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  sign: z
    .custom<File>((value) => value instanceof File, "Must be a File object")
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 5MB.",
    })
    //
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only MP4 and WEBM files are allowed.",
    })
    .nullable(),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}

        <RHFSign
          control={form.control}
          name="sign"
          label="sign"
          description="sign to comply"
          color="#dc2626"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
