/**
 * Supabase Database Types
 * 
 * Run `npx supabase gen types typescript` after setting up your database
 * to generate accurate types from your schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string | null;
          partner: string | null;
          persona_id: string;
          persona_name: string | null;
          replica_id: string;
          replica_name: string | null;
          custom_greeting: string | null;
          conversational_context: string | null;
          branding: Json | null;
          welcome_title: string | null;
          welcome_message: string | null;
          instructions: string | null;
          brand_logo_url: string | null;
          brand_name: string | null;
          brand_primary_color: string;
          brand_background_color: string;
          cta_text: string | null;
          cta_url: string | null;
          custom_fields: Json;
          session_duration_hours: number;
          show_narrator_branding: boolean;
          status: 'draft' | 'active' | 'archived';
          demo_count: number;
          last_demo_at: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string | null;
          partner?: string | null;
          persona_id: string;
          persona_name?: string | null;
          replica_id: string;
          replica_name?: string | null;
          custom_greeting?: string | null;
          conversational_context?: string | null;
          branding?: Json | null;
          welcome_title?: string | null;
          welcome_message?: string | null;
          instructions?: string | null;
          brand_logo_url?: string | null;
          brand_name?: string | null;
          brand_primary_color?: string;
          brand_background_color?: string;
          cta_text?: string | null;
          cta_url?: string | null;
          custom_fields?: Json;
          session_duration_hours?: number;
          show_narrator_branding?: boolean;
          status?: 'draft' | 'active' | 'archived';
          demo_count?: number;
          last_demo_at?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string | null;
          partner?: string | null;
          persona_id?: string;
          persona_name?: string | null;
          replica_id?: string;
          replica_name?: string | null;
          custom_greeting?: string | null;
          conversational_context?: string | null;
          branding?: Json | null;
          welcome_title?: string | null;
          welcome_message?: string | null;
          instructions?: string | null;
          brand_logo_url?: string | null;
          brand_name?: string | null;
          brand_primary_color?: string;
          brand_background_color?: string;
          cta_text?: string | null;
          cta_url?: string | null;
          custom_fields?: Json;
          session_duration_hours?: number;
          show_narrator_branding?: boolean;
          status?: 'draft' | 'active' | 'archived';
          demo_count?: number;
          last_demo_at?: string | null;
          user_id?: string;
        };
      };
      demo_sessions: {
        Row: {
          id: string;
          created_at: string;
          project_id: string;
          conversation_id: string | null;
          conversation_url: string | null;
          status: 'pending' | 'active' | 'completed' | 'expired';
          expires_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          prospect_name: string | null;
          prospect_email: string | null;
          prospect_company: string | null;
          referrer: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          project_id: string;
          conversation_id?: string | null;
          conversation_url?: string | null;
          status?: 'pending' | 'active' | 'completed' | 'expired';
          expires_at: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          prospect_name?: string | null;
          prospect_email?: string | null;
          prospect_company?: string | null;
          referrer?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          project_id?: string;
          conversation_id?: string | null;
          conversation_url?: string | null;
          status?: 'pending' | 'active' | 'completed' | 'expired';
          expires_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          prospect_name?: string | null;
          prospect_email?: string | null;
          prospect_company?: string | null;
          referrer?: string | null;
          metadata?: Json;
        };
      };
      team_members: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          email: string;
          role: 'admin' | 'member';
          name: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          email: string;
          role?: 'admin' | 'member';
          name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          email?: string;
          role?: 'admin' | 'member';
          name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: 'draft' | 'active' | 'archived';
      session_status: 'pending' | 'active' | 'completed' | 'expired';
      team_role: 'admin' | 'member';
    };
  };
}

// Helper types for easier usage
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type DemoSession = Database['public']['Tables']['demo_sessions']['Row'];
export type DemoSessionInsert = Database['public']['Tables']['demo_sessions']['Insert'];
export type DemoSessionUpdate = Database['public']['Tables']['demo_sessions']['Update'];

export type TeamMember = Database['public']['Tables']['team_members']['Row'];







