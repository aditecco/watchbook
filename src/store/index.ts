import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Content, Note, Tag } from "@/types/database"; // Types from new schema

// Types from new schema
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Re-export types from database for consistency
export type ContentItem = Content;
export type TagType = Tag;

export interface NotificationMessage {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

export interface ModalState {
  visible: boolean;
  content: React.ReactNode | null;
}

export interface ContentDetailsModalState {
  visible: boolean;
  imdbId: string | null;
  searchItem: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  } | null;
}

export interface ApiDataState {
  fetching: boolean;
  query: string;
  data: any;
  error: string | null;
  resetSignal: boolean;
}

// Store state interface
interface AppState {
  // Authentication
  auth: {
    authenticated: boolean;
    user: User | null;
    loading: boolean;
  };

  // User data
  userData: {
    content: Record<string, Content>;
    tags: Record<string, Tag>;
    notes: Record<string, Note>;
    loading: boolean;
  };

  // API data for OMDB search
  apiData: ApiDataState;

  // UI state
  notification: NotificationMessage;
  modal: ModalState;
  contentDetailsModal: ContentDetailsModalState;

  // Actions
  setAuthState: (auth: { authenticated: boolean; user: User | null }) => void;
  setAuthLoading: (loading: boolean) => void;
  setContent: (content: Record<string, Content>) => void;
  addContent: (content: Content) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  removeContent: (id: string) => void;
  setTags: (tags: Record<string, Tag>) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  setNotes: (notes: Record<string, Note>) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;

  setUserDataLoading: (loading: boolean) => void;
  // API data actions
  setApiData: (apiData: Partial<ApiDataState>) => void;
  resetApiData: () => void;
  // Content details modal actions
  showContentDetailsModal: (
    imdbId: string,
    searchItem: ContentDetailsModalState["searchItem"],
  ) => void;
  hideContentDetailsModal: () => void;
  showNotification: (
    message: string,
    type: "success" | "error" | "info",
  ) => void;
  hideNotification: () => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
}

// Create store with devtools and immer
export const useAppStore = create<AppState>()(
  devtools(
    immer((set) => ({
      // Initial state
      auth: {
        authenticated: false,
        user: null,
        loading: true,
      },

      userData: {
        content: {},
        tags: {},
        notes: {},
        loading: false,
      },

      apiData: {
        fetching: false,
        query: "",
        data: null,
        error: null,
        resetSignal: false,
      },

      notification: {
        message: "",
        type: "info",
        visible: false,
      },

      modal: {
        visible: false,
        content: null,
      },

      contentDetailsModal: {
        visible: false,
        imdbId: null,
        searchItem: null,
      },

      // Actions
      setAuthState: (auth) =>
        set((state) => {
          state.auth.authenticated = auth.authenticated;
          state.auth.user = auth.user;
        }),

      setAuthLoading: (loading) =>
        set((state) => {
          state.auth.loading = loading;
        }),

      setContent: (content) =>
        set((state) => {
          state.userData.content = content;
        }),

      addContent: (content) =>
        set((state) => {
          state.userData.content[content.id] = content;
        }),

      updateContent: (id, updates) =>
        set((state) => {
          if (state.userData.content[id]) {
            Object.assign(state.userData.content[id], updates);
          }
        }),

      removeContent: (id) =>
        set((state) => {
          delete state.userData.content[id];
        }),

      setTags: (tags) =>
        set((state) => {
          state.userData.tags = tags;
        }),

      addTag: (tag) =>
        set((state) => {
          state.userData.tags[tag.id] = tag;
        }),

      updateTag: (id, updates) =>
        set((state) => {
          if (state.userData.tags[id]) {
            Object.assign(state.userData.tags[id], updates);
          }
        }),

      removeTag: (id) =>
        set((state) => {
          delete state.userData.tags[id];
        }),

      setNotes: (notes) =>
        set((state) => {
          state.userData.notes = notes;
        }),

      addNote: (note) =>
        set((state) => {
          state.userData.notes[note.id] = note;
        }),

      updateNote: (id, updates) =>
        set((state) => {
          if (state.userData.notes[id]) {
            Object.assign(state.userData.notes[id], updates);
          }
        }),

      removeNote: (id) =>
        set((state) => {
          delete state.userData.notes[id];
        }),

      setUserDataLoading: (loading) =>
        set((state) => {
          state.userData.loading = loading;
        }),

      // API data actions
      setApiData: (apiData) =>
        set((state) => {
          Object.assign(state.apiData, apiData);
        }),

      resetApiData: () =>
        set((state) => {
          state.apiData = {
            fetching: false,
            query: "",
            data: null,
            error: null,
            resetSignal: false,
          };
        }),

      showContentDetailsModal: (imdbId, searchItem) =>
        set((state) => {
          state.contentDetailsModal = {
            visible: true,
            imdbId,
            searchItem,
          };
        }),

      hideContentDetailsModal: () =>
        set((state) => {
          state.contentDetailsModal = {
            visible: false,
            imdbId: null,
            searchItem: null,
          };
        }),

      showNotification: (message, type) =>
        set((state) => {
          state.notification = {
            message,
            type,
            visible: true,
          };
        }),

      hideNotification: () =>
        set((state) => {
          state.notification.visible = false;
        }),

      showModal: (content) =>
        set((state) => {
          state.modal = {
            visible: true,
            content,
          };
        }),

      hideModal: () =>
        set((state) => {
          state.modal = {
            visible: false,
            content: null,
          };
        }),
    })),
    {
      name: "watchbook-store",
    },
  ),
);
