import React from "react";

import {
  makeStyles,
  Box,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import Cardloader from "../utils/cardloader";

import { bookmark } from "../pages";
import { API } from "aws-amplify";

const useStyle = makeStyles((theme) => ({
  cardWrapper: {
    background: "#f3f3f3",
    padding: "40px",
    maxWidth: "600px",
    margin: "10px auto 0 auto ",
    borderRadius: "8px",
    position: "relative",
  },
  title: {
    textTransform: "capitalize",
    fontSize: "30px",
    fontWeight: 550,
  },
  date: {
    marginTop: "-3px",
  },
  description: {
    color: "#718096",
    textTransform: "capitalize",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: "15px",
  },
}));

const deleteBookmark = `
  mutation deleteMutation($bookmarkId: String!){
    deleteBookmark(bookmarkId:$bookmarkId)
  }
`;
interface props {
  bookmarksList: bookmark[] | undefined;
  setBookmarkList: React.Dispatch<React.SetStateAction<bookmark[] | undefined>>;
}

const BookmarkCard: React.FC<props> = ({ setBookmarkList, bookmarksList }) => {
  const classes = useStyle();

  const handleDelete = async (id) => {
    setBookmarkList(undefined);
    await API.graphql({
      query: deleteBookmark,
      variables: { bookmarkId: id },
    });
    let Datadel = await bookmarksList?.filter((item) => {
      return item.id !== id;
    });
    if (Datadel) {
      setBookmarkList(Datadel);
    }
  };

  return (
    <div>
      <div className={`Maincontainer`}>
        {!bookmarksList ? (
          <Box py={10}>
            <Cardloader />
          </Box>
        ) : (
          <Box py={10}>
            {!!bookmarksList &&
              bookmarksList.map((bookmark: bookmark) => (
                <div key={bookmark.id} className={classes.cardWrapper}>
                  <Typography className={classes.description}>
                    {bookmark.text}
                  </Typography>
                  <Box pt={2}>
                    <a href={bookmark.link} target="_blank">
                      <Button
                        variant="contained"
                        disableElevation
                        color="secondary"
                      >
                        Read More
                      </Button>
                    </a>
                  </Box>
                  <div className={classes.deleteButton}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(bookmark.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
          </Box>
        )}
      </div>
    </div>
  );
};

export default BookmarkCard;
