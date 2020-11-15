import allBookmarks from "./allBookmark";
import createBookmark from "./createBookmark";
import deleteBookmark from "./deleteBookmark";
import { bookmarkType } from "./bookmark";

type AppSyncType = {
  info: {
    fieldName: string;
  };
  arguments: {
    bookmarkId: string;
    newBookmark: bookmarkType;
  };
};

exports.handler = async (event: AppSyncType) => {
  switch (event.info.fieldName) {
    case "allBookmarks":
      return await allBookmarks();
    case "createBookmark":
      return await createBookmark(event.arguments.newBookmark);
    case "deleteBookmark":
      return await deleteBookmark(event.arguments.bookmarkId);
    default:
      return null;
  }
};
