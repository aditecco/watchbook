export interface Database {
  public: {
    Tables: {
      content: {
        Row: {
          id: string
          user_id: string
          imdb_id: string
          title: string
          type: 'movie' | 'series' | 'episode'
          year: number | null
          rated: string | null
          released: string | null
          runtime: string | null
          genre: string | null
          director: string | null
          writer: string | null
          actors: string | null
          plot: string | null
          poster: string | null
          ratings: any[] | null // JSONB array of rating objects
          metascore: string | null
          imdb_rating: string | null
          imdb_votes: string | null
          dvd: string | null
          box_office: string | null
          production: string | null
          website: string | null
          status: 'to_watch' | 'watched'
          user_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          imdb_id: string
          title: string
          type: 'movie' | 'series' | 'episode'
          year?: number | null
          rated?: string | null
          released?: string | null
          runtime?: string | null
          genre?: string | null
          director?: string | null
          writer?: string | null
          actors?: string | null
          plot?: string | null
          poster?: string | null
          ratings?: any[] | null
          metascore?: string | null
          imdb_rating?: string | null
          imdb_votes?: string | null
          dvd?: string | null
          box_office?: string | null
          production?: string | null
          website?: string | null
          status?: 'to_watch' | 'watched'
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          imdb_id?: string
          title?: string
          type?: 'movie' | 'series' | 'episode'
          year?: number | null
          rated?: string | null
          released?: string | null
          runtime?: string | null
          genre?: string | null
          director?: string | null
          writer?: string | null
          actors?: string | null
          plot?: string | null
          poster?: string | null
          ratings?: any[] | null
          metascore?: string | null
          imdb_rating?: string | null
          imdb_votes?: string | null
          dvd?: string | null
          box_office?: string | null
          production?: string | null
          website?: string | null
          status?: 'to_watch' | 'watched'
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      content_tags: {
        Row: {
          id: string
          content_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          content_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      content_with_tags: {
        Row: {
          id: string
          user_id: string
          imdb_id: string
          title: string
          type: 'movie' | 'series' | 'episode'
          year: number | null
          rated: string | null
          released: string | null
          runtime: string | null
          genre: string | null
          director: string | null
          writer: string | null
          actors: string | null
          plot: string | null
          poster: string | null
          ratings: any[] | null
          metascore: string | null
          imdb_rating: string | null
          imdb_votes: string | null
          dvd: string | null
          box_office: string | null
          production: string | null
          website: string | null
          status: 'to_watch' | 'watched'
          user_rating: number | null
          created_at: string
          updated_at: string
          tags: Array<{
            id: string
            name: string
            color: string
          }>
        }
      }
      content_with_notes: {
        Row: {
          id: string
          user_id: string
          imdb_id: string
          title: string
          type: 'movie' | 'series' | 'episode'
          year: number | null
          rated: string | null
          released: string | null
          runtime: string | null
          genre: string | null
          director: string | null
          writer: string | null
          actors: string | null
          plot: string | null
          poster: string | null
          ratings: any[] | null
          metascore: string | null
          imdb_rating: string | null
          imdb_votes: string | null
          dvd: string | null
          box_office: string | null
          production: string | null
          website: string | null
          status: 'to_watch' | 'watched'
          user_rating: number | null
          created_at: string
          updated_at: string
          note_content: string | null
          note_created_at: string | null
          note_updated_at: string | null
        }
      }
      content_full: {
        Row: {
          id: string
          user_id: string
          imdb_id: string
          title: string
          type: 'movie' | 'series' | 'episode'
          year: number | null
          rated: string | null
          released: string | null
          runtime: string | null
          genre: string | null
          director: string | null
          writer: string | null
          actors: string | null
          plot: string | null
          poster: string | null
          ratings: any[] | null
          metascore: string | null
          imdb_rating: string | null
          imdb_votes: string | null
          dvd: string | null
          box_office: string | null
          production: string | null
          website: string | null
          status: 'to_watch' | 'watched'
          user_rating: number | null
          created_at: string
          updated_at: string
          tags: Array<{
            id: string
            name: string
            color: string
          }>
          note_content: string | null
          note_created_at: string | null
          note_updated_at: string | null
        }
      }
    }
  }
}

// Helper types for easier usage
export type Content = Database['public']['Tables']['content']['Row']
export type ContentInsert = Database['public']['Tables']['content']['Insert']
export type ContentUpdate = Database['public']['Tables']['content']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type ContentTag = Database['public']['Tables']['content_tags']['Row']
export type ContentTagInsert = Database['public']['Tables']['content_tags']['Insert']

export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

export type ContentWithTags = Database['public']['Views']['content_with_tags']['Row']
export type ContentWithNotes = Database['public']['Views']['content_with_notes']['Row']
export type ContentFull = Database['public']['Views']['content_full']['Row'] 