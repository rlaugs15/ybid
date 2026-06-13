import loadingAnimation from "@/assets/loadingAnimation.json";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
}
