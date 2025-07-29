import { supabase } from "./supabase";
import type {
  ContentFull,
  ContentInsert,
  ContentTagInsert,
  NoteInsert,
  TagInsert,
} from "@/types/database";

// Content Service
export class ContentService {
  // Create content from OMDB data
  static async createFromOMDB(
    omdbData: any,
    userId: string,
    status: "to_watch" | "watched" = "to_watch",
  ) {
    // First check if content already exists for this user
    const { data: existingContent, error: checkError } = await supabase
      .from("content")
      .select()
      .eq("user_id", userId)
      .eq("imdb_id", omdbData.imdbID)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected for new content
      throw checkError;
    }

    if (existingContent) {
      // Content exists - update status if different
      if (existingContent.status !== status) {
        const { data: updatedData, error: updateError } = await supabase
          .from("content")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", existingContent.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedData;
      }
      // Same status, just return existing
      return existingContent;
    }

    // Content doesn't exist, create new
    const contentData: ContentInsert = {
      user_id: userId,
      imdb_id: omdbData.imdbID,
      title: omdbData.Title,
      type:
        omdbData.Type === "movie"
          ? "movie"
          : omdbData.Type === "series"
            ? "series"
            : "episode",
      year: parseInt(omdbData.Year) || null,
      rated: omdbData.Rated || null,
      released: omdbData.Released || null,
      runtime: omdbData.Runtime || null,
      genre: omdbData.Genre || null,
      director: omdbData.Director || null,
      writer: omdbData.Writer || null,
      actors: omdbData.Actors || null,
      plot: omdbData.Plot || null,
      poster: omdbData.Poster || null,
      ratings: omdbData.Ratings || null,
      metascore: omdbData.Metascore || null,
      imdb_rating: omdbData.imdbRating || null,
      imdb_votes: omdbData.imdbVotes || null,
      dvd: omdbData.DVD || null,
      box_office: omdbData.BoxOffice || null,
      production: omdbData.Production || null,
      website: omdbData.Website || null,
      status,
      user_rating: null,
    };

