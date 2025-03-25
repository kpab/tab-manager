// src/utils/TabUtils.ts
import { TabCategory } from "../types";

/**
 * タブを適切なカテゴリに分類します
 */
export const categorizeTab = (tab: chrome.tabs.Tab): TabCategory => {
  const url = tab.url || "";
  const title = tab.title || "";

  // URLと titleを小文字に変換して検索しやすくする
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // MODEL関連の判定
  if (
    /model|entity|schema|database|db\/|repository|dao|dto/i.test(lowerUrl) ||
    /model|entity|schema|database|repository|dao|dto/i.test(lowerTitle)
  ) {
    return "MODEL";
  }

  // CONTROLLER関連の判定
  if (
    /controller|service|handler|action|route/i.test(lowerUrl) ||
    /controller|service|handler|action|route/i.test(lowerTitle)
  ) {
    return "CONTROLLER";
  }

  // VIEW関連の判定
  if (
    /view|component|template|jsx|tsx|css|scss|style|ui\//i.test(lowerUrl) ||
    /view|component|template|style|ui|react|vue|angular/i.test(lowerTitle)
  ) {
    return "VIEW";
  }

  // ドキュメント関連の判定
  if (
    /docs|document|confluence|notion|google\.com\/document|readme|wiki|specification|spec|markdown|md$/i.test(
      lowerUrl
    ) ||
    /documentation|manual|guide|spec|specification/i.test(lowerTitle)
  ) {
    return "DOCUMENT";
  }

  // コミュニケーションツール関連の判定
  if (
    /slack\.com|teams|discord|chat|mail|gmail|outlook|chatwork|messenger/i.test(
      lowerUrl
    )
  ) {
    return "COMMUNICATION";
  }

  // その他のコード関連の判定
  if (
    /github\.com|gitlab|bitbucket|\.js$|\.ts$|\.py$|\.java$|\.rb$|\.go$|\.php$|\.c$|\.cpp$|\.cs$/i.test(
      lowerUrl
    ) ||
    /code|script|function|class|programming|algorithm|development/i.test(
      lowerTitle
    )
  ) {
    return "CODE";
  }

  // デフォルトは CODE カテゴリ
  return "CODE";
};

/**
 * カテゴリ名を取得する
 */
export const getCategoryName = (category: TabCategory): string => {
  const names: Record<TabCategory, string> = {
    MODEL: "Model",
    CONTROLLER: "Controller",
    VIEW: "View",
    CODE: "Code",
    DOCUMENT: "Docs",
    COMMUNICATION: "Comm",
  };
  return names[category];
};

/**
 * カテゴリの色コードを取得する
 */
export const getCategoryColor = (category: TabCategory): string => {
  const colors: Record<TabCategory, string> = {
    MODEL: "#f07178",
    CONTROLLER: "#82aaff",
    VIEW: "#c3e88d",
    CODE: "#c792ea",
    DOCUMENT: "#ffcb6b",
    COMMUNICATION: "#7e57c2",
  };
  return colors[category];
};
