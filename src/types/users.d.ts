import { Tables } from "./database.types";

type role = "owner" | "leader" | "member";

type User = Omit<Tables<"users">, "email" | "role"> & {
  role: role;
};
