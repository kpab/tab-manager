// src/components/Popup.tsx
import React, { useEffect, useState } from 'react';
import { Tab, TabCategory } from '../types';
import { categorizeTab } from '../utils/TabUtils';
import CategoryList from './CategoryList';
import TabList from './TabList';

const Popup: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [categories, setCategories] = useState<Record<TabCategory, Tab[]>>({
        MODEL: [],
        CONTROLLER: [],
        VIEW: [],
        CODE: [],
        DOCUMENT: [],
        COMMUNICATION: [],
    });
    const [selectedCategory, setSelectedCategory] = useState<TabCategory>('CONTROLLER');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRenamingTab, setIsRenamingTab] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    useEffect(() => {
        // タブの初期取得
        chrome.tabs.query({}, (result) => {
            const allTabs = result.map((tab) => ({
                id: tab.id?.toString() || '',
                title: tab.title || '',
                url: tab.url || '',
                favIconUrl: tab.favIconUrl || '',
                category: categorizeTab(tab),
            }));

            setTabs(allTabs);

            // カテゴリー別にタブを整理
            const categorizedTabs: Record<TabCategory, Tab[]> = {
                MODEL: [],
                CONTROLLER: [],
                VIEW: [],
                CODE: [],
                DOCUMENT: [],
                COMMUNICATION: [],
            };

            allTabs.forEach((tab) => {
                if (tab.category) {
                    categorizedTabs[tab.category].push(tab);
                }
            });

            setCategories(categorizedTabs);
        });
    }, []);

    // タブへの移動
    const navigateToTab = (tabId: string) => {
        chrome.tabs.update(parseInt(tabId), { active: true });
    };

    // タブの閉じる処理
    const closeTab = (tabId: string) => {
        chrome.tabs.remove(parseInt(tabId), () => {
            setTabs(tabs.filter(tab => tab.id !== tabId));

            // カテゴリからも削除
            const updatedCategories = { ...categories };
            Object.keys(updatedCategories).forEach((category) => {
                const typedCategory = category as TabCategory;
                updatedCategories[typedCategory] = updatedCategories[typedCategory].filter(
                    (tab) => tab.id !== tabId
                );
            });

            setCategories(updatedCategories);
        });
    };

    // タブのリネーム開始
    const startRenaming = (tabId: string, currentTitle: string) => {
        setIsRenamingTab(tabId);
        setRenameValue(currentTitle);
    };

    // タブのリネーム確定
    const finishRenaming = () => {
        if (isRenamingTab) {
            // Chrome Storageにリネーム情報を保存
            chrome.storage.sync.get(['renamedTabs'], (result) => {
                const renamedTabs = result.renamedTabs || {};
                renamedTabs[isRenamingTab] = renameValue;

                chrome.storage.sync.set({ renamedTabs }, () => {
                    // タブのタイトルを更新（UIのみ）
                    const updatedTabs = tabs.map(tab => {
                        if (tab.id === isRenamingTab) {
                            return { ...tab, title: renameValue };
                        }
                        return tab;
                    });

                    setTabs(updatedTabs);

                    // カテゴリのタブも更新
                    const updatedCategories = { ...categories };
                    Object.keys(updatedCategories).forEach((category) => {
                        const typedCategory = category as TabCategory;
                        updatedCategories[typedCategory] = updatedCategories[typedCategory].map(
                            (tab) => {
                                if (tab.id === isRenamingTab) {
                                    return { ...tab, title: renameValue };
                                }
                                return tab;
                            }
                        );
                    });

                    setCategories(updatedCategories);
                });
            });
        }

        setIsRenamingTab(null);
        setRenameValue('');
    };

    // カテゴリの選択変更
    const handleCategorySelect = (category: TabCategory) => {
        setSelectedCategory(category);
    };

    // 検索処理
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // 現在選択されているカテゴリのタブ（検索フィルター適用済み）
    const filteredTabs = categories[selectedCategory].filter((tab) =>
        tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // カテゴリごとのタブ数を計算
    const getCategoryCount = (category: TabCategory) => {
        return categories[category].length;
    };

    // 全タブ数を計算
    const getTotalTabCount = () => {
        return Object.values(categories).reduce(
            (total, tabs) => total + tabs.length,
            0
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-900 text-white">
            {/* ヘッダー */}
            <div className="flex justify-between items-center p-2 bg-gray-800">
                <h1 className="text-lg font-bold text-white">DevTabs</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="検索..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="px-3 py-1 bg-gray-700 rounded text-sm w-48"
                    />
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="flex flex-1 overflow-hidden">
                {/* 左側: カテゴリリスト */}
                <CategoryList
                    categories={Object.keys(categories) as TabCategory[]}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    getCategoryCount={getCategoryCount}
                />

                {/* 右側: タブリスト */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-2 bg-gray-800 border-b border-gray-700">
                        <h2 className="font-bold">
                            <span className={`text-${getCategoryColor(selectedCategory)}`}>
                                {getCategoryName(selectedCategory)}
                            </span>
                            <span className="text-gray-400 text-sm ml-2">
                                {getCategoryCount(selectedCategory)} タブ
                            </span>
                        </h2>
                    </div>

                    <TabList
                        tabs={filteredTabs}
                        onTabClick={navigateToTab}
                        onClose={closeTab}
                        onRename={startRenaming}
                        isRenamingTab={isRenamingTab}
                        renameValue={renameValue}
                        onRenameChange={setRenameValue}
                        onRenameComplete={finishRenaming}
                    />
                </div>
            </div>

            {/* フッター */}
            <div className="p-2 bg-gray-800 flex justify-between items-center">
                <div className="text-sm text-gray-400">合計: {getTotalTabCount()} タブ</div>
                <button className="px-4 py-1 bg-blue-500 text-gray-900 font-medium rounded text-sm">
                    タブを整理
                </button>
            </div>
        </div>
    );
};

// ユーティリティ関数
const getCategoryName = (category: TabCategory): string => {
    const names: Record<TabCategory, string> = {
        MODEL: 'Model',
        CONTROLLER: 'Controller',
        VIEW: 'View',
        CODE: 'Code',
        DOCUMENT: 'Docs',
        COMMUNICATION: 'Comm',
    };
    return names[category];
};

const getCategoryColor = (category: TabCategory): string => {
    const colors: Record<TabCategory, string> = {
        MODEL: 'red-400',
        CONTROLLER: 'blue-400',
        VIEW: 'green-400',
        CODE: 'purple-400',
        DOCUMENT: 'yellow-400',
        COMMUNICATION: 'indigo-400',
    };
    return colors[category];
};

export default Popup;