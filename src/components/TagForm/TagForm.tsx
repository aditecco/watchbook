/* ---------------------------------
TagForm
--------------------------------- */

import React, { useEffect, useState } from "react";
import { TagService } from "@/lib/services";
import { useAuth } from "@/hooks/use-auth";
import { useAppStore } from "@/store";
import { InputValidator } from "@/lib/validation";
import SearchField from "../SearchField/SearchField";
import AutoSuggest from "../AutoSuggest/AutoSuggest";
import Spinner from "../Spinner/Spinner";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface TagFormProps {
  contentId: string;
  contentTitle: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

export default function TagForm({ contentId, contentTitle }: TagFormProps) {
  const { user } = useAuth();
  const { showNotification, hideModal } = useAppStore();

  const [tagInput, setTagInput] = useState("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [contentTags, setContentTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState("");

  // Load user's tags and content's current tags
  useEffect(() => {
    if (!user?.id || !contentId) return;

    const loadTagData = async () => {
      try {
        setLoading(true);

        // Load all user's tags
        const userTags = await TagService.getUserTags(user.id);
        setAllTags(userTags || []);

        // Load content's current tags
        const contentTagsData = await TagService.getContentTags(contentId);
        const currentTags = contentTagsData?.map((ct: any) => ct.tags) || [];
        setContentTags(currentTags);
      } catch (err) {
        console.error("Error loading tag data:", err);
        setError(true);
        showNotification("Failed to load tag data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadTagData();
  }, [user?.id, contentId, showNotification]);

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    // Clear error when user starts typing
    if (inputError) setInputError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate tag input
    const tagValidation = InputValidator.validateTagName(tagInput);
    if (!tagValidation.isValid) {
      setInputError(
        "Tag name must be 1-50 characters and contain only letters, numbers, spaces, hyphens, and underscores",
      );
      return;
    }

    if (!user?.id) {
      showNotification("Please log in to add tags", "error");
      return;
    }

    // Check if tag already exists on this content
    if (
      contentTags.some(
        (tag) =>
          tag.name.toLowerCase() === tagValidation.sanitized.toLowerCase(),
      )
    ) {
      showNotification("This tag is already added to this item", "info");
      setTagInput("");
      setInputError("");
      return;
    }

    setSubmitting(true);

    try {
      // Check if tag exists in user's tags, if not create it
      let tag = allTags.find(
        (t) => t.name.toLowerCase() === tagValidation.sanitized.toLowerCase(),
      );

      if (!tag) {
        // Create new tag with validated color
        const colorValidation = InputValidator.validateColor("#3B82F6");
        tag = await TagService.createTag({
          user_id: user.id,
          name: tagValidation.sanitized,
          color: colorValidation.sanitized,
        });
        setAllTags((prev) => [...prev, tag!]);
      }

      // Add tag to content
      if (!tag) {
        throw new Error("Failed to create or find tag");
      }

      await TagService.addTagToContent(contentId, tag.id);
      setContentTags((prev) => [...prev, tag]);

      showNotification(`Added tag "${tag.name}" to ${contentTitle}`, "success");
      setTagInput("");
    } catch (error: any) {
      console.error("Error adding tag:", error);
      showNotification("Failed to add tag", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTag = async (tagId: string, tagName: string) => {
    if (!user?.id) return;

    try {
      await TagService.removeTagFromContent(contentId, tagId);
      setContentTags((prev) => prev.filter((tag) => tag.id !== tagId));
      showNotification(`Removed tag "${tagName}"`, "success");
    } catch (error: any) {
      console.error("Error removing tag:", error);
      showNotification("Failed to remove tag", "error");
    }
  };

  const handleTagSuggestionClick = (tagName: string) => {
    setTagInput(tagName);
  };

  const getSuggestedTags = () => {
    if (!tagInput) return [];
    return allTags
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
          !contentTags.some((ct) => ct.id === tag.id),
      )
      .slice(0, 5);
  };

  const TagSuggestionMapper =
    (clickHandler: (tagName: string) => void) => (tag: Tag, i: number) => (
      <li
        key={i}
        className="AutoSuggestItem wrapper"
        onClick={() => clickHandler(tag.name)}
      >
        <div className="AutoSuggestItemLinkTarget">
          <h4 className="AutoSuggestItemTitle" style={{ color: tag.color }}>
            <MaterialIcon icon="local_offer" /> {tag.name}
          </h4>
        </div>
      </li>
    );

  if (loading) {
    return (
      <div className="TagForm">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="TagForm">
        <div className="TagFormError">
          <MaterialIcon icon="error" />
          <p>Failed to load tag data. Please try again.</p>
          <button
            className="BaseButton"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const suggestedTags = getSuggestedTags();

  return (
    <div className="TagForm">
      <h3 className="TagFormTitle">Manage Tags for "{contentTitle}"</h3>

      <section className="TagFormSearch">
        <form onSubmit={handleSubmit}>
          <SearchField
            searchQuery={tagInput}
            onSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTagInput(e.target.value)
            }
            onFocus={() => {}}
            onReset={() => setTagInput("")}
            placeholder="Add a tag..."
            error={false}
          />

          {suggestedTags.length > 0 && (
            <AutoSuggest
              content={suggestedTags}
              limit={5}
              contentMapper={TagSuggestionMapper(handleTagSuggestionClick)}
              fetching={false}
            />
          )}

          <div className="TagFormActions">
            <button
              type="submit"
              className="BaseButton"
              disabled={submitting || !tagInput.trim()}
            >
              <MaterialIcon icon="add" />
              {submitting ? "Adding..." : "Add Tag"}
            </button>

            <button
              type="button"
              className="BaseButton button--outline"
              onClick={hideModal}
            >
              <MaterialIcon icon="close" />
              Close
            </button>
          </div>
        </form>
      </section>

      {contentTags.length > 0 && (
        <section className="TagFormCurrentTags">
          <h4>Current Tags:</h4>
          <ul className="TagList">
            {contentTags.map((tag) => (
              <li
                key={tag.id}
                className="TagItem"
                style={{ borderColor: tag.color }}
              >
                <span className="TagName" style={{ color: tag.color }}>
                  <MaterialIcon icon="local_offer" />
                  {tag.name}
                </span>
                <button
                  className="TagRemoveButton"
                  onClick={() => handleRemoveTag(tag.id, tag.name)}
                  title={`Remove tag "${tag.name}"`}
                >
                  <MaterialIcon icon="close" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
