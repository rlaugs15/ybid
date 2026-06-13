import { cn } from "@/lib/utils";

interface FallbackMessage {
  message: string;
  className?: string;
}

export default function FallbackMessage({ message, className = "" }: FallbackMessage) {
  return (
    <div className={cn("flex justify-center items-start py-12.25 min-h-87.5", className)}>
      <h3 className="font-bold text-center text-text-sm text-gray-600">{message}</h3>
    </div>
  );
}
