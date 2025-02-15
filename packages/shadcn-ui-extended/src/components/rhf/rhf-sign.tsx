import { Button } from "@repo/shadcn-ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useRef, useState } from "react";

import type { JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFSignStyles = {
  signClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFSignProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  color?: string;

  readOnly?: boolean;
  disabled?: boolean;

  tabIndex?: number;

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFSignStyles;
};

type RHFSignType = <T extends FieldValues>(
  props: RHFSignProps<T>
) => JSX.Element;

const RHFSign: RHFSignType = ({
  control,
  name,
  description,
  disabled,
  label,
  placeholder,
  readOnly,
  styles,

  color = "#000",
  tabIndex = -1,
}) => {
  //

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [drawing, setDrawing] = useState<boolean>(false);

  //
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    lastPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setDrawing(true);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
  };

  //
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    lastPos.current = { x, y };
  };

  //
  const stopDrawing = () => setDrawing(false);

  //
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  //
  const getCanvasAsFile = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("No canvas found");
    }

    const file = await new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject("Failed to create blob");
          return;
        }

        const file = new File([blob], "canvas-image.png", {
          type: "image/png",
        });

        resolve(file);
      }, "image/png");
    });

    return file;
  };

  //
  const makeItDOwnload = async () => {
    const file = await getCanvasAsFile();

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  //
  const pipeChangesOnDrawingStops = async (
    onChange: (...event: unknown[]) => void
  ) => {
    //
    stopDrawing();
    const file = await getCanvasAsFile();
    onChange(file);
  };

  //
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, [color]);

  //
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //

        return (
          <FormItem>
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              {/*  */}

              <div
                tabIndex={tabIndex}
                ref={(e) => {
                  field.ref(e);
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={300}
                  className="rounded-md border border-input"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={() => pipeChangesOnDrawingStops(field.onChange)}
                  onMouseLeave={stopDrawing}
                />

                <FormDescription
                  className={cn("py-2", styles?.descriptionClassName)}
                >
                  {description}
                </FormDescription>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={"secondary"}
                    onClick={() => {
                      clearSignature();
                      field.onChange();
                    }}
                  >
                    {"Clear"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={makeItDOwnload}
                  >
                    {"Save"}
                  </Button>
                </div>
              </div>

              {/*  */}
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { RHFSign };
export type { RHFSignProps, RHFSignType };
