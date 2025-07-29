import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type {
  Content,
  ContentFull,
  ContentInsert,
  ContentTag,
  ContentTagInsert,
  ContentUpdate,
  ContentWithNotes,
  ContentWithTags,
  Note,
  NoteInsert,
  NoteUpdate,
  Tag,
  TagInsert,
  TagUpdate,
} from "@/types/database";

// Content API hooks
export const useContent = (userId: string) => {
  return useQuery({
    queryKey: ["content", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Content[];
    },
    enabled: !!userId,
  });
};

export const useContentByStatus = (
  userId: string,
  status: "to_watch" | "watched",
) => {
  return useQuery({
    queryKey: ["content", userId, status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", userId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Content[];
    },
    enabled: !!userId,
  });
};

export const useContentWithTags = (userId: string) => {
  return useQuery({
    queryKey: ["content-with-tags", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_with_tags")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContentWithTags[];
    },
    enabled: !!userId,
  });
};

export const useContentWithNotes = (userId: string) => {
  return useQuery({
    queryKey: ["content-with-notes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_with_notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContentWithNotes[];
    },
    enabled: !!userId,
  });
};

export const useContentFull = (userId: string) => {
  return useQuery({
    queryKey: ["content-full", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_full")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContentFull[];
    },
    enabled: !!userId,
  });
};

export const useContentById = (contentId: string) => {
  return useQuery({
    queryKey: ["content", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_full")
        .select("*")
        .eq("id", contentId)
        .single();

      if (error) throw error;
      return data as ContentFull;
    },
    enabled: !!contentId,
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: ContentInsert) => {
      const { data, error } = await supabase
        .from("content")
        .insert(content)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["content", data.user_id] });
      queryClient.invalidateQueries({
        queryKey: ["content-with-tags", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-with-notes", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-full", data.user_id],
      });
    },
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ContentUpdate;
    }) => {
      const { data, error } = await supabase
        .from("content")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["content", data.user_id] });
      queryClient.invalidateQueries({
        queryKey: ["content-with-tags", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-with-notes", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-full", data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ["content", data.id] });
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", contentId);

      if (error) throw error;
      return contentId;
    },
    onSuccess: (contentId) => {
      // Invalidate all content queries since we don't know the user_id
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["content-with-tags"] });
      queryClient.invalidateQueries({ queryKey: ["content-with-notes"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
      queryClient.removeQueries({ queryKey: ["content", contentId] });
    },
  });
};

// Tags API hooks
export const useTags = (userId: string) => {
  return useQuery({
    queryKey: ["tags", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Tag[];
    },
    enabled: !!userId,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: TagInsert) => {
      const { data, error } = await supabase
        .from("tags")
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tags", data.user_id] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TagUpdate }) => {
      const { data, error } = await supabase
        .from("tags")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tags", data.user_id] });
      queryClient.invalidateQueries({
        queryKey: ["content-with-tags", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-full", data.user_id],
      });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase.from("tags").delete().eq("id", tagId);

      if (error) throw error;
      return tagId;
    },
    onSuccess: () => {
      // Invalidate all tag and content queries
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["content-with-tags"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

// Content-Tags relationship hooks
export const useContentTags = (contentId: string) => {
  return useQuery({
    queryKey: ["content-tags", contentId],
    queryFn: async () => {
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
      return data as (ContentTag & { tags: Tag })[];
    },
    enabled: !!contentId,
  });
};

export const useAddTagToContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentTag: ContentTagInsert) => {
      const { data, error } = await supabase
        .from("content_tags")
        .insert(contentTag)
        .select()
        .single();

      if (error) throw error;
      return data as ContentTag;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["content-tags", data.content_id],
      });
      queryClient.invalidateQueries({ queryKey: ["content-with-tags"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

export const useRemoveTagFromContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      tagId,
    }: {
      contentId: string;
      tagId: string;
    }) => {
      const { error } = await supabase
        .from("content_tags")
        .delete()
        .eq("content_id", contentId)
        .eq("tag_id", tagId);

      if (error) throw error;
      return { contentId, tagId };
    },
    onSuccess: ({ contentId }) => {
      queryClient.invalidateQueries({ queryKey: ["content-tags", contentId] });
      queryClient.invalidateQueries({ queryKey: ["content-with-tags"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

// Notes API hooks
export const useNote = (contentId: string) => {
  return useQuery({
    queryKey: ["note", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("content_id", contentId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
      return data as Note | null;
    },
    enabled: !!contentId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteInsert) => {
      const { data, error } = await supabase
        .from("notes")
        .insert(note)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["note", data.content_id] });
      queryClient.invalidateQueries({ queryKey: ["content-with-notes"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: NoteUpdate;
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["note", data.content_id] });
      queryClient.invalidateQueries({ queryKey: ["content-with-notes"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["note", data.content_id] });
      queryClient.invalidateQueries({ queryKey: ["content-with-notes"] });
      queryClient.invalidateQueries({ queryKey: ["content-full"] });
    },
  });
};

// OMDB API hook for searching content
export const useOMDBSearch = (searchTerm: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["omdb-search", searchTerm],
    queryFn: async () => {
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
        throw new Error(
          errorData.error || `Search failed (${response.status})`,
        );
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
    },
    enabled: enabled && !!searchTerm && searchTerm.length >= 3,
  });
};

export const useOMDBFetch = (imdbId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["omdb-fetch", imdbId],
    queryFn: async () => {
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
    },
    enabled: enabled && !!imdbId,
  });
};
