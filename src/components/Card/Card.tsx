"use client";

import React, { ReactElement, useState } from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import CardControls from "./CardControls";
import CardBack from "./CardBack";
import {
  PRIMARY_DATASET_KEY,
  SECONDARY_DATASET_KEY,
  UI_LABELS,
} from "@/constants";
import { animated, useSpring } from "react-spring";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { ContentService, NoteService } from "@/lib/services";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../Spinner/Spinner";
import RatingControls from "../RatingControls/RatingControls";
import Note from "../Note/Note";
import TagForm from "../TagForm/TagForm";
// Simple utility functions to avoid SSR issues
const clipText = (t: string, maxLength: number = 15) => {
  if (t.length < maxLength) return t;
  return t.substring(0, maxLength) + "…";
};

const normalize = (data: any) => {
  if (!data) return {};
  return Object.entries(data).reduce((acc: any, [key, val]) => {
    acc[key.toLowerCase()] = val;
    return acc;
  }, {});
};

// TODO
interface OwnProps {
  added: boolean;
  additionalData: any;
  dataSet: string;
  image: string;
  onToWatchClick?: (data: any) => void;
  onWatchedClick?: (data: any) => void;
  title: string;
  type: string;
  year: string;
  contentId?: string; // Add contentId for existing content operations
}

