export interface User {
  id: string;
  google_id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  blocked: boolean;
  created_at: string;
}


export interface Inventory {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  is_public: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}


export interface InventoryField {
  id: string;
  inventory_id: string;
  title: string;
  kind: 'singleline' | 'multiline' | 'number' | 'doc' | 'bool';
  description: string | null;
  show_in_table: boolean;
  position: number;
  created_at: string;
}


export interface Item {
  id: string;
  inventory_id: string;
  creator_id: string | null;
  custom_id: string | null;
  
  values: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
}


export interface InventoryAccess {
  id: string;
  inventory_id: string;
  user_id: string;
  can_write: boolean;
  created_at: string;
  
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}


export interface CustomIdElement {
  id: string;
  inventory_id: string;
  position: number;
  element_type: 'fixed' | 'rand20' | 'rand32' | 'rand6' | 'rand9' | 'guid' | 'datetime' | 'sequence';
  params: Record<string, any> | null;
  created_at: string;
}


export interface DiscussionPost {
  id: string;
  inventory_id: string;
  author_id: string;
  body: string;
  created_at: string;
 
  author: Pick<User, 'id' | 'name' | 'email'>;
}


export interface Like {
  id: string;
  item_id: string;
  user_id: string;
  created_at: string;
}


export interface Tag {
  id: string;
  value: string;
}


export interface SearchResult {
  inventories: Inventory[];
  items: Item[];
}