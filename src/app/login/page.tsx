import LoginBrand from "@/components/login/LoginBrand";
import LoginCard from "@/components/login/LoginCard";

export default function LoginPage() {
  return (
    <div className="flex gap-40 justify-center h-screen items-center">
      <LoginBrand />
      <LoginCard />
    </div>
  );
}
