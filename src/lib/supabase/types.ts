export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      availability_slots: {
        Row: {
          id: string;
          date: string;
          morning_available: boolean;
          afternoon_available: boolean;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          morning_available?: boolean;
          afternoon_available?: boolean;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          morning_available?: boolean;
          afternoon_available?: boolean;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointment_requests: {
        Row: {
          id: string;
          first_name: string;
          last_name: string | null;
          phone: string;
          design_status: string;
          comment: string | null;
          selected_slots: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name?: string | null;
          phone: string;
          design_status: string;
          comment?: string | null;
          selected_slots: Json;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string | null;
          phone?: string;
          design_status?: string;
          comment?: string | null;
          selected_slots?: Json;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
