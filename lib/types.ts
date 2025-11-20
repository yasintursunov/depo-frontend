// lib/types.ts
export type UUID = string;

export type User = {
  id: UUID;
  google_id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: 'user' | 'admin' | string;
  blocked?: boolean;
  created_at?: string;
  updated_at?: string;
  access_token?: string | null;
  refresh_token?: string | null;
};

export type Inventory = {
  id: UUID;
  owner_id?: UUID;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  is_public?: boolean;
  version?: number;
  created_at?: string;
  updated_at?: string;
};

export type Field = {
  id: UUID;
  inventory_id: UUID;
  title: string;
  kind: 'singleline' | 'multiline' | 'number' | 'doc' | 'bool' | string;
  description?: string | null;
  show_in_table?: boolean;
  position?: number;
  created_at?: string;
};

export type Item = {
  id: UUID;
  inventory_id: UUID;
  creator_id?: UUID | null;
  custom_id?: string | null;
  values?: Record<string, unknown>;
  version?: number;
  created_at?: string;
  updated_at?: string;
};

export type ApiErrorBody = {
  error?: string;
  details?: string | Record<string, unknown> | null;
};

export type ApiError = Error & { status?: number; body?: ApiErrorBody | null };
