// src/types/supabase.ts

export type Database = {
  public: {
    Tables: {
      news: {
        Row: {
          id: number;
          title: string | null;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          title?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
      };
      app_config: {
        Row: {
          key: string;
          value: string;
        };
        Insert: {
          key: string;
          value: string;
        };
        Update: {
          key?: string;
          value?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
