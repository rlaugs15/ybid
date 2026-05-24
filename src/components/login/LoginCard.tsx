import SocialLoginButton from "@/components/login/SocialLoginButton";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";

export default function LoginCard() {
  return (
    <section>
      <Card className="px-24 py-15 border-none shadow-xl gap-4 flex justify-center">
        <CardHeader className="flex flex-col justify-center items-center gap-8">
          <h2 className="text-[50px] font-bold">YBID</h2>
          <h2 className="text-h1 font-semibold">로그인</h2>
        </CardHeader>
        <CardDescription className="my-4 text-center">
          구글 계정으로 간편하게 로그인하세요.
        </CardDescription>
        <CardAction>
          <SocialLoginButton imgSrc="/login/google-login-button.png" alt="Google Login" />
        </CardAction>
      </Card>
    </section>
  );
}
