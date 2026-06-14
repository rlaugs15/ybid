import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

{
  /* <div className={cn("flex items-center justify-center", className)}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div> */
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  );
}
