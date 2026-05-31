// lib/api/user.ts

import { User } from "@/types/users";

export const userApi = {
  // 현재 로그인 유저
  async getMe(): Promise<User | null> {
    const res = await fetch("/api/user", {});

    if (!res.ok) return null;

    return res.json();
  },

  // 프로필 수정
  async update(data: { name?: string }): Promise<User> {
    const res = await fetch("/api/user", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("유저 수정 실패");

    return res.json();
  },
};
