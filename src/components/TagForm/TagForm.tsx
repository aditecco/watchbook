/* ---------------------------------
TagForm
--------------------------------- */

import * as React from "react";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { createTag } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../index";
import { RootState } from "../../store";

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
  const [tag, setTag] = useState("");
  const [existingTag, setExistingTag] = useState("");
  const [allTags, setAllTags] = useState([]);

  async function fetchTags() {
    const tagsRef = db.ref(`/tags/${uid}`);

    return (await tagsRef.once("value"))?.val();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const _tag = tag || existingTag;

    if (!_tag) return;

    dispatch(
      createTag({
        tag: _tag,
        contentRef,
        title: contentTitle,
      })
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTag(e.target.value);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setExistingTag(e.target.value);
  }

  useEffect(() => {
    fetchTags().then(v => {
      if (v) {
        setAllTags(
          Object.values(v)
            .map(o => Object.values(o))
            .flat()
        );
      }
    });
  }, []);

  return (
    <div className={"tag-form"}>
      <form onSubmit={handleSubmit}>
        {allTags.length ? (
          <select name={"tag_select"} onChange={handleSelectChange}>
            {[{ value: "Select a tag" }].concat(allTags).map((tag, i) => (
              <option key={i} value={tag.value}>
                {/* TODO needs a label/key */}
                {tag.value}
              </option>
            ))}
          </select>
        ) : (
          "loading tags..."
        )}

        <input name={"tag_input"} type="text" onChange={handleInputChange} />

        <button type={"submit"}>Add tag</button>
      </form>
    </div>
  );
}
