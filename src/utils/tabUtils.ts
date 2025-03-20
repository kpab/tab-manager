// src/utils/tabUtils.ts

export type TabType =
  | "code"
  | "model"
  | "controller"
  | "view"
  | "doc"
  | "chat"
  | "other";

export interface GroupedTab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  type: TabType;
  customName?: string;
}

// URLに基づいてタブタイプを検出する関数
export const detectTabType = (url: string, title: string): TabType => {
  // URLパターンをチェック
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();

  // GitBucket関連のコードファイルの検出
  if (urlLower.includes("gitbucket") && urlLower.includes("/blob/")) {
    // MVCパターンの検出
    if (urlLower.includes("/models/") || urlLower.includes("model.")) {
      return "model";
    }
    if (
      urlLower.includes("/controllers/") ||
      urlLower.includes("controller.")
    ) {
      return "controller";
    }
    if (urlLower.includes("/views/") || urlLower.includes("view.")) {
      return "view";
    }
    return "code";
  }

  // ドキュメント系の検出
  if (
    urlLower.includes("docs.google.com") ||
    urlLower.includes("confluence") ||
    titleLower.includes("仕様") ||
    titleLower.includes("spec") ||
    titleLower.includes("document")
  ) {
    return "doc";
  }

  // コミュニケーションツール
  if (
    urlLower.includes("chatwork") ||
    urlLower.includes("slack.com") ||
    urlLower.includes("teams.microsoft")
  ) {
    return "chat";
  }

  // その他
  return "other";
};

// タブをグループ化する関数
export const groupTabs = (
  tabs: chrome.tabs.Tab[]
): Record<TabType, GroupedTab[]> => {
  // 初期グループを作成
  const groups: Record<TabType, GroupedTab[]> = {
    model: [],
    controller: [],
    view: [],
    code: [],
    doc: [],
    chat: [],
    other: [],
  };

  // タブを分類
  tabs.forEach((tab) => {
    const type = detectTabType(tab.url || "", tab.title || "");
    groups[type].push({
      id: tab.id || 0,
      title: tab.title || "Untitled",
      url: tab.url || "",
      favIconUrl: tab.favIconUrl,
      type,
    });
  });

  return groups;
};
