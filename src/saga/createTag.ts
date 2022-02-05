/* ---------------------------------
createTag
--------------------------------- */

import { put, select, takeEvery } from "redux-saga/effects";
import {
  createTag,
  createTagError,
  createTagPending,
  createTagSuccess,
  showNotif,
  toggleModal,
} from "../redux/actions";
import uuidv4 from "uuid";
import { db } from "../index";
import { TagType } from "../types";
import { ERROR_GENERIC_ERROR } from "../constants";

/**
 * createTagSaga
 */

function* createTagSaga(action) {
  const {
    payload: { tag, contentRef, title, preExisting },
  } = action;

  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newTag: TagType | Record<string, unknown> = tag
    ? {
        id: uuidv4(),
        timestamp: Date.now(),
        value: tag,
        label: tag,
        assignedTo: { [contentRef]: true },
      }
    : {};

  yield put(createTagPending());

  try {
    const tagsPath = `/tags/${uid}`;
    const contentItemPath = `content/${contentRef}`;

    const dbRef = db.ref();
    const tagsPathRef = db.ref(tagsPath);
    const taggedContentRef = db.ref(contentItemPath);
    const newTagKey = tagsPathRef.push().key;

    let prevTags: Record<string, TagType>;
    let taggedContentItem; // TODO type

    // Get the content item to which the tag will be assigned
    yield taggedContentRef.once("value").then(snapshot => {
      const v = snapshot.val();

      if (v) {
        taggedContentItem = v;
      }
    });

    // TODO remove and use `allTags` & `item` from src/components/TagForm/TagForm.tsx?
    // Get the previously existing tags
    yield tagsPathRef.once("value").then(snapshot => {
      const v = snapshot.val();

      if (v) {
        prevTags = v;
      }
    });

    // If we don't get our data, we abort.
    if (!prevTags || !taggedContentItem) {
      yield put(
        showNotif({
          // TODO
          message: ERROR_GENERIC_ERROR,
          icon: "local_offer",
          timeOut: 2000,
          theme: "light",
        })
      );

      throw new Error(ERROR_GENERIC_ERROR);
    }

    // The tag's value is already present in the tag pool:
    // the tag should not be created, but just assigned to the content.
    if (preExisting) {
      const [existingTagDBkey] = Object.entries(prevTags).find(
        ([_, t]) => tag === t.value
      );

      yield dbRef.update({
        // tag
        [`${tagsPath}/${existingTagDBkey}`]: {
          ...prevTags[existingTagDBkey],
          assignedTo: {
            ...prevTags[existingTagDBkey].assignedTo,
            [contentRef]: true,
          },
        },

        // content
        [contentItemPath]: {
          ...taggedContentItem,
          tags: {
            ...(taggedContentItem.tags ?? {}),
            [existingTagDBkey]: true,
          },
        },
      });
    }

    // The tag's value is new: the tag should be created.
    else {
      yield dbRef.update({
        // tag
        [tagsPath]: {
          ...prevTags,
          [newTagKey]: newTag,
        },

        // content
        [contentItemPath]: {
          ...taggedContentItem,
          tags: {
            ...(taggedContentItem.tags ?? {}),
            [newTagKey]: true,
          },
        },
      });
    }

    // TODO use call

    yield put(createTagSuccess());

    yield put(toggleModal());

    yield put(
      showNotif({
        // TODO
        message: `Created new tag for: ${title}`,
        icon: "local_offer",
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(createTagError({ error }));
  }
}

/**
 * createTagWatcher
 */

export default function* createTagWatcher() {
  yield takeEvery(`${createTag}`, createTagSaga);
}
