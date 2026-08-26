import type { User } from "@/types/api";

export interface MockVideo {
  id: number;
  title: string;
  description: string;
  uploaderId: number;
  uploaderName: string;
  category: string;
  status: "已发布" | "审核中" | "已驳回";
  views: number;
  likes: number;
  duration: string;
  uploadedAt: string;
  thumbnail: string;
  videoUrl: string;
}

export const mockVideos: MockVideo[] = [
  {
    id: 1001,
    title: "城市夜跑记录",
    description: "一次沿河步道的夜跑拍摄，包含运动数据和路线回顾。",
    uploaderId: 2,
    uploaderName: "普通用户",
    category: "生活",
    status: "已发布",
    views: 12840,
    likes: 936,
    duration: "08:42",
    uploadedAt: "2026-08-01",
    thumbnail:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 1002,
    title: "剪辑工作流入门",
    description: "从素材整理到成片导出，快速梳理短视频剪辑流程。",
    uploaderId: 2,
    uploaderName: "普通用户",
    category: "教程",
    status: "审核中",
    views: 3200,
    likes: 188,
    duration: "12:05",
    uploadedAt: "2026-08-04",
    thumbnail:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 1003,
    title: "周末露营 Vlog",
    description: "记录山谷营地、轻量装备和晚间篝火片段。",
    uploaderId: 3,
    uploaderName: "林舟",
    category: "旅行",
    status: "已发布",
    views: 45820,
    likes: 3904,
    duration: "16:28",
    uploadedAt: "2026-07-28",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 1004,
    title: "摄影构图练习",
    description: "用街头样张讲解前景、留白和视觉引导线。",
    uploaderId: 4,
    uploaderName: "向南",
    category: "摄影",
    status: "已驳回",
    views: 760,
    likes: 51,
    duration: "06:36",
    uploadedAt: "2026-08-05",
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 1005,
    title: "咖啡拉花练习日记",
    description: "对比不同奶泡状态下的拉花稳定性。",
    uploaderId: 2,
    uploaderName: "普通用户",
    category: "美食",
    status: "已发布",
    views: 9840,
    likes: 814,
    duration: "05:19",
    uploadedAt: "2026-08-06",
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

export function getVideosByUploader(uploaderId: number) {
  return mockVideos.filter((video) => video.uploaderId === uploaderId);
}

export function getMockVideosForUser(user: User) {
  const ownVideos = getVideosByUploader(user.id);

  if (ownVideos.length > 0) {
    return ownVideos;
  }

  return mockVideos.slice(0, 2).map((video) => ({
    ...video,
    uploaderId: user.id,
    uploaderName: user.username || user.account,
  }));
}

export function getVideoSummary(videos: MockVideo[]) {
  return {
    total: videos.length,
    published: videos.filter((video) => video.status === "已发布").length,
    pending: videos.filter((video) => video.status === "审核中").length,
    rejected: videos.filter((video) => video.status === "已驳回").length,
    views: videos.reduce((sum, video) => sum + video.views, 0),
  };
}
