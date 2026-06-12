import { Tables } from "./database.types";

type role = "owner" | "leader" | "member";

type User = Pick<Tables<"users">, "id" | "name" | "created_at"> & {
  role: role;
};
