// src/utils/storageUtils.ts
// タブ名のカスタム情報を保存/取得するためのユーティリティ

// カスタムタブ名の型定義
export interface CustomTabData {
  [url: string]: {
    customName: string;
  };
}

// ストレージキー
const CUSTOM_TABS_KEY = "devtabs_custom_tabs";

// カスタムタブ名を保存する関数
export const saveCustomTabName = async (url: string, customName: string) => {
  try {
    // 既存のデータを取得
    const data = await getCustomTabData();

    // 新しいデータを追加/更新
    const updatedData: CustomTabData = {
      ...data,
      [url]: { customName },
    };

    // Chromeストレージに保存
    await chrome.storage.sync.set({ [CUSTOM_TABS_KEY]: updatedData });
    return true;
  } catch (error) {
    console.error("カスタムタブ名の保存に失敗しました:", error);
    return false;
  }
};

// 保存されたカスタムタブデータを取得する関数
export const getCustomTabData = async (): Promise<CustomTabData> => {
  try {
    const result = await chrome.storage.sync.get(CUSTOM_TABS_KEY);
    return result[CUSTOM_TABS_KEY] || {};
  } catch (error) {
    console.error("カスタムタブデータの取得に失敗しました:", error);
    return {};
  }
};

// 特定のURLのカスタムタブ名を取得する関数
export const getCustomTabName = async (url: string): Promise<string | null> => {
  try {
    const data = await getCustomTabData();
    return data[url]?.customName || null;
  } catch (error) {
    console.error("カスタムタブ名の取得に失敗しました:", error);
    return null;
  }
};
