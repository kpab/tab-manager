// src/components/TabGroup.tsx
import React, { useState } from "react";
import { GroupedTab } from "../utils/tabUtils";

interface TabGroupProps {
  title: string;
  tabs: GroupedTab[];
  icon: string;
  color: string;
  onRenameTab: (tabId: number, newName: string) => void; // リネーム用コールバック追加
}

const TabGroup: React.FC<TabGroupProps> = ({
  title,
  tabs,
  icon,
  color,
  onRenameTab,
}) => {
  // 編集中のタブIDを保存する状態
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  // 編集中のタブ名を保存する状態
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
    <div className="mb-4">
      <div
        className={`flex items-center px-2 py-1 rounded mb-1`}
        style={{ backgroundColor: color }}
      >
        <span className="font-bold text-white mr-2">{icon}</span>
        <h3 className="font-bold text-white">
          {title} ({tabs.length})
        </h3>
      </div>
      <ul className="space-y-1 pl-2">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className="flex items-center p-1 hover:bg-secondary rounded text-sm cursor-pointer"
            onDoubleClick={() => {
              // ダブルクリックで編集モードに入る
              setEditingTabId(tab.id);
              setEditingTabName(tab.customName || tab.title);
            }}
          >
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} alt="" className="w-4 h-4 mr-2" />
            )}
            {editingTabId === tab.id ? (
              // 編集モード
              <input
                type="text"
                className="bg-secondary text-text-primary w-full px-1 outline-none"
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
