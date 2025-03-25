// src/components/TabList.tsx
import React, { useEffect, useState } from "react";
import { groupTabs, TabType, GroupedTab } from "../utils/tabUtils";
import { getCustomTabData } from "../utils/storageUtils";

// インターフェース定義
interface TabListProps {
  viewMode?: 'sidebar' | 'main';
}

const TabList: React.FC<TabListProps> = ({ viewMode = 'sidebar' }) => {
  const [groupedTabs, setGroupedTabs] = useState<Record<TabType, GroupedTab[]>>({
    model: [],
    controller: [],
    view: [],
    code: [],
    doc: [],
    chat: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [customTabNames, setCustomTabNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // 保存されているカスタムタブ名を取得
    const loadCustomTabNames = async () => {
      const data = await getCustomTabData();
      const names: Record<string, string> = {};

      // URLをキーにしたオブジェクトに変換
      Object.entries(data).forEach(([url, info]) => {
        names[url] = info.customName;
      });

      setCustomTabNames(names);
    };

    loadCustomTabNames();
  }, []);

  useEffect(() => {
    // Chromeのタブ情報を取得
    const fetchTabs = async () => {
      try {
        if (chrome && chrome.tabs) {
          const chromeTabs = await chrome.tabs.query({});
          const grouped = groupTabs(chromeTabs);

          // カスタム名前を適用
          Object.keys(grouped).forEach((key) => {
            const groupType = key as TabType;
            grouped[groupType] = grouped[groupType].map(tab => {
              if (customTabNames[tab.url]) {
                return { ...tab, customName: customTabNames[tab.url] };
              }
              return tab;
            });
          });

          setGroupedTabs(grouped);
        }
        setLoading(false);
      } catch (error) {
        console.error("タブの取得に失敗しました:", error);
        setLoading(false);
      }
    };

    fetchTabs();
  }, [customTabNames]);

  // タブクリック処理
  const handleTabClick = (tabId: number) => {
    if (chrome && chrome.tabs) {
      chrome.tabs.update(tabId, { active: true });
    }
  };

  // グループの表示設定
  const groupConfig = [
    { type: "model" as TabType, title: "Model", icon: "M", color: "#f07178" },
    { type: "controller" as TabType, title: "Controller", icon: "C", color: "#82aaff" },
    { type: "view" as TabType, title: "View", icon: "V", color: "#c3e88d" },
    { type: "code" as TabType, title: "その他のコード", icon: "</>", color: "#c792ea" },
    { type: "doc" as TabType, title: "ドキュメント", icon: "📝", color: "#ffcb6b" },
    { type: "chat" as TabType, title: "コミュニケーション", icon: "💬", color: "#89ddff" },
    { type: "other" as TabType, title: "その他", icon: "🔍", color: "#676e95" }
  ];

  if (loading) {
    return <div className="p-2 text-text-primary">読み込み中...</div>;
  }

  if (viewMode === 'sidebar') {
    return (
      <div className="space-y-4">
        {groupConfig.map((group) => (
          <div key={group.type} className="mb-4">
            {/* グループヘッダー */}
            <div className="bg-[#676e95] rounded p-1.5 px-2 mb-2 flex justify-between items-center">
              <span className="text-white text-xs font-bold">{group.title}</span>
              <span className="text-white text-xs font-bold">{groupedTabs[group.type].length}</span>
            </div>

            {/* タブリスト */}
            <div className="space-y-1">
              {groupedTabs[group.type].map(tab => (
                <div
                  key={tab.id}
                  className="flex items-center p-1.5 rounded text-xs bg-[#1e2132] hover:bg-[#3b4254] cursor-pointer"
                  onClick={() => handleTabClick(tab.id)}
                >
                  {/* 左側のカラーバー */}
                  <div className="w-1 h-full min-h-[20px] mr-2 self-stretch" style={{ backgroundColor: group.color }}></div>

                  {/* アイコン */}
                  <div className="w-5 h-5 flex items-center justify-center mr-2 rounded-full" style={{ backgroundColor: group.color }}>
                    <span className="text-white text-xs font-bold">{group.icon}</span>
                  </div>

                  {/* タブタイトル */}
                  <span className="truncate text-[#a6accd]">{tab.customName || tab.title}</span>
                </div>
              ))}
              {groupedTabs[group.type].length === 0 && (
                <div className="px-2 py-1 text-[#676e95] text-xs italic">タブがありません</div>
              )}
            </div>
          </div>
        ))}

        {/* タスク/カレンダーウィジェット */}
        <div className="mt-4">
          <div className="bg-[#3b4254] rounded-md p-3">
            <h3 className="text-white text-xs font-bold mb-2">今日のタスク</h3>
            <div className="space-y-2">
              <div className="bg-[#1e2132] p-2 rounded text-xs flex justify-between">
                <span>⚠️ タブマネージャー開発</span>
                <span className="text-[#f07178]">今日</span>
              </div>
              <div className="bg-[#1e2132] p-2 rounded text-xs flex justify-between">
                <span>📅 デイリースクラム</span>
                <span className="text-[#c3e88d]">10:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メインビューのデフォルト表示
  return (
    <div className="p-2">
      <p className="text-text-primary">メインビューは開発中です。</p>
    </div>
  );
};

export default TabList;