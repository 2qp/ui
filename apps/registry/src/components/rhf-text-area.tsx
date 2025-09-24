"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { RHFTextArea } from "@/components/rhf/rhf-text-area";

const formSchema = z.object({
  text: z.string().min(2, {
    message: "text must be at least 2 characters.",
  }),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFTextArea
          control={form.control}
          name="text"
          label="Name"
          description="something..."
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {"Submit"}
        </Button>
      </form>
    </Form>
  );
};
