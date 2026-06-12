import { getUser } from "@/services/actions/user/user.api";

export default async function LoginContent() {
  const user = await getUser();

  return <div>{user ? "로그인됨" : "로그인 안됨"}</div>;
}
