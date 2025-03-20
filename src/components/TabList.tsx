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

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  // グループの表示設定
  // src/components/TabList.tsx の groupConfig 配列を修正
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
      // 色を変更 - より見やすい色に
      color: "#7e57c2", // ティールグリーン
      // 他の選択肢:
      // "#64b5f6" (明るい青)
      // "#7986cb" (インディゴ)
      // "#4caf50" (グリーン)
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
        />
      ))}
    </div>
  );
};

export default TabList;
