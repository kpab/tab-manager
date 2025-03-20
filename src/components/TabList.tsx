// src/components/TabList.tsx
import React, { useEffect, useState } from "react";
import { groupTabs, TabType, GroupedTab } from "../utils/tabUtils";
import TabGroup from "./TabGroup";

const TabList: React.FC = () => {
  const [groupedTabs, setGroupedTabs] = useState<Record<TabType, GroupedTab[]>>(
    {
      model: [],
      controller: [],
      view: [],
      code: [],
      doc: [],
      chat: [],
      other: [],
    }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chromeのタブ情報を取得
    const fetchTabs = async () => {
      try {
        if (chrome && chrome.tabs) {
          const chromeTabs = await chrome.tabs.query({});
          const grouped = groupTabs(chromeTabs);
          setGroupedTabs(grouped);
        }
        setLoading(false);
      } catch (error) {
        console.error("タブの取得に失敗しました:", error);
        setLoading(false);
      }
    };

    fetchTabs();
  }, []);

  // タブ名のリネーム処理
  const handleRenameTab = (tabId: number, newName: string) => {
    // 全グループからタブを探して更新
    const updatedGroups = { ...groupedTabs };

    Object.keys(updatedGroups).forEach((groupKey) => {
      const groupType = groupKey as TabType;
      updatedGroups[groupType] = updatedGroups[groupType].map((tab) => {
        if (tab.id === tabId) {
          return { ...tab, customName: newName };
        }
        return tab;
      });
    });

    setGroupedTabs(updatedGroups);

    // TODO: リネーム情報を永続化する（次のステップで実装）
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  // グループの表示設定
  const groupConfig = [
    { type: "model" as TabType, title: "Model", icon: "M", color: "#f07178" },
    {
      type: "controller" as TabType,
      title: "Controller",
      icon: "C",
      color: "#82aaff",
    },
    { type: "view" as TabType, title: "View", icon: "V", color: "#c3e88d" },
    {
      type: "code" as TabType,
      title: "その他のコード",
      icon: "</>",
      color: "#c792ea",
    },
    {
      type: "doc" as TabType,
      title: "ドキュメント",
      icon: "📝",
      color: "#ffcb6b",
    },
    {
      type: "chat" as TabType,
      title: "コミュニケーション",
      icon: "💬",
      color: "#7e57c2", // 深めの紫色
    },
    { type: "other" as TabType, title: "その他", icon: "🔍", color: "#676e95" },
  ];

  return (
    <div className="p-2">
      {groupConfig.map((group) => (
        <TabGroup
          key={group.type}
          title={group.title}
          tabs={groupedTabs[group.type]}
          icon={group.icon}
          color={group.color}
          onRenameTab={handleRenameTab}
        />
      ))}
    </div>
  );
};

export default TabList;
