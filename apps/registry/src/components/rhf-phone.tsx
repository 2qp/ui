"use client";

import { RHFPhone } from "@/components/rhf/rhf-phone";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const phoneSchema = z
  .object({
    country: z.string().optional(), // e.g., 'US'
    number: z.string(), // e.g., '9876543210'
  })
  .superRefine((data, ctx) => {
    const { country, number } = data;

    const isValid = isValidPhoneNumber(number, {
      defaultCountry: country as any,
    });

    if (!isValid) {
      ctx.addIssue({
        // path: ["number"],
        code: z.ZodIssueCode.custom,
        message: `Invalid ${country || ""} phone number`,
      });
    }

    // Add more countries and rules as needed
  });

const formSchema = z.object({
  phone: phoneSchema,
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      phone: {},
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFPhone control={form.control} name="phone" />

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
