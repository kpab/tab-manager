// src/components/CategoryList.tsx
import React from 'react';

type DevTabCategory = 'MODEL' | 'CONTROLLER' | 'VIEW' | 'CODE' | 'DOCUMENT' | 'COMMUNICATION';

interface CategoryListProps {
    categories: DevTabCategory[];
    selectedCategory: DevTabCategory;
    onCategorySelect: (category: DevTabCategory) => void;
    getCategoryCount: (category: DevTabCategory) => number;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategory,
    onCategorySelect,
    getCategoryCount,
}) => {
    // カテゴリの表示名マッピング
    const categoryNames: Record<DevTabCategory, string> = {
        MODEL: 'Model',
        CONTROLLER: 'Controller',
        VIEW: 'View',
        CODE: 'Code',
        DOCUMENT: 'Docs',
        COMMUNICATION: 'Comm',
    };

    // カテゴリの色マッピング
    const categoryColors: Record<DevTabCategory, { bg: string, border: string }> = {
        MODEL: { bg: '#f07178', border: '#f07178' },
        CONTROLLER: { bg: '#82aaff', border: '#82aaff' },
        VIEW: { bg: '#c3e88d', border: '#c3e88d' },
        CODE: { bg: '#c792ea', border: '#c792ea' },
        DOCUMENT: { bg: '#ffcb6b', border: '#ffcb6b' },
        COMMUNICATION: { bg: '#7e57c2', border: '#7e57c2' },
    };

    return (
        <div className="w-52 bg-[#1f2430] py-2 overflow-y-auto">
            {categories.map((category) => (
                <div
                    key={category}
                    className={`
            mx-3 my-2 px-4 py-3 rounded-lg cursor-pointer
            transition-colors duration-150 ease-in-out
            flex items-center justify-between
            ${category === selectedCategory
                            ? ''
                            : 'border border-opacity-50 hover:bg-opacity-10 hover:bg-white'}
          `}
                    style={{
                        backgroundColor: category === selectedCategory ? categoryColors[category].bg : 'transparent',
                        borderColor: category !== selectedCategory ? categoryColors[category].border : 'transparent',
                    }}
                    onClick={() => onCategorySelect(category)}
                >
                    <div className="flex items-center">
                        <div
                            className="w-5 h-5 rounded-full mr-3 flex items-center justify-center"
                            style={{
                                backgroundColor: category === selectedCategory
                                    ? '#1f2430'
                                    : categoryColors[category].bg
                            }}
                        >
                            {category === selectedCategory && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </div>
                        <span
                            className={`text-base ${category === selectedCategory ? 'text-[#1f2430] font-bold' : 'text-white'
                                }`}
                        >
                            {categoryNames[category]}
                        </span>
                    </div>
                    <span
                        className={`ml-2 text-base ${category === selectedCategory ? 'text-[#1f2430] font-bold' : 'text-white opacity-70'
                            }`}
                    >
                        {getCategoryCount(category)}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CategoryList;