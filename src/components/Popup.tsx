// src/components/Popup.tsx
import React, { useEffect, useState } from 'react';
import { categorizeTab } from '../utils/tabUtils';

// TabCategory型の定義
type DevTabCategory = 'MODEL' | 'CONTROLLER' | 'VIEW' | 'CODE' | 'DOCUMENT' | 'COMMUNICATION';

const Popup: React.FC = () => {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [categories, setCategories] = useState<Record<DevTabCategory, chrome.tabs.Tab[]>>({
        MODEL: [],
        CONTROLLER: [],
        VIEW: [],
        CODE: [],
        DOCUMENT: [],
        COMMUNICATION: [],
    });
    const [selectedCategory, setSelectedCategory] = useState<DevTabCategory>('CODE');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRenamingTab, setIsRenamingTab] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState('');

    useEffect(() => {
        // タブの初期取得
        chrome.tabs.query({}, (result) => {
            setTabs(result);

            // カテゴリー別にタブを整理
            const categorizedTabs: Record<DevTabCategory, chrome.tabs.Tab[]> = {
                MODEL: [],
                CONTROLLER: [],
                VIEW: [],
                CODE: [],
                DOCUMENT: [],
                COMMUNICATION: [],
            };

            result.forEach((tab) => {
                const category = categorizeTab(tab) as DevTabCategory;
                if (categorizedTabs[category]) {
                    categorizedTabs[category].push(tab);
                } else {
                    categorizedTabs.CODE.push(tab);
                }
            });

            setCategories(categorizedTabs);

            // タブが存在するカテゴリを初期選択
            const firstNonEmptyCategory = Object.keys(categorizedTabs).find(
                (category) => categorizedTabs[category as DevTabCategory].length > 0
            ) as DevTabCategory;

            if (firstNonEmptyCategory) {
                setSelectedCategory(firstNonEmptyCategory);
            }
        });
    }, []);

    // タブへの移動
    const navigateToTab = (tabId: number) => {
        chrome.tabs.update(tabId, { active: true });
    };

    // タブの閉じる処理
    const closeTab = (tabId: number) => {
        chrome.tabs.remove(tabId, () => {
            setTabs(tabs.filter(tab => tab.id !== tabId));

            // カテゴリからも削除
            const updatedCategories = { ...categories };
            Object.keys(updatedCategories).forEach((category) => {
                const typedCategory = category as DevTabCategory;
                updatedCategories[typedCategory] = updatedCategories[typedCategory].filter(
                    (tab) => tab.id !== tabId
                );
            });

            setCategories(updatedCategories);
        });
    };

    // タブのリネーム開始
    const startRenaming = (tabId: number, currentTitle: string) => {
        setIsRenamingTab(tabId);
        setRenameValue(currentTitle);
    };

    // タブのリネーム確定
    const finishRenaming = () => {
        if (isRenamingTab !== null && renameValue.trim() !== '') {
            // Chrome Storageにリネーム情報を保存
            chrome.storage.sync.get(['renamedTabs'], (result) => {
                const renamedTabs = result.renamedTabs || {};
                renamedTabs[isRenamingTab] = renameValue;

                chrome.storage.sync.set({ renamedTabs }, () => {
                    console.log('Tab renamed and saved');
                });
            });
        }

        setIsRenamingTab(null);
        setRenameValue('');
    };

    // 検索処理
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // カテゴリ選択
    const selectCategory = (category: DevTabCategory) => {
        setSelectedCategory(category);
    };

    // カテゴリ名を取得
    const getCategoryName = (category: DevTabCategory): string => {
        const names: Record<DevTabCategory, string> = {
            MODEL: 'Model',
            CONTROLLER: 'Controller',
            VIEW: 'View',
            CODE: 'Code',
            DOCUMENT: 'Docs',
            COMMUNICATION: 'Comm',
        };
        return names[category];
    };

    // 検索フィルター適用
    const getFilteredTabs = (category: DevTabCategory) => {
        if (!searchQuery.trim()) {
            return categories[category];
        }

        return categories[category].filter((tab) =>
            (tab.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tab.url || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // カテゴリの色を取得
    const getCategoryColor = (category: DevTabCategory): string => {
        const colors: Record<DevTabCategory, string> = {
            MODEL: '#f07178',
            CONTROLLER: '#82aaff',
            VIEW: '#c3e88d',
            CODE: '#c792ea',
            DOCUMENT: '#ffcb6b',
            COMMUNICATION: '#7e57c2',
        };
        return colors[category];
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

    // 全タブ数を計算
    const getTotalTabCount = () => {
        return Object.values(categories).reduce((total, tabs) => total + tabs.length, 0);
    };

    // 表示するカテゴリを絞り込む（空でないカテゴリのみ）
    const getVisibleCategories = () => {
        return Object.keys(categories).filter(
            (category) => categories[category as DevTabCategory].length > 0
        ) as DevTabCategory[];
    };

    // Enter キー押下時のリネーム確定
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            finishRenaming();
        } else if (e.key === 'Escape') {
            setIsRenamingTab(null);
            setRenameValue('');
        }
    };

    const selectedCategoryTabs = getFilteredTabs(selectedCategory);

    return (
        <div className="w-full h-full flex flex-col bg-[#1f2430]">
            {/* タイトル */}
            <div className="text-center text-white p-4">
                <h1 className="text-4xl font-bold">DevTabs</h1>
            </div>

            {/* 検索ボックス */}
            <div className="px-4 mb-2">
                <input
                    type="text"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 bg-[#292d3e] rounded text-white placeholder:text-gray-400 focus:outline-none"
                />
            </div>

            {/* カテゴリリスト */}
            <div>
                {getVisibleCategories().map((category) => {
                    const isSelected = category === selectedCategory;
                    const tabCount = categories[category].length;

                    return (
                        <div
                            key={category}
                            className={`py-2 text-center cursor-pointer text-white`}
                            style={{
                                backgroundColor: isSelected ? getCategoryColor(category) : 'transparent',
                            }}
                            onClick={() => selectCategory(category)}
                        >
                            {getCategoryName(category)}{tabCount}
                        </div>
                    );
                })}
            </div>

            {/* 選択されたカテゴリのタイトル */}
            <div className="text-center text-white py-2">
                {getCategoryName(selectedCategory)}{selectedCategoryTabs.length} タブ
            </div>

            {/* 選択されたカテゴリのタブリスト */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2">
                {selectedCategoryTabs.map((tab) => (
                    <div
                        key={tab.id}
                        className="bg-[#292d3e] rounded overflow-hidden text-white"
                    >
                        <div
                            className="px-3 py-2 cursor-pointer"
                            onClick={() => tab.id && navigateToTab(tab.id)}
                        >
                            {isRenamingTab === tab.id ? (
                                <input
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onBlur={finishRenaming}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="w-full bg-[#363c51] px-2 py-1 rounded text-white mb-1"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div className="font-medium mb-1 truncate">
                                    {tab.title}
                                </div>
                            )}
                            <div className="text-xs text-gray-400 truncate">
                                {formatUrl(tab.url)}
                            </div>
                        </div>
                        <div className="flex justify-end pb-2 pr-2">
                            <button
                                className="p-1 mr-1 text-white bg-[#363c51] rounded hover:bg-[#4a5173]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    tab.id && startRenaming(tab.id, tab.title || '');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </button>
                            <button
                                className="p-1 text-white bg-[#363c51] rounded hover:bg-[#f07178]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    tab.id && closeTab(tab.id);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* フッター */}
            <div className="p-3 text-center text-white border-t border-[#363c51]">
                <div className="text-gray-400 mb-2">
                    合計: {getTotalTabCount()} タブ
                </div>
                <button
                    className="w-1/2 py-2 bg-[#292d3e] rounded hover:bg-[#363c51]"
                >
                    タブを整理
                </button>
            </div>
        </div>
    );
};

export default Popup;