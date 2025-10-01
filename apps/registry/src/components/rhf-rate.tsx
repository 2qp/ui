"use client";

import { RHFRate } from "@/components/rhf/rhf-rate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Angry, Frown, Laugh, Meh, Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RATING_OPTIONS = [
  {
    label: "Relaxed",
    value: "relax",
    element: <Laugh className="text-teal-400" />,
  },
  {
    label: "Content",
    value: "content",
    element: <Smile className="text-blue-400" />,
  },
  {
    label: "Indifferent",
    value: "meh",
    element: <Meh className="text-white" />,
  },
  {
    label: "Frustrated",
    value: "bruh",
    element: <Frown className="text-orange-500" />,
  },
  {
    label: "Angry",
    value: "amgry",
    element: <Angry className="text-red-600" />,
  },
] as const;

const MOOD_VALUES = RATING_OPTIONS.map((type) => type.value) as [
  (typeof RATING_OPTIONS)[number]["value"],
];

const formSchema = z.object({
  rating: z.enum(MOOD_VALUES),
  mood: z.enum(MOOD_VALUES),
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

        <RHFRate
          control={form.control}
          name="rating"
          label="Rate"
          items={RATING_OPTIONS}
        />

        <RHFRate
          control={form.control}
          name="mood"
          label="Mood"
          items={RATING_OPTIONS}
          type="mood"
          description="something..."
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