    const { data, error } = await supabase
      .from("content")
      .insert(contentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update content status (to_watch/watched)
  static async updateStatus(contentId: string, status: "to_watch" | "watched") {
    const { data, error } = await supabase
      .from("content")
      .update({ status })
      .eq("id", contentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update user rating
  static async updateRating(contentId: string, rating: number) {
    const { data, error } = await supabase
      .from("content")
      .update({ user_rating: rating })
      .eq("id", contentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get content with all relationships
  static async getContentFull(contentId: string) {
    const { data, error } = await supabase
      .from("content_full")
      .select("*")
      .eq("id", contentId)
      .single();

    if (error) throw error;
    return data as ContentFull;
  }

  // Get content by status
  static async getContentByStatus(
    userId: string,
    status: "to_watch" | "watched",
  ) {
    const { data, error } = await supabase
      .from("content_full")
      .select("*")
      .eq("user_id", userId)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ContentFull[];
  }

  // Search content by title
  static async searchContent(userId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from("content_full")
      .select("*")
      .eq("user_id", userId)
      .ilike("title", `%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ContentFull[];
  }

  // Delete content
  static async deleteContent(contentId: string) {
    const { error } = await supabase
      .from("content")
      .delete()
      .eq("id", contentId);

    if (error) throw error;
  }
}

// Tag Service
export class TagService {
  // Create tag
  static async createTag(tagData: TagInsert) {
    const { data, error } = await supabase
      .from("tags")
      .insert(tagData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's tags
  static async getUserTags(userId: string) {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Add tag to content
  static async addTagToContent(contentId: string, tagId: string) {
    const contentTagData: ContentTagInsert = {
      content_id: contentId,
      tag_id: tagId,
    };

    const { data, error } = await supabase
      .from("content_tags")
      .insert(contentTagData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove tag from content
  static async removeTagFromContent(contentId: string, tagId: string) {
    const { error } = await supabase
      .from("content_tags")
      .delete()
      .eq("content_id", contentId)
      .eq("tag_id", tagId);

    if (error) throw error;
  }

  // Get content tags
  static async getContentTags(contentId: string) {
    const { data, error } = await supabase
      .from("content_tags")
      .select(
        `
        *,
        tags (*)
      `,
      )
      .eq("content_id", contentId);

    if (error) throw error;
    return data;
  }

  static async deleteTag(tagId: string): Promise<void> {
    // Tag management would be implemented here
    // This is a placeholder for future implementation
  }
}

// Note Service
export class NoteService {
  // Create or update note (one-to-one relationship)
  static async upsertNote(contentId: string, noteContent: string) {
    // First check if note exists
    const { data: existingNote } = await supabase
      .from("notes")
      .select("*")
      .eq("content_id", contentId)
      .single();

    if (existingNote) {
      // Update existing note
      const { data, error } = await supabase
        .from("notes")
        .update({ content: noteContent })
        .eq("id", existingNote.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new note
      const noteData: NoteInsert = {
        content_id: contentId,
        content: noteContent,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(noteData)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get note for content
  static async getContentNote(contentId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("content_id", contentId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data;
  }

  // Delete note
  static async deleteNote(contentId: string) {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("content_id", contentId);

    if (error) throw error;
  }
}

// OMDB Service
export class OMDBService {
  // Search for content
  static async search(searchTerm: string) {
    const response = await fetch(
      `/api/omdb/search?q=${encodeURIComponent(searchTerm)}`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 500 && errorData.error?.includes("API key")) {
        throw new Error(
          "OMDB API key not configured. Please contact the administrator.",
        );
      }

      // Handle both 400 (OMDB API errors) and 500 (server errors)
      throw new Error(errorData.error || `Search failed (${response.status})`);
    }

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Search failed");
    }

    return data.Search as Array<{
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }>;
  }

  // Fetch detailed content by IMDB ID
  static async fetchByImdbId(imdbId: string) {
    const response = await fetch(
      `/api/omdb/fetch?id=${encodeURIComponent(imdbId)}`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 500 && errorData.error?.includes("API key")) {
        throw new Error(
          "OMDB API key not configured. Please contact the administrator.",
        );
      }

      // Handle both 400 (OMDB API errors) and 500 (server errors)
      throw new Error(errorData.error || `Fetch failed (${response.status})`);
    }

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Fetch failed");
    }

    return data;
  }
}

// Workflow Service - High-level operations
export class WorkflowService {
  // Complete workflow: Search OMDB → Create content → Set status
  static async addContentToWatchlist(
    searchTerm: string,
    userId: string,
    status: "to_watch" | "watched",
  ) {
    // 1. Search OMDB
    const searchResults = await OMDBService.search(searchTerm);
    if (searchResults.length === 0) {
      throw new Error("No content found");
    }

    // 2. Get first result (or could be enhanced to show selection UI)
    const firstResult = searchResults[0];

    // 3. Fetch detailed data
    const detailedData = await OMDBService.fetchByImdbId(firstResult.imdbID);

    // 4. Create content
    const content = await ContentService.createFromOMDB(
      detailedData,
      userId,
      status,
    );

    return content;
  }

  // Add content to watched list with rating
  static async markAsWatched(contentId: string, rating?: number) {
    // 1. Update status to watched
    const content = await ContentService.updateStatus(contentId, "watched");

    // 2. Update rating if provided
    if (rating !== undefined) {
      await ContentService.updateRating(contentId, rating);
    }

    return content;
  }

  // Add content to watchlist
  static async addToWatchlist(contentId: string) {
    return await ContentService.updateStatus(contentId, "to_watch");
  }

  // Complete content management with tags and notes
  static async manageContent(
    contentId: string,
    updates: {
      status?: "to_watch" | "watched";
      rating?: number;
      tags?: string[]; // Array of tag names to assign
      note?: string;
    },
  ) {
    const promises: Promise<any>[] = [];

    // Update status if provided
    if (updates.status) {
      promises.push(ContentService.updateStatus(contentId, updates.status));
    }

    // Update rating if provided
    if (updates.rating !== undefined) {
      promises.push(ContentService.updateRating(contentId, updates.rating));
    }

    // Update note if provided
    if (updates.note !== undefined) {
      promises.push(NoteService.upsertNote(contentId, updates.note));
    }

    // Handle tags (this would need more complex logic to handle existing tags)
    if (updates.tags) {
      // This is a simplified version - in practice you'd want to handle existing tags
    }

    await Promise.all(promises);

    // Return updated content
    return await ContentService.getContentFull(contentId);
  }
}
