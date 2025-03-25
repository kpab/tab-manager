export type TabCategory =
  | "MODEL"
  | "CONTROLLER"
  | "VIEW"
  | "CODE"
  | "DOCUMENT"
  | "COMMUNICATION";

export interface Tab {
  id: string;
  title: string;
  url: string;
  favIconUrl?: string;
  category: TabCategory;
}
