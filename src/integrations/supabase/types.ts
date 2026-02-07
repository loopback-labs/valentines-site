export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      date_preferences: {
        Row: {
          activity_preference: string
          created_at: string
          food_preference: string
          id: string
          selected_date: string
          selected_time: string
          site_id: string
        }
        Insert: {
          activity_preference: string
          created_at?: string
          food_preference: string
          id?: string
          selected_date: string
          selected_time: string
          site_id: string
        }
        Update: {
          activity_preference?: string
          created_at?: string
          food_preference?: string
          id?: string
          selected_date?: string
          selected_time?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "date_preferences_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "valentine_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_preferences_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "valentine_sites_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_responses: {
        Row: {
          created_at: string
          id: string
          response_type: string
          site_id: string
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          response_type: string
          site_id: string
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          response_type?: string
          site_id?: string
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_responses_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "valentine_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_responses_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "valentine_sites_public"
            referencedColumns: ["id"]
          },
        ]
      }
      valentine_sites: {
        Row: {
          activity_options: string[] | null
          available_dates: string[] | null
          background_photos: string[] | null
          created_at: string
          enable_date_planning: boolean
          food_options: string[] | null
          headline: string
          id: string
          is_published: boolean
          no_button_text: string
          no_button_variants: string[] | null
          password_hash: string | null
          password_protected: boolean
          photo_display_mode: string | null
          slug: string
          subtext: string | null
          success_headline: string | null
          success_subtext: string | null
          template: string
          theme: Database["public"]["Enums"]["site_theme"]
          time_slots: string[] | null
          updated_at: string
          user_id: string
          view_count: number
          yes_button_text: string
          yes_count: number
        }
        Insert: {
          activity_options?: string[] | null
          available_dates?: string[] | null
          background_photos?: string[] | null
          created_at?: string
          enable_date_planning?: boolean
          food_options?: string[] | null
          headline?: string
          id?: string
          is_published?: boolean
          no_button_text?: string
          no_button_variants?: string[] | null
          password_hash?: string | null
          password_protected?: boolean
          photo_display_mode?: string | null
          slug: string
          subtext?: string | null
          success_headline?: string | null
          success_subtext?: string | null
          template?: string
          theme?: Database["public"]["Enums"]["site_theme"]
          time_slots?: string[] | null
          updated_at?: string
          user_id: string
          view_count?: number
          yes_button_text?: string
          yes_count?: number
        }
        Update: {
          activity_options?: string[] | null
          available_dates?: string[] | null
          background_photos?: string[] | null
          created_at?: string
          enable_date_planning?: boolean
          food_options?: string[] | null
          headline?: string
          id?: string
          is_published?: boolean
          no_button_text?: string
          no_button_variants?: string[] | null
          password_hash?: string | null
          password_protected?: boolean
          photo_display_mode?: string | null
          slug?: string
          subtext?: string | null
          success_headline?: string | null
          success_subtext?: string | null
          template?: string
          theme?: Database["public"]["Enums"]["site_theme"]
          time_slots?: string[] | null
          updated_at?: string
          user_id?: string
          view_count?: number
          yes_button_text?: string
          yes_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      valentine_sites_public: {
        Row: {
          activity_options: string[] | null
          available_dates: string[] | null
          background_photos: string[] | null
          created_at: string | null
          enable_date_planning: boolean | null
          food_options: string[] | null
          headline: string | null
          id: string | null
          is_published: boolean | null
          no_button_text: string | null
          no_button_variants: string[] | null
          password_protected: boolean | null
          photo_display_mode: string | null
          slug: string | null
          subtext: string | null
          success_headline: string | null
          success_subtext: string | null
          template: string | null
          theme: Database["public"]["Enums"]["site_theme"] | null
          time_slots: string[] | null
          updated_at: string | null
          view_count: number | null
          yes_button_text: string | null
          yes_count: number | null
        }
        Insert: {
          activity_options?: string[] | null
          available_dates?: string[] | null
          background_photos?: string[] | null
          created_at?: string | null
          enable_date_planning?: boolean | null
          food_options?: string[] | null
          headline?: string | null
          id?: string | null
          is_published?: boolean | null
          no_button_text?: string | null
          no_button_variants?: string[] | null
          password_protected?: boolean | null
          photo_display_mode?: string | null
          slug?: string | null
          subtext?: string | null
          success_headline?: string | null
          success_subtext?: string | null
          template?: string | null
          theme?: Database["public"]["Enums"]["site_theme"] | null
          time_slots?: string[] | null
          updated_at?: string | null
          view_count?: number | null
          yes_button_text?: string | null
          yes_count?: number | null
        }
        Update: {
          activity_options?: string[] | null
          available_dates?: string[] | null
          background_photos?: string[] | null
          created_at?: string | null
          enable_date_planning?: boolean | null
          food_options?: string[] | null
          headline?: string | null
          id?: string | null
          is_published?: boolean | null
          no_button_text?: string | null
          no_button_variants?: string[] | null
          password_protected?: boolean | null
          photo_display_mode?: string | null
          slug?: string | null
          subtext?: string | null
          success_headline?: string | null
          success_subtext?: string | null
          template?: string | null
          theme?: Database["public"]["Enums"]["site_theme"] | null
          time_slots?: string[] | null
          updated_at?: string | null
          view_count?: number | null
          yes_button_text?: string | null
          yes_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_view_count: { Args: { site_id: string }; Returns: undefined }
      increment_yes_count: { Args: { site_id: string }; Returns: undefined }
    }
    Enums: {
      site_theme: "cute" | "minimal" | "dark" | "pastel" | "chaotic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      site_theme: ["cute", "minimal", "dark", "pastel", "chaotic"],
    },
  },
} as const
