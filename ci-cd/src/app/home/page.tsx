"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, getStoredUser } from "@/lib/auth-storage";
import { isAdmin } from "@/lib/roles";
import {
  getMockVideosForUser,
  getVideoSummary,
  type MockVideo,
} from "@/data/mock-videos";
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

export default function UserHome() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      router.replace("/");
      return;
    }

    if (isAdmin(storedUser)) {
      router.replace("/admin");
      return;
    }

    setUser(storedUser);
  }, [router]);

  const videos = useMemo(() => (user ? getMockVideosForUser(user) : []), [user]);
  const summary = useMemo(() => getVideoSummary(videos), [videos]);

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
            <p className={styles.brandName}>VideoHub 用户端</p>
            <h1>我的上传视频</h1>
            <p className={styles.userMeta}>当前用户：{user.username || user.account}</p>
          </div>
          <button className={styles.logoutButton} type="button" onClick={handleLogout}>
            退出登录
          </button>
        </header>

        <section className={styles.summaryGrid} aria-label="我的视频统计">
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>我的上传</p>
            <p className={styles.summaryValue}>{summary.total}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>已发布</p>
            <p className={styles.summaryValue}>{summary.published}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>审核中</p>
            <p className={styles.summaryValue}>{summary.pending}</p>
          </article>
          <article className={styles.summaryCard}>
            <p className={styles.summaryLabel}>播放量</p>
            <p className={styles.summaryValue}>{summary.views.toLocaleString("zh-CN")}</p>
          </article>
        </section>

        <section aria-labelledby="user-video-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="user-video-title">我的视频列表</h2>
              <p>普通用户只展示当前账号上传的视频。</p>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className={styles.videoGrid}>
              {videos.map((video) => (
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
                      <span>分类：{video.category}</span>
                      <span>点赞：{video.likes.toLocaleString("zh-CN")}</span>
                      <span>播放：{video.views.toLocaleString("zh-CN")}</span>
                      <span>上传：{video.uploadedAt}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>当前账号还没有上传视频。</div>
          )}
        </section>
      </div>
    </main>
  );
}
