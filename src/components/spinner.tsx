import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const Spinner = ({ size = "sm", className }: SpinnerProps) => {
  return <Loader2 className={cn("animate-spin", className, sizeMap[size])} />;
};

export default Spinner;
