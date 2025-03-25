// src/components/TabList.tsx
import React from 'react';

type DevTabCategory = 'MODEL' | 'CONTROLLER' | 'VIEW' | 'CODE' | 'DOCUMENT' | 'COMMUNICATION';

interface TabListProps {
  tabs: chrome.tabs.Tab[];
  category: DevTabCategory;
  onTabClick: (tabId: number) => void;
  onClose: (tabId: number) => void;
  onRename: (tabId: number, currentTitle: string) => void;
  isRenamingTab: number | null;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameComplete: () => void;
}

const TabList: React.FC<TabListProps> = ({
  tabs,
  category,
  onTabClick,
  onClose,
  onRename,
  isRenamingTab,
  renameValue,
  onRenameChange,
  onRenameComplete,
}) => {
  // カテゴリの色マッピング
  const categoryColors: Record<DevTabCategory, string> = {
    MODEL: '#f07178',
    CONTROLLER: '#82aaff',
    VIEW: '#c3e88d',
    CODE: '#c792ea',
    DOCUMENT: '#ffcb6b',
    COMMUNICATION: '#7e57c2',
  };

  // URLの短縮表示
  const formatUrl = (url: string | undefined) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname.length > 20 ? urlObj.pathname.substring(0, 20) + '...' : urlObj.pathname}`;
    } catch (e) {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRenameComplete();
    } else if (e.key === 'Escape') {
      onRenameComplete();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-[#1f2430]">
      {tabs.length === 0 ? (
        <div className="text-center p-4 text-gray-400">
          このカテゴリにタブはありません。
        </div>
      ) : (
        tabs.map((tab) => (
          <div
            key={tab.id}
            className="mb-3 overflow-hidden rounded-md bg-[#292d3e] hover:bg-opacity-80 transition-colors duration-150"
          >
            <div className="flex items-start">
              <div
                className="w-1 self-stretch"
                style={{ backgroundColor: categoryColors[category] }}
              />
              <div
                className="flex-1 p-3 pl-4 cursor-pointer"
                onClick={() => tab.id && onTabClick(tab.id)}
              >
                {isRenamingTab === tab.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => onRenameChange(e.target.value)}
                    onBlur={onRenameComplete}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-[#363c51] px-2 py-1 rounded text-white mb-1"
                  />
                ) : (
                  <div className="font-medium text-white text-base mb-1 truncate">
                    {tab.title}
                  </div>
                )}
                <div className="text-sm text-gray-400 truncate">
                  {formatUrl(tab.url)}
                </div>
              </div>
              <div className="flex flex-col p-2 space-y-2">
                <button
                  className="w-8 h-8 bg-[#363c51] rounded-md hover:bg-[#4a5173] flex items-center justify-center text-white"
                  onClick={() => tab.id && onRename(tab.id, tab.title || '')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button
                  className="w-8 h-8 bg-[#363c51] rounded-md hover:bg-[#f07178] flex items-center justify-center text-white"
                  onClick={() => tab.id && onClose(tab.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
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