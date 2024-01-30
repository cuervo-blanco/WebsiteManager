export type Behavior = 'fixed' | 'additive';
export type ComponentType = 'ImageSlot'; // Add more types like '| "AnotherComponentType"';
export type SetStateFunction<T> = (value: T) => void;

export interface BasicContent {
  connection_id: string;
  src: string | undefined;
  alt: string | undefined ;
  link: string;
}

export interface Content extends BasicContent {
  title?: string | "" | undefined ;
  body?: string |  ""  | undefined;
  published_date?: Date | undefined;
  subtitle?: string;
section_id: 'illustrations' | 'p&s: illustrations' | 'p&s: posters' | 'p&s: 2d animation & motion graphics' | 'p&s: character design' | 'clients' | 'press' | '';
  description?: string;
  action?: 'delete' | 'new';
}

export interface WindowProps {
  children: React.ReactNode;
  title: string; // Changed Title to title for consistency
  rows: number;
  behavior: Behavior;
}

export interface ImageSlotProps extends BasicContent {
  setSelectedId: SetStateFunction<string>; // Using a more specific function type
}

export interface LinkEditorProps {
  connection_id: string | undefined;
  items: Content[];
  onItemsUpdate: SetStateFunction<Content[]>; // Using a more specific function type
}

export interface MediaViewer {
  sendSelect: SetStateFunction<[string, string]> | null; // Assuming sendSelect updates a state of type [string, string]
  modalWindow: boolean;
  setImageSlot: Function; // Consider defining a more specific type for setImageSlot
}

export type Item = Pick<BasicContent, 'connection_id' | 'link'>;




