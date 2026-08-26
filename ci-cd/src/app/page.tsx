"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuthSession } from "@/lib/auth-storage";
import { ApiError } from "@/lib/http";
import { getPostLoginPath } from "@/lib/roles";
import { authApi } from "@/services/auth";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await authApi.login({
        account: account.trim(),
        password,
      });

      saveAuthSession(result.token, result.user);
      setIsSuccess(true);
      setMessage("登录成功");
      router.replace(getPostLoginPath(result.user));
    } catch (error) {
      setIsSuccess(false);
      setMessage(error instanceof ApiError ? error.message : "登录失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.header}>
          <p className={styles.eyebrow}>VideoHub</p>
          <h1 id="login-title">视频平台登录</h1>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.field}>
            <span>账号</span>
            <input
              type="text"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="请输入账号"
              autoComplete="username"
            />
          </label>

          <label className={styles.field}>
            <span>密码</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </label>

          <button className={styles.loginButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "登录中..." : "登录"}
          </button>

          {message ? (
            <p
              className={isSuccess ? styles.successMessage : styles.errorMessage}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>

        <p className={styles.mockTip}>登录接口继续使用后端服务，登录后的首页数据当前使用模拟视频数据。</p>
      </section>
    </main>
  );
}
