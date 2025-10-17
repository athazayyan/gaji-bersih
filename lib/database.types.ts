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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      documents: {
        Row: {
          chat_id: string | null
          created_at: string
          doc_type: Database["public"]["Enums"]["doc_type"]
          expires_at: string | null
          file_id: string | null
          file_name: string
          file_size: number
          id: string
          mime_type: string
          storage_path: string
          user_id: string
          vector_store: Database["public"]["Enums"]["vector_store_type"] | null
          vs_file_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          doc_type?: Database["public"]["Enums"]["doc_type"]
          expires_at?: string | null
          file_id?: string | null
          file_name: string
          file_size: number
          id?: string
          mime_type: string
          storage_path: string
          user_id: string
          vector_store?: Database["public"]["Enums"]["vector_store_type"] | null
          vs_file_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          doc_type?: Database["public"]["Enums"]["doc_type"]
          expires_at?: string | null
          file_id?: string | null
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path?: string
          user_id?: string
          vector_store?: Database["public"]["Enums"]["vector_store_type"] | null
          vs_file_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      gc_logs: {
        Row: {
          created_at: string
          deleted_documents: number
          deleted_sessions: number
          error: string | null
          execution_time_ms: number | null
          id: string
        }
        Insert: {
          created_at?: string
          deleted_documents?: number
          deleted_sessions?: number
          error?: string | null
          execution_time_ms?: number | null
          id?: string
        }
        Update: {
          created_at?: string
          deleted_documents?: number
          deleted_sessions?: number
          error?: string | null
          execution_time_ms?: number | null
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      regulations: {
        Row: {
          created_at: string
          description: string | null
          effective_date: string | null
          file_id: string | null
          file_name: string
          file_size: number
          id: string
          issued_date: string | null
          mime_type: string
          regulation_number: string
          regulation_type: string
          regulation_year: number
          storage_path: string
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string
          vector_store: string | null
          vs_file_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          effective_date?: string | null
          file_id?: string | null
          file_name: string
          file_size: number
          id?: string
          issued_date?: string | null
          mime_type: string
          regulation_number: string
          regulation_type: string
          regulation_year: number
          storage_path: string
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by: string
          vector_store?: string | null
          vs_file_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          effective_date?: string | null
          file_id?: string | null
          file_name?: string
          file_size?: number
          id?: string
          issued_date?: string | null
          mime_type?: string
          regulation_number?: string
          regulation_type?: string
          regulation_year?: number
          storage_path?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string
          vector_store?: string | null
          vs_file_id?: string | null
        }
        Relationships: []
      }
      runs: {
        Row: {
          answer: string | null
          chat_id: string
          citations_json: Json | null
          completion_tokens: number | null
          created_at: string
          error: string | null
          id: string
          latency_ms: number | null
          prompt_tokens: number | null
          question: string
          request_id: string | null
          token_usage: number | null
          tool_calls: Json | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          chat_id: string
          citations_json?: Json | null
          completion_tokens?: number | null
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          prompt_tokens?: number | null
          question: string
          request_id?: string | null
          token_usage?: number | null
          tool_calls?: Json | null
          user_id: string
        }
        Update: {
          answer?: string | null
          chat_id?: string
          citations_json?: Json | null
          completion_tokens?: number | null
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          prompt_tokens?: number | null
          question?: string
          request_id?: string | null
          token_usage?: number | null
          tool_calls?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "runs_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      sessions: {
        Row: {
          chat_id: string
          created_at: string
          expires_at: string
          session_vs_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_id?: string
          created_at?: string
          expires_at: string
          session_vs_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          expires_at?: string
          session_vs_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_usage_stats: {
        Row: {
          avg_latency_ms: number | null
          error_count: number | null
          query_date: string | null
          total_queries: number | null
          total_tokens: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_documents_with_logging: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_gc_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_storage_path: {
        Args: { bucket_name?: string; file_name: string; user_uuid: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      doc_type:
        | "contract"
        | "policy"
        | "nda"
        | "regulation"
        | "payslip"
        | "other"
      user_role: "user" | "admin"
      vector_store_type: "global" | "big" | "session"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      doc_type: ["contract", "policy", "nda", "regulation", "payslip", "other"],
      user_role: ["user", "admin"],
      vector_store_type: ["global", "big", "session"],
    },
  },
} as const
