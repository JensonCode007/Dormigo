export interface Item {
  id: number;
  title: string;
  condition: string;
  price: number;
  image: string;
  category: string;
  campus?: string;
}

export interface BrowseItemsProps {
  initialItems?: Item[];
}