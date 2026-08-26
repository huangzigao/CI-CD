"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, getStoredUser } from "@/lib/auth-storage";
import { isAdmin } from "@/lib/roles";
import { getVideoSummary, mockVideos, type MockVideo } from "@/data/mock-videos";
import type { User } from "@/types/api";
import styles from "../dashboard.module.css";

function getStatusClass(status: MockVideo["status"]) {
  if (status === "已发布") {
    return styles.published;
  }

  if (status === "审核中") {
    return styles.pending;
  }

  return styles.rejected;
}

export default function AdminHome() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const summary = useMemo(() => getVideoSummary(mockVideos), []);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      router.replace("/");
      return;
    }

    if (!isAdmin(storedUser)) {
      router.replace("/home");
      return;
    }

    setUser(storedUser);
  }, [router]);

  function handleLogout() {
    clearAuthSession();
    router.replace("/");
  }

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <p className={styles.brandName}>VideoHub 管理端</p>
            <h1>全部用户上传视频</h1>
            <p className={styles.userMeta}>当前管理员：{user.username || user.account}</p>
          </div>
          <button className={styles.logoutButton} type="button" onClick={handleLogout}>
            退出登录
          </button>
        </header>

        <section className={styles.summaryGrid} aria-label="视频统计">
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>上传总数</p>
            <p className={styles.summaryValue}>{summary.total}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>待审核</p>
            <p className={styles.summaryValue}>{summary.pending}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>已驳回</p>
            <p className={styles.summaryValue}>{summary.rejected}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>总播放量</p>
            <p className={styles.summaryValue}>{summary.views.toLocaleString("zh-CN")}</p>
          </article>
        </section>

        <section aria-labelledby="admin-video-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="admin-video-title">视频列表</h2>
              <p>管理员可查看所有用户上传的视频。</p>
            </div>
          </div>

          <div className={styles.videoGrid}>
            {mockVideos.map((video) => (
              <article className={styles.videoCard} key={video.id}>
                <div className={styles.thumbnail}>
                  <video
                    controls
                    preload="metadata"
                    poster={video.thumbnail}
                    src={video.videoUrl}
                    title={video.title}
                  />
                  <span className={styles.duration}>{video.duration}</span>
                </div>
                <div className={styles.videoBody}>
                  <div className={styles.videoTitleRow}>
                    <h3>{video.title}</h3>
                    <span className={`${styles.status} ${getStatusClass(video.status)}`}>
                      {video.status}
                    </span>
                  </div>
                  <p className={styles.description}>{video.description}</p>
                  <div className={styles.videoMeta}>
                    <span>上传者：{video.uploaderName}</span>
                    <span>分类：{video.category}</span>
                    <span>播放：{video.views.toLocaleString("zh-CN")}</span>
                    <span>上传：{video.uploadedAt}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
