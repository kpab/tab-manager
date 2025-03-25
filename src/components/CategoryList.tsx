// src/components/CategoryList.tsx
import React from 'react';
import { TabCategory } from '../types';

interface CategoryListProps {
    categories: TabCategory[];
    selectedCategory: TabCategory;
    onCategorySelect: (category: TabCategory) => void;
    getCategoryCount: (category: TabCategory) => number;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategory,
    onCategorySelect,
    getCategoryCount,
}) => {
    // カテゴリの表示名マッピング
    const categoryNames: Record<TabCategory, string> = {
        MODEL: 'Model',
        CONTROLLER: 'Controller',
        VIEW: 'View',
        CODE: 'Code',
        DOCUMENT: 'Docs',
        COMMUNICATION: 'Comm',
    };

    // カテゴリの色マッピング
    const categoryColors: Record<TabCategory, string> = {
        MODEL: '#f07178',
        CONTROLLER: '#82aaff',
        VIEW: '#c3e88d',
        CODE: '#c792ea',
        DOCUMENT: '#ffcb6b',
        COMMUNICATION: '#7e57c2',
    };

    // カテゴリの色をTailwindのクラス名に変換
    const getCategoryColorClass = (category: TabCategory): string => {
        const colorMap: Record<TabCategory, string> = {
            MODEL: 'border-red-400',
            CONTROLLER: 'border-blue-400',
            VIEW: 'border-green-400',
            CODE: 'border-purple-400',
            DOCUMENT: 'border-yellow-400',
            COMMUNICATION: 'border-indigo-400',
        };
        return colorMap[category];
    };

    // 選択中のカテゴリのスタイル
    const getSelectedStyle = (category: TabCategory) => {
        if (category === selectedCategory) {
            return {
                backgroundColor: categoryColors[category],
                color: '#292d3e',
                fontWeight: 'bold' as const,
            };
        }
        return {};
    };

    return (
        <div className="w-28 bg-gray-800 overflow-y-auto">
            {categories.map((category) => (
                <div
                    key={category}
                    className={`
            m-1 p-2 rounded cursor-pointer flex items-center justify-between
            ${category === selectedCategory
                            ? ''
                            : `bg-gray-700 border-l-4 ${getCategoryColorClass(category)}`
                        }
          `}
                    style={getSelectedStyle(category)}
                    onClick={() => onCategorySelect(category)}
                >
                    <div className="flex items-center">
                        <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{
                                backgroundColor: category === selectedCategory
                                    ? '#292d3e'
                                    : categoryColors[category]
                            }}
                        />
                        <span>{categoryNames[category]}</span>
                    </div>
                    <span>{getCategoryCount(category)}</span>
                </div>
            ))}
        </div>
    );
};

export default CategoryList;