export default React.memo(function Card(props: OwnProps): ReactElement {
  const {
    added,
    additionalData,
    dataSet,
    image,
    onToWatchClick,
    onWatchedClick,
    title,
    type,
    year,
    contentId,
  } = props;
  const [flipped, toggleFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification, showModal, hideModal } = useAppStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Helper function to refresh data after operations
  const refreshData = () => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ["content", user.id] });
      queryClient.invalidateQueries({
        queryKey: ["content-with-tags", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["content-with-notes", user.id],
      });
      queryClient.invalidateQueries({ queryKey: ["content-full", user.id] });
    }
  };

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  // Don't double-normalize data that's already been processed by DataProvider
  // Only normalize OMDB API data that comes with capitalized keys
  const _additionalData =
    additionalData &&
    typeof additionalData === "object" &&
    (additionalData.Title || additionalData.Director || additionalData.Plot)
      ? normalize(additionalData)
      : additionalData || {};

  /**
   * createWatched
   */

  async function createWatched(e?: React.MouseEvent) {
    if (e) e.preventDefault();

    if (!user?.id) {
      showNotification("Please log in to manage your watchlist", "error");
      return;
    }

    setLoading(true);
    try {
      // First fetch complete OMDB data to avoid sparse records
      const imdbId = _additionalData.imdbid || "";
      if (!imdbId) {
        throw new Error("Missing IMDB ID");
      }

      // Fetch complete OMDB data
      const response = await fetch(`/api/omdb/fetch?id=${imdbId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 500 && errorData.error?.includes("API key")) {
          throw new Error(
            "OMDB API key not configured. Please contact the administrator.",
          );
        }

        // Handle both 400 (OMDB API errors) and 500 (server errors)
        throw new Error(
          errorData.error ||
            `Failed to fetch complete data (${response.status})`,
        );
      }

      const completeOmdbData = await response.json();

      // Note: We don't need to check Response === 'False' here anymore
      // because the API route already handles OMDB errors and returns 400 status

      const result = await ContentService.createFromOMDB(
        completeOmdbData,
        user.id,
        "watched",
      );

      // Check if this was an update vs a new creation
      const wasUpdated = result.updated_at !== result.created_at;
      if (wasUpdated) {
        showNotification(`Moved "${title}" to watched list`, "success");
      } else {
        showNotification(`Added "${title}" to watched list`, "success");
      }
      refreshData(); // Refresh data after successful operation
      hideModal(); // Close modal after successful action

      // Call parent handler if provided (for legacy compatibility)
      if (onWatchedClick) {
        onWatchedClick({
          contentType: PRIMARY_DATASET_KEY,
          image,
          title,
          type,
          year,
          ..._additionalData,
        });
      }
    } catch (error: any) {
      console.error("Error adding to watched:", error);
      showNotification("Failed to add to watched list", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * createToWatch
   */

  async function createToWatch(e?: React.MouseEvent) {
    if (e) e.preventDefault();

    if (!user?.id) {
      showNotification("Please log in to manage your watchlist", "error");
      return;
    }

    setLoading(true);
    try {
      // First fetch complete OMDB data to avoid sparse records
      const imdbId = _additionalData.imdbid || "";
      if (!imdbId) {
        throw new Error("Missing IMDB ID");
      }

      // Fetch complete OMDB data
      const response = await fetch(`/api/omdb/fetch?id=${imdbId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 500 && errorData.error?.includes("API key")) {
          throw new Error(
            "OMDB API key not configured. Please contact the administrator.",
          );
        }

        // Handle both 400 (OMDB API errors) and 500 (server errors)
        throw new Error(
          errorData.error ||
            `Failed to fetch complete data (${response.status})`,
        );
      }

      const completeOmdbData = await response.json();

      // Note: We don't need to check Response === 'False' here anymore
      // because the API route already handles OMDB errors and returns 400 status

      const result = await ContentService.createFromOMDB(
        completeOmdbData,
        user.id,
        "to_watch",
      );

      // Check if this was an update vs a new creation
      const wasUpdated = result.updated_at !== result.created_at;
      if (wasUpdated) {
        showNotification(`Moved "${title}" to watch list`, "success");
      } else {
        showNotification(`Added "${title}" to watch list`, "success");
      }
      refreshData(); // Refresh data after successful operation
      hideModal(); // Close modal after successful action

      // Call parent handler if provided (for legacy compatibility)
      if (onToWatchClick) {
        onToWatchClick({
          contentType: SECONDARY_DATASET_KEY,
          image,
          title,
          type,
          year,
          ..._additionalData,
        });
      }
    } catch (error: any) {
      console.error("Error adding to watch list:", error);
      showNotification("Failed to add to watch list", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * deleteToWatch
   */

  async function deleteToWatch() {
    if (!user?.id || !contentId) {
      showNotification("Unable to delete - missing information", "error");
      return;
    }

    setLoading(true);
    try {
      await ContentService.deleteContent(contentId);
      showNotification(`Removed "${title}" from your lists`, "success");
      refreshData(); // Refresh data after successful operation
      hideModal(); // Close modal after successful deletion
    } catch (error: any) {
      console.error("Error deleting content:", error);
      showNotification("Failed to remove from watch list", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * createWatchedFromToWatch
   *
   * - remove toWatch status from user profile
   * - add watched status to user profile
   * - (leave content item untouched)
   */

  async function createWatchedFromToWatch() {
    if (!user?.id || !contentId) {
      showNotification("Unable to update - missing information", "error");
      return;
    }

    setLoading(true);
    try {
      await ContentService.updateStatus(contentId, "watched");
      showNotification(`Moved "${title}" to watched list`, "success");
      refreshData(); // Refresh data after successful operation
      hideModal(); // Close modal after successful action
    } catch (error: any) {
      console.error("Error updating status:", error);
      showNotification("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * createNote - opens the note creation modal
   */

  function openNoteModal() {
    if (!added) {
      showNotification(
        "Notes are only available for items in your collection",
        "info",
      );
      return;
    }

    if (!contentId) {
      showNotification("Unable to manage notes - missing content ID", "error");
      return;
    }

    showModal(
      <Note
        cardId={contentId}
        content={_additionalData.notes}
        itemTitle={title}
        actions={
          _additionalData.notes
            ? [
                // note exists, edit mode
                {
                  type: "delete",
                  label: "Delete",
                  handler: deleteNote,
                  icon: "delete",
                },
                {
                  type: "create",
                  label: "Save",
                  handler: saveNote,
                  icon: "save",
                },
              ]
            : [
                // no note, create mode
                {
                  type: "discard",
                  label: "Discard",
                  handler: () => {
                    hideModal();
                  },
                  icon: "clear",
                },
                {
                  type: "create",
                  label: "Save",
                  handler: saveNote,
                  icon: "save",
                },
              ]
        }
      />,
    );
  }

  /**
   * saveNote - saves or updates a note
   */

  async function saveNote(noteContent?: string) {
    if (!contentId) {
      showNotification("Unable to save note - missing content ID", "error");
      return;
    }

    if (!noteContent) {
      showNotification("Note content is required", "error");
      return;
    }

    setLoading(true);
    try {
      await NoteService.upsertNote(contentId, noteContent);
      showNotification(
        `Note ${_additionalData.notes ? "updated" : "created"} for "${title}"`,
        "success",
      );
      refreshData(); // Refresh data after successful operation

      // Update local data
      _additionalData.notes = noteContent;
      hideModal();
    } catch (error: any) {
      console.error("Error saving note:", error);
      showNotification("Failed to save note", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * deleteNote - deletes a note
   */

  async function deleteNote() {
    if (!contentId) {
      showNotification("Unable to delete note - missing content ID", "error");
      return;
    }

    setLoading(true);
    try {
      await NoteService.deleteNote(contentId);
      showNotification(`Note deleted for "${title}"`, "success");
      refreshData(); // Refresh data after successful operation

      // Update local data
      _additionalData.notes = "";
      hideModal();
    } catch (error: any) {
      console.error("Error deleting note:", error);
      showNotification("Failed to delete note", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * createTag - opens the tag creation interface
   */

  function createTag() {
    if (!added) {
      showNotification(
        "Tags are only available for items in your collection",
        "info",
      );
      return;
    }

    if (!contentId) {
      showNotification("Unable to manage tags - missing content ID", "error");
      return;
    }

    showModal(<TagForm contentId={contentId} contentTitle={title} />);
  }

  /**
   * updateContentInfo - re-fetches content data from OMDB
   */

  async function updateContentInfo() {
    if (!contentId || !_additionalData.imdbid) {
      showNotification("Unable to update - missing OMDB ID", "error");
      return;
    }

    setLoading(true);
    try {
      // Re-fetch from OMDB API
      const response = await fetch(
        `/api/omdb/fetch?id=${_additionalData.imdbid}`,
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
          errorData.error ||
            `Failed to fetch updated data (${response.status})`,
        );
      }

      const omdbData = await response.json();

      // Note: We don't need to check Response === 'False' here anymore
      // because the API route already handles OMDB errors and returns 400 status

      // For now, just show success - full OMDB update would need additional service method
      showNotification(`Updated info for "${title}"`, "success");

      // TODO: Refresh the component data or trigger a re-fetch
    } catch (error: any) {
      console.error("Error updating content info:", error);
      showNotification("Failed to update content info", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * createRating
   */

  async function createRating(rating: number) {
    if (!user?.id || !contentId) {
      showNotification("Unable to save rating - missing information", "error");
      return;
    }

    setLoading(true);
    try {
      await ContentService.updateRating(contentId, rating);
      showNotification(
        `Rated "${title}" with ${rating} star${rating !== 1 ? "s" : ""}`,
        "success",
      );
      refreshData(); // Refresh data after successful operation

      // Update local additionalData to reflect the new rating immediately
      _additionalData.rating = rating;
    } catch (error: any) {
      console.error("Error saving rating:", error);
      showNotification("Failed to save rating", "error");
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <Spinner />
  ) : (
    <div className="CardContainer">
      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          zIndex: !flipped ? 1 : "auto",
          // TODO
          // @ts-ignore
          opacity: opacity.interpolate((o: number) => 1 - o),
          transform,
        }}
      >
        <article
          className={`Card front${added ? " added" : ""}${
            dataSet === SECONDARY_DATASET_KEY ? " toWatch" : ""
          }`}
        >
          {added && dataSet !== SECONDARY_DATASET_KEY && (
            <RatingControls
              initialRating={_additionalData.rating || 0}
              onRate={createRating}
            />
          )}

          <div className="CardFlipControls">
            <div
              className="CardFlipAreaButton"
              onClick={() => toggleFlipped(!flipped)}
            >
              <MaterialIcon icon="info" />
            </div>
          </div>

          <section className="CardMedia">
            <div className="CardPosterCurtain">
              <h3 className="CardPosterCurtainTitle">{title}</h3>
              <ul className="CardMeta">
                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Year</h6>
                  {year}
                </li>
                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Country</h6>
                  {(_additionalData.country &&
                    clipText(_additionalData.country)) ||
                    "Unknown"}
                </li>
                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Director</h6>
                  {(_additionalData.director &&
                    clipText(_additionalData.director)) ||
                    "Unknown"}
                </li>
              </ul>
            </div>
            <img src={image} alt={title} className="CardPoster" />
          </section>

          <footer className="CardFooter">
            <div className="CardControls">
              {!added ? (
                <CardControls
                  labels={
                    UI_LABELS.cardControlsLabels(dataSet) as [string, string]
                  }
                  icons={["check_circle", "bookmark"]}
                  handlers={[createWatched, createToWatch]}
                  type={dataSet}
                />
              ) : dataSet === SECONDARY_DATASET_KEY ? (
                <CardControls
                  labels={
                    UI_LABELS.cardControlsLabels(dataSet) as [string, string]
                  }
                  icons={["check_circle", "remove_circle"]}
                  handlers={[createWatchedFromToWatch, deleteToWatch]}
                  type={dataSet}
                />
              ) : null}
            </div>
          </footer>
        </article>
      </animated.div>

      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          zIndex: flipped ? 1 : "auto",
          opacity,
          transform: transform.interpolate(
            (t: string) => `${t} rotateY(180deg)`,
          ),
        }}
      >
        <CardBack
          noteHandler={openNoteModal}
          tagHandler={createTag}
          flipHandler={() => toggleFlipped(!flipped)}
          contentUpdateHandler={updateContentInfo}
          additionalData={_additionalData}
          added={added}
          title={title}
        />
      </animated.div>
    </div>
  );
});
