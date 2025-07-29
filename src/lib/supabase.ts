import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (we'll define these based on the legacy types)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          user_id: string;
          key: string;
          actors: string;
          awards: string;
          boxoffice: string;
          country: string;
          director: string;
          dvd: string;
          genre: string;
          imdbid: string;
          imdbrating: string;
          imdbvotes: string;
          language: string;
          metascore: string;
          plot: string;
          poster: string;
          production: string;
          rated: string;
          ratings: any;
          released: string;
          response: string;
          runtime: string;
          timestamp: number;
          website: string;
          writer: string;
          rating: number;
          tags: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          key: string;
          actors?: string;
          awards?: string;
          boxoffice?: string;
          country?: string;
          director?: string;
          dvd?: string;
          genre?: string;
          imdbid?: string;
          imdbrating?: string;
          imdbvotes?: string;
          language?: string;
          metascore?: string;
          plot?: string;
          poster?: string;
          production?: string;
          rated?: string;
          ratings?: any;
          released?: string;
          response?: string;
          runtime?: string;
          timestamp?: number;
          website?: string;
          writer?: string;
          rating?: number;
          tags?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          key?: string;
          actors?: string;
          awards?: string;
          boxoffice?: string;
          country?: string;
          director?: string;
          dvd?: string;
          genre?: string;
          imdbid?: string;
          imdbrating?: string;
          imdbvotes?: string;
          language?: string;
          metascore?: string;
          plot?: string;
          poster?: string;
          production?: string;
          rated?: string;
          ratings?: any;
          released?: string;
          response?: string;
          runtime?: string;
          timestamp?: number;
          website?: string;
          writer?: string;
          rating?: number;
          tags?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          value: string;
          label: string;
          assigned_to: any;
          timestamp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          value: string;
          label: string;
          assigned_to?: any;
          timestamp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          value?: string;
          label?: string;
          assigned_to?: any;
          timestamp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
