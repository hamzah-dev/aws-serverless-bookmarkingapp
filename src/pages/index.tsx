import React, { useEffect, useState } from "react";
import { API, Amplify } from "aws-amplify";
//components
import BookmarkCard from "../components/bookmarkCard";
import BoomarkLandingSection from "../components/boomarkLandingSection";
import "../main.css";

const allBookmarks = `
 {
    allBookmarks {
      id
      link
      text
    }
  }  
`;

export type bookmark = {
  id: string;
  text: string;
  link: string;
};

const Index = () => {
  const [bookmarksList, setBookmarkList] = useState<any>();

  useEffect(() => {
    (async () => {
      const data: any = await API.graphql({ query: allBookmarks });
      setBookmarkList(data.data.allBookmarks);
    })();
  }, []);

  return (
    <div>
      <div>
        <BoomarkLandingSection
          bookmarksList={bookmarksList}
          setBookmarkList={setBookmarkList}
        />
        <BookmarkCard
          bookmarksList={bookmarksList}
          setBookmarkList={setBookmarkList}
        />
      </div>
    </div>
  );
};

export default Index;
