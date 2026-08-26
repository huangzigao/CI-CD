import type { User } from "@/types/api";

const TOKEN_KEY = "cicd-manager-token";
const USER_KEY = "cicd-manager-user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveAuthSession(token: string, user: User) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
