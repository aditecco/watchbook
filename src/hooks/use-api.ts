import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ContentItem, Note, TagType } from "@/store";
import { useAppStore } from "@/store";

// Content hooks
export const useContent = (userId: string) => {
  return useQuery({
    queryKey: ["content", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      // Transform data to match legacy format
      const contentMap: Record<string, ContentItem> = {};
      data?.forEach((item) => {
        contentMap[item.key] = {
          key: item.key,
          actors: item.actors || "",
          awards: item.awards || "",
          boxoffice: item.boxoffice || "",
          country: item.country || "",
          director: item.director || "",
          dvd: item.dvd || "",
          genre: item.genre || "",
          id: item.id,
          imdbid: item.imdbid || "",
          imdbrating: item.imdbrating || "",
          imdbvotes: item.imdbvotes || "",
          language: item.language || "",
          metascore: item.metascore || "",
          plot: item.plot || "",
          poster: item.poster || "",
          production: item.production || "",
          rated: item.rated || "",
          ratings: item.ratings || [],
          released: item.released || "",
          response: item.response || "",
          runtime: item.runtime || "",
          timestamp: item.timestamp || Date.now(),
          website: item.website || "",
          writer: item.writer || "",
          rating: item.rating || 0,
          tags: item.tags || {},
        };
      });

      return contentMap;
    },
    enabled: !!userId,
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      content,
    }: {
      userId: string;
      content: Omit<ContentItem, "id">;
    }) => {
      const { data, error } = await supabase
        .from("content")
        .insert({
          user_id: userId,
          key: content.key,
          actors: content.actors,
          awards: content.awards,
          boxoffice: content.boxoffice,
          country: content.country,
          director: content.director,
          dvd: content.dvd,
          genre: content.genre,
          imdbid: content.imdbid,
          imdbrating: content.imdbrating,
          imdbvotes: content.imdbvotes,
          language: content.language,
          metascore: content.metascore,
          plot: content.plot,
          poster: content.poster,
          production: content.production,
          rated: content.rated,
          ratings: content.ratings,
          released: content.released,
          response: content.response,
          runtime: content.runtime,
          timestamp: content.timestamp,
          website: content.website,
          writer: content.writer,
          rating: content.rating,
          tags: content.tags,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["content", userId] });
      showNotification("Content created successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to create content", "error");
      console.error("Create content error:", error);
    },
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      key,
      updates,
    }: {
      userId: string;
      key: string;
      updates: Partial<ContentItem>;
    }) => {
      const { data, error } = await supabase
        .from("content")
        .update(updates)
        .eq("user_id", userId)
        .eq("key", key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["content", userId] });
      showNotification("Content updated successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to update content", "error");
      console.error("Update content error:", error);
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({ userId, key }: { userId: string; key: string }) => {
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("user_id", userId)
        .eq("key", key);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["content", userId] });
      showNotification("Content deleted successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to delete content", "error");
      console.error("Delete content error:", error);
    },
  });
};

// Tags hooks
export const useTags = (userId: string) => {
  return useQuery({
    queryKey: ["tags", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      // Transform data to match legacy format
      const tagsMap: Record<string, TagType> = {};
      data?.forEach((item) => {
        tagsMap[item.id] = {
          id: item.id,
          timestamp: item.timestamp,
          value: item.value,
          label: item.label,
          assignedTo: item.assigned_to || {},
        };
      });

      return tagsMap;
    },
    enabled: !!userId,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      tag,
    }: {
      userId: string;
      tag: Omit<TagType, "id">;
    }) => {
      const { data, error } = await supabase
        .from("tags")
        .insert({
          user_id: userId,
          value: tag.value,
          label: tag.label,
          assigned_to: tag.assignedTo,
          timestamp: tag.timestamp,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["tags", userId] });
      showNotification("Tag created successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to create tag", "error");
      console.error("Create tag error:", error);
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      id,
      updates,
    }: {
      userId: string;
      id: string;
      updates: Partial<TagType>;
    }) => {
      const { data, error } = await supabase
        .from("tags")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["tags", userId] });
      showNotification("Tag updated successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to update tag", "error");
      console.error("Update tag error:", error);
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({ userId, id }: { userId: string; id: string }) => {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("user_id", userId)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["tags", userId] });
      showNotification("Tag deleted successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to delete tag", "error");
      console.error("Delete tag error:", error);
    },
  });
};

// Notes hooks
export const useNotes = (userId: string) => {
  return useQuery({
    queryKey: ["notes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      // Transform data to match legacy format
      const notesMap: Record<string, Note> = {};
      data?.forEach((item) => {
        notesMap[item.id] = {
          id: item.id,
          contentId: item.content_id,
          content: item.content,
          timestamp: new Date(item.created_at).getTime(),
        };
      });

      return notesMap;
    },
    enabled: !!userId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      note,
    }: {
      userId: string;
      note: Omit<Note, "id" | "timestamp">;
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          content_id: note.contentId,
          content: note.content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      showNotification("Note created successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to create note", "error");
      console.error("Create note error:", error);
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({
      userId,
      id,
      updates,
    }: {
      userId: string;
      id: string;
      updates: Partial<Note>;
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      showNotification("Note updated successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to update note", "error");
      console.error("Update note error:", error);
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useAppStore();

  return useMutation({
    mutationFn: async ({ userId, id }: { userId: string; id: string }) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("user_id", userId)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      showNotification("Note deleted successfully", "success");
    },
    onError: (error) => {
      showNotification("Failed to delete note", "error");
      console.error("Delete note error:", error);
    },
  });
};
