// src/components/TabList.tsx
import React, { useEffect, useState } from "react";
import { groupTabs, TabType, GroupedTab } from "../utils/tabUtils";
import TabGroup from "./TabGroup";
import { saveCustomTabName, getCustomTabData } from "../utils/storageUtils";

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
  // カスタムタブ名を保持する状態を追加
  const [customTabNames, setCustomTabNames] = useState<Record<string, string>>(
    {}
  );

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
            grouped[groupType] = grouped[groupType].map((tab) => {
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
  }, [customTabNames]); // customTabNamesが変更されたらタブ情報を再取得

  // タブ名のリネーム処理を更新
  const handleRenameTab = async (tabId: number, newName: string) => {
    // 全グループからタブを探して更新
    const updatedGroups = { ...groupedTabs };
    let updatedTabUrl: string | null = null;

    Object.keys(updatedGroups).forEach((groupKey) => {
      const groupType = groupKey as TabType;
      updatedGroups[groupType] = updatedGroups[groupType].map((tab) => {
        if (tab.id === tabId) {
          updatedTabUrl = tab.url;
          return { ...tab, customName: newName };
        }
        return tab;
      });
    });

    setGroupedTabs(updatedGroups);

    // カスタム名前を保存
    if (updatedTabUrl) {
      await saveCustomTabName(updatedTabUrl, newName);
      setCustomTabNames((prev) => ({
        ...prev,
        [updatedTabUrl!]: newName,
      }));
    }
  };
  // タブクリック処理の追加
  const handleTabClick = (tabId: number) => {
    if (chrome && chrome.tabs) {
      chrome.tabs.update(tabId, { active: true });
    }
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
    <div className="p-4">
      {groupConfig.map((group) => (
        <TabGroup
          key={group.type}
          title={group.title}
          tabs={groupedTabs[group.type]}
          icon={group.icon}
          color={group.color}
          onRenameTab={handleRenameTab}
          onTabClick={handleTabClick}
        />
      ))}
    </div>
  );
};

export default TabList;
