// src/components/TabList.tsx
import React from 'react';
import { Tab } from '../types';

interface TabListProps {
  tabs: Tab[];
  onTabClick: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onRename: (tabId: string, currentTitle: string) => void;
  isRenamingTab: string | null;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameComplete: () => void;
}

const TabList: React.FC<TabListProps> = ({
  tabs,
  onTabClick,
  onClose,
  onRename,
  isRenamingTab,
  renameValue,
  onRenameChange,
  onRenameComplete,
}) => {
  // カテゴリカラーの取得
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MODEL: '#f07178',
      CONTROLLER: '#82aaff',
      VIEW: '#c3e88d',
      CODE: '#c792ea',
      DOCUMENT: '#ffcb6b',
      COMMUNICATION: '#7e57c2',
    };
    return colors[category] || '#8a91a6';
  };

  // URLの短縮表示
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname.length > 20 ? urlObj.pathname.substring(0, 20) + '...' : urlObj.pathname}`;
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  // Enter キー押下時のリネーム確定
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRenameComplete();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-1 bg-gray-900">
      {tabs.length === 0 ? (
        <div className="text-center p-4 text-gray-400">
          このカテゴリにタブはありません。
        </div>
      ) : (
        tabs.map((tab) => (
          <div
            key={tab.id}
            className="mb-2 p-2 bg-gray-700 rounded overflow-hidden flex flex-col"
          >
            <div className="flex items-start relative border-l-4" style={{ borderColor: getCategoryColor(tab.category) }}>
              <div className="pl-2 flex-1 overflow-hidden" onClick={() => onTabClick(tab.id)}>
                {isRenamingTab === tab.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => onRenameChange(e.target.value)}
                    onBlur={onRenameComplete}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-gray-600 px-1 py-0.5 rounded text-white"
                  />
                ) : (
                  <>
                    <div className="font-bold truncate text-white">
                      {tab.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {formatUrl(tab.url)}
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col ml-2">
                <button
                  className="mb-1 p-1 bg-gray-800 rounded hover:bg-gray-600 text-xs"
                  onClick={() => onRename(tab.id, tab.title)}
                >
                  ✎
                </button>
                <button
                  className="p-1 bg-gray-800 rounded hover:bg-red-500 text-xs"
                  onClick={() => onClose(tab.id)}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TabList;