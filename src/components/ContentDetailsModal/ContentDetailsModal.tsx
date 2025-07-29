"use client";

import React, { ReactElement, useEffect } from "react";
import { useOMDBFetch } from "@/lib/api";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { ContentService } from "@/lib/services";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { useQueryClient } from "@tanstack/react-query";

interface ContentDetailsModalProps {
  imdbId: string;
  searchItem: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  };
  onClose: (wasSuccessfulSubmission?: boolean) => void;
}

export default function ContentDetailsModal({
  imdbId,
  searchItem,
  onClose,
}: ContentDetailsModalProps): ReactElement {
  const { showNotification } = useAppStore();
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

  // Handle manual close (when user clicks X button)
  const handleClose = () => {
    onClose(false); // No successful submission when manually closing
  };

  // Fetch detailed content data
  const { data: detailedData, isLoading, error } = useOMDBFetch(imdbId, true);

  useEffect(() => {
    if (error) {
      showNotification(
        `Failed to load content details: ${error.message}`,
        "error",
      );
    }
  }, [error, showNotification]);

  const handleWatchedClick = async (data: any) => {
    if (!user?.id) {
      showNotification("Please log in to add content", "error");
      return;
    }

    try {
      // Create content from OMDB data and set as watched
      const omdbData = {
        imdbID: imdbId,
        Title: searchItem.Title,
        Type: searchItem.Type,
        Year: searchItem.Year,
        Poster: searchItem.Poster,
        ...detailedData,
      };

      const result = await ContentService.createFromOMDB(
        omdbData,
        user.id,
        "watched",
      );

      // Check if this was an update vs a new creation
      const wasUpdated = result.updated_at !== result.created_at;
      if (wasUpdated) {
        showNotification(
          `Moved "${searchItem.Title}" to watched list`,
          "success",
        );
      } else {
        showNotification(
          `Added "${searchItem.Title}" to watched list`,
          "success",
        );
      }
      refreshData(); // Refresh data after successful operation
      onClose(true); // Pass true for successful submission
    } catch (error: any) {
      console.error("Error adding to watched:", error);
      showNotification("Failed to add to watched list", "error");
    }
  };

  const handleToWatchClick = async (data: any) => {
    if (!user?.id) {
      showNotification("Please log in to add content", "error");
      return;
    }

    try {
      // Create content from OMDB data and set as to_watch
      const omdbData = {
        imdbID: imdbId,
        Title: searchItem.Title,
        Type: searchItem.Type,
        Year: searchItem.Year,
        Poster: searchItem.Poster,
        ...detailedData,
      };

      const result = await ContentService.createFromOMDB(
        omdbData,
        user.id,
        "to_watch",
      );

      // Check if this was an update vs a new creation
      const wasUpdated = result.updated_at !== result.created_at;
      if (wasUpdated) {
        showNotification(
          `Moved "${searchItem.Title}" to watch list`,
          "success",
        );
      } else {
        showNotification(
          `Added "${searchItem.Title}" to watch list`,
          "success",
        );
      }
      refreshData(); // Refresh data after successful operation
      onClose(true); // Pass true for successful submission
    } catch (error: any) {
      console.error("Error adding to to-watch:", error);
      showNotification("Failed to add to watch list", "error");
    }
  };

  return (
    <section className="Modal">
      <div className="ModalControls">
        <button
          type="button"
          className="ModalCloseButton"
          onClick={handleClose}
        >
          <MaterialIcon icon="close" />
        </button>
      </div>

      <div className="ModalContainer">
        {isLoading ? (
          <div className="ModalLoading">
            <Spinner />
          </div>
        ) : detailedData ? (
          <Card
            image={searchItem.Poster}
            title={searchItem.Title}
            type={searchItem.Type}
            year={searchItem.Year}
            additionalData={detailedData}
            added={false}
            dataSet=""
            onWatchedClick={handleWatchedClick}
            onToWatchClick={handleToWatchClick}
          />
        ) : (
          <div className="ModalError">
            <MaterialIcon icon="error" />
            <p>Failed to load content details</p>
          </div>
        )}
      </div>
    </section>
  );
}
