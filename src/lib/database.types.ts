export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          state_id: string
          password: string
          type: 'internal' | 'external'
          role: 'admin' | 'user'
          first_login: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          state_id: string
          password: string
          type: 'internal' | 'external'
          role: 'admin' | 'user'
          first_login?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          state_id?: string
          password?: string
          type?: 'internal' | 'external'
          role?: 'admin' | 'user'
          first_login?: boolean
          created_at?: string
        }
      }
      drugs: {
        Row: {
          id: string
          name: string
          description: string
          value: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          value: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          value?: number
          image_url?: string | null
          created_at?: string
        }
      }
      queue: {
        Row: {
          id: string
          drug_id: string
          quantity: number
          user_id: string
          status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          queue_type: 'internal' | 'external'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          drug_id: string
          quantity: number
          user_id: string
          status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          queue_type: 'internal' | 'external'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          drug_id?: string
          quantity?: number
          user_id?: string
          status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          queue_type?: 'internal' | 'external'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          drug_id: string
          quantity: number
          value: number
          user_id: string
          queue_type: 'internal' | 'external'
          created_at: string
          confirmed_at: string
        }
        Insert: {
          id?: string
          drug_id: string
          quantity: number
          value: number
          user_id: string
          queue_type: 'internal' | 'external'
          created_at?: string
          confirmed_at: string
        }
        Update: {
          id?: string
          drug_id?: string
          quantity?: number
          value?: number
          user_id?: string
          queue_type?: 'internal' | 'external'
          created_at?: string
          confirmed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}