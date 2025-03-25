// src/components/TabGroup.tsx の修正
import React, { useState } from "react";

interface GroupedTab {
  id: number;
  group: string;
  title: string;
  customName?: string;
  favIconUrl?: string;
  tabs: chrome.tabs.Tab[];
}

interface TabGroupProps {
  title: string;
  tabs: GroupedTab[];
  icon: string;
  color: string;
  onRenameTab: (tabId: number, newName: string) => void;
  onTabClick?: (tabId: number) => void; // タブクリック処理用のコールバック追加
}

const TabGroup: React.FC<TabGroupProps> = ({
  title,
  tabs,
  icon,
  color,
  onRenameTab,
  onTabClick,
}) => {
  // 既存のstate
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const [editingTabName, setEditingTabName] = useState<string>("");


  // リネームを確定する関数
  const confirmRename = () => {
    if (editingTabId !== null && editingTabName.trim() !== "") {
      onRenameTab(editingTabId, editingTabName);
    }
    setEditingTabId(null);
  };

  if (tabs.length === 0) return null;

  return (
    <div className="mb-5">
      <div
        className={`flex items-center px-3 py-2 rounded-md mb-2`}
        style={{ backgroundColor: color }}
      >
        <span className="font-bold text-white text-xl mr-3">{icon}</span>
        <h3 className="font-bold text-white text-base">
          {title} ({tabs.length})
        </h3>
      </div>
      <ul className="space-y-2 pl-3">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className="flex items-center p-2 hover:bg-secondary rounded-md text-sm cursor-pointer"
            onClick={() => {
              // 編集モードでなければクリックイベントを発火
              if (editingTabId !== tab.id && onTabClick) {
                onTabClick(tab.id);
              }
            }}
            onDoubleClick={() => {
              // ダブルクリックで編集モードに入る
              setEditingTabId(tab.id);
              setEditingTabName(tab.customName || tab.title);
            }}
          >
            {tab.favIconUrl && (
              <img
                src={tab.favIconUrl}
                alt=""
                className="w-5 h-5 mr-3 flex-shrink-0"
              />
            )}
            {editingTabId === tab.id ? (
              // 編集モード
              <input
                type="text"
                className="bg-secondary text-text-primary w-full px-2 py-1 rounded outline-none"
                value={editingTabName}
                onChange={(e) => setEditingTabName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Enter キーで編集完了
                    confirmRename();
                  } else if (e.key === "Escape") {
                    // Escape キーでキャンセル
                    setEditingTabId(null);
                  }
                }}
                onBlur={() => {
                  // フォーカスを失ったら編集終了し変更を保存
                  confirmRename();
                }}
                // イベントの伝播を停止
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              // 通常表示モード
              <span className="truncate">{tab.customName || tab.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabGroup;
