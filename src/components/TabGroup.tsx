// src/components/TabGroup.tsx
import React from "react";
import { GroupedTab } from "../utils/tabUtils";

interface TabGroupProps {
  title: string;
  tabs: GroupedTab[];
  icon: string;
  color: string;
}

const TabGroup: React.FC<TabGroupProps> = ({
  title,
  tabs,
  // type は削除
  icon,
  color,
}) => {
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
            className="flex items-center p-1 hover:bg-secondary rounded text-sm"
          >
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} alt="" className="w-4 h-4 mr-2" />
            )}
            <span className="truncate">{tab.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabGroup;
