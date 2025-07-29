"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { useContentFull } from "@/lib/api";
import Spinner from "../Spinner/Spinner";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "@/constants";

interface DataProviderProps {
  render: (data: any[]) => React.ReactNode;
  dataSet: string;
}

export default function DataProvider({ render, dataSet }: DataProviderProps) {
  const { auth } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  // Fetch content with full relationships using the new schema
  const { data: contentData, isLoading: contentLoading } = useContentFull(
    auth.user?.id || "",
  );

  useEffect(() => {
    if (!auth.user?.id) {
      setLoading(false);
      return;
    }

    if (contentLoading) {
      setLoading(true);
      return;
    }

    if (!contentData) {
      setData([]);
      setLoading(false);
      return;
    }

    // Transform data to match the Card component's expected format
    const transformedData = contentData.map((item: any) => {
      return {
        // Card component expects these specific fields
        id: item.id,
        key: item.id, // Legacy compatibility
        image:
          item.poster || "https://via.placeholder.com/300x400?text=No+Image",
        title: item.title,
        type: item.type,
        year: item.year?.toString() || "N/A",

        // Additional data that goes into additionalData prop
        // Make sure these match what CardBack expects
        contentId: item.id, // CRITICAL: Add contentId for operations
        actors: item.actors || null,
        awards: item.awards || null,
        boxoffice: item.box_office || null,
        country: item.country || null,
        director: item.director || null,
        dvd: item.dvd || null,
        genre: item.genre || null,
        imdbid: item.imdb_id || "",
        imdbrating: item.imdb_rating || null,
        imdbvotes: item.imdb_votes || null,
        language: item.language || null,
        metascore: item.metascore || null,
        plot: item.plot || null,
        poster: item.poster || "",
        production: item.production || null,
        rated: item.rated || null,
        ratings: item.ratings || [],
        released: item.released || null,
        response: item.response || "",
        runtime: item.runtime || null,
        timestamp: new Date(item.created_at).getTime(),
        website: item.website || "",
        writer: item.writer || null,
        rating: item.user_rating || 0,
        notes: item.note_content || "",
        tags: item.tags || [],
        status: item.status,
      };
    });

    // Filter by dataset (watched vs to-watch)
    const filteredData = transformedData.filter((item: any) => {
      if (dataSet === PRIMARY_DATASET_KEY) {
        return item.status === "watched";
      } else if (dataSet === SECONDARY_DATASET_KEY) {
        return item.status === "to_watch";
      }
      return true; // Return all if no specific dataset
    });

    setData(filteredData);
    setLoading(false);
  }, [auth.user?.id, contentData, contentLoading, dataSet]);

  return loading ? <Spinner shadow="none" /> : render(data);
}
