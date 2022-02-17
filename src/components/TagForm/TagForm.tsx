/* ---------------------------------
TagForm
--------------------------------- */

import * as React from "react";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { createTag, showNotif } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../index";
import { RootState } from "../../store";
import { ContentItem, TagCollectionType, TagType } from "../../types";
import {
  ERROR_GENERIC_ERROR,
  ERROR_PRE_EXISTING_TAG,
  WARNING_VALUE_NEEDED,
} from "../../constants";
import Spinner from "../Spinner/Spinner";
import SearchField from "../SearchField/SearchField";
import AutoSuggest from "../AutoSuggest/AutoSuggest";

type OwnProps = {
  contentRef: string;
  contentTitle: string;
};

export default function TagForm({
  contentRef,
  contentTitle,
}: PropsWithChildren<OwnProps>): ReactElement | null {
  const dispatch = useDispatch();
  const {
    user: { uid },
  } = useSelector((state: RootState) => state.authentication);

  const [tagInput, setTagInput] = useState("");
  const [existingTag, setExistingTag] = useState("");
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [itemTags, setItemTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const TAGS_PATH = `/tags/${uid}`;
  const CONTENT_PATH = `/content/${contentRef}`;

  async function fetchData(
    path: string
  ): Promise<TagCollectionType | ContentItem> {
    const ref = db.ref(path);

    return (await ref.once("value"))?.val();
  }

  function checkExistence(existingTags: TagType[] = allTags): boolean {
    return Boolean(existingTags.find(tag => tag?.value === tagInput));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tagInput) {
      dispatch(
        showNotif({
          message: WARNING_VALUE_NEEDED("tag"),
          timeOut: 2000,
          theme: "light",
        })
      );

      return;
    }

    if (checkExistence(itemTags)) {
      dispatch(
        showNotif({
          message: ERROR_PRE_EXISTING_TAG,
          timeOut: 2000,
          theme: "light",
        })
      );

      setTagInput("");
      setExistingTag("");

      return;
    }

    dispatch(
      createTag({
        tag: tagInput,
        contentRef,
        title: contentTitle,
        preExisting: checkExistence(),
      })
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagInput(e.target.value);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setExistingTag(e.target.value);
  }

  useEffect(() => {
    Promise.all([fetchData(TAGS_PATH), fetchData(CONTENT_PATH)])
      .then(([allTags, item]) => {
        const _allTags: TagType[] = Object.values(allTags ?? {});

        // Get all existing tags in TAG_PATH
        // and store them in state.
        // TODO store in global state
        if (_allTags?.length) {
          setAllTags(_allTags);
        }

        // Get the item's tags and
        // store them in state.
        if (allTags && item?.tags) {
          const hydratedTags = [];

          for (const k of Object.keys(item.tags)) {
            hydratedTags.push(allTags[k]);
          }

          setItemTags(hydratedTags);
        }
      })
      .catch(err => {
        console.error(err);

        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (existingTag) {
      setTagInput(existingTag);
    }
  }, [existingTag]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    // TODO UI, retry, etc

    return <span>{ERROR_GENERIC_ERROR}</span>;
  }

  return (
    <div className={"tag-form"}>
      <section className="search">
        <form onSubmit={handleSubmit}>
          <SearchField
            error={error}
            onFocus={undefined}
            onReset={undefined}
            onSearch={handleInputChange}
            placeholder={"Add a tag"}
            searchQuery={tagInput}
          />

          {tagInput ? (
            <AutoSuggest
              content={{
                // @ts-ignore
                Search: allTags
                  .filter(tag => tag.value.startsWith(tagInput))
                  // temporary adapter to accommodate the different data type
                  .map(t => ({
                    Title: t.value,
                    Type: "",
                    Year: t.timestamp,
                  })),
              }}
              limit={5}
              onItemClick={undefined}
            />
          ) : null}

          <button type={"submit"}>Add tag</button>
        </form>
      </section>

      <section>
        {itemTags.length ? (
          <>
            <h6>This item's tags:</h6>

            <ul>
              {itemTags.map((t, i) => {
                return <li key={i}>{t?.value}</li>;
              })}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  );
}
