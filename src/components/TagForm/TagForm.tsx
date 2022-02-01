/* ---------------------------------
TagForm
--------------------------------- */

import * as React from "react";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { createTag, showNotif } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../index";
import { RootState } from "../../store";
import { TagType } from "../../types";
import { WARNING_VALUE_NEEDED } from "../../constants";

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
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTags() {
    const tagsRef = db.ref(`/tags/${uid}`);

    return (await tagsRef.once("value"))?.val();
  }

  function checkExistence() {
    return allTags.some((tag: TagType) => tag.value === tagInput);
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

    // if (checkExistence()) {
    //   dispatch(
    //     showNotif({
    //       message: ERROR_PRE_EXISTING_CONTENT,
    //       timeOut: 2000,
    //       theme: "light",
    //     })
    //   );
    //
    //   setTagInput("");
    //   setExistingTag("");
    //
    //   return;
    // }

    dispatch(
      createTag({
        tag: tagInput,
        contentRef,
        title: contentTitle,
        assignMultiple: checkExistence(),
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
    fetchTags().then(v => {
      if (v) {
        setAllTags(Object.values(v as Record<string, TagType>));
      }

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (existingTag) {
      setTagInput(existingTag);
    }
  }, [existingTag]);

  return (
    <div className={"tag-form"}>
      <form onSubmit={handleSubmit}>
        {loading ? (
          "Loading tags..."
        ) : allTags.length ? (
          <select
            name={"tag_select"}
            onChange={handleSelectChange}
            value={existingTag}
          >
            {[({ value: "", label: "Select a tag" } as unknown) as TagType]
              .concat(allTags)
              .map((tag: TagType, i) => (
                <option key={tag.id || i} value={tag.value}>
                  {tag.label}
                </option>
              ))}
          </select>
        ) : null}

        <input
          name={"tag_input"}
          type="text"
          onChange={handleInputChange}
          value={tagInput}
        />

        <button type={"submit"}>Add tag</button>
      </form>
    </div>
  );
}
