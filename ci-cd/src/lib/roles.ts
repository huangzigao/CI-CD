import type { User } from "@/types/api";

export const ADMIN_ROLE = 1;

export function isAdmin(user: User) {
  return user.role === ADMIN_ROLE;
}

export function getPostLoginPath(user: User) {
  return isAdmin(user) ? "/admin" : "/home";
}
