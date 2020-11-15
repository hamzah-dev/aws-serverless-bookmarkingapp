import React from "react";

import {
  makeStyles,
  Box,
  Typography,
  Button,
  TextField,
  TextareaAutosize,
} from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorMsg from "../utils/errorMsg";
import { bookmark } from "../pages";
import { API } from "aws-amplify";
import shortId from "shortid";

const useStyle = makeStyles((theme) => ({
  root: {
    background: "white",
    width: "100%",
    maxWidth: "350px",
    borderRadius: "5px",
    margin: "0 auto",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: 550,
  },
}));

const initialValues = {
  url: "",
  text: "",
};

const validationSchema = Yup.object({
  url: Yup.string()
    .matches(
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
      "Enter correct url!"
    )
    .required("Website url is required"),
  text: Yup.string().required("Description is Required"),
});

interface props {
  bookmarksList: bookmark[] | undefined;
  setBookmarkList: React.Dispatch<React.SetStateAction<bookmark[] | undefined>>;
}

const createBookmark = `
  mutation createBookmark($newBookmark: bookmarkCreateInput!){
      createBookmark(newBookmark: $newBookmark){
          id
          text
          link
      }
  }
`;

const AddBookmark: React.FC<props> = ({ setBookmarkList, bookmarksList }) => {
  const classes = useStyle();

  async function _handleSubmit(values) {
    const id: string = shortId.generate();
    setBookmarkList(undefined);
    const res: any = await API.graphql({
      query: createBookmark,
      variables: {
        newBookmark: { id: id, text: values.text, link: values.url },
      },
    });
    let dataUpdated = await bookmarksList?.map((item) => {
      return item;
    });

    await dataUpdated?.push(res.data.createBookmark);

    setBookmarkList(dataUpdated);
  }

  const onSubmit = async (values, actions) => {
    _handleSubmit(values);

    actions.resetForm({
      values: {
        url: "",
        text: "",
      },
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.root}>
        <Box p={3}>
          <Box pb={1}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form>
                <Box pb={2}>
                  <Typography
                    color="secondary"
                    className={` ${classes.formTitle}`}
                  >
                    Add Bookmark
                  </Typography>
                </Box>

                <Box style={{ paddingBottom: "12px" }}>
                  <div>
                    <Field
                      as={TextField}
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="url"
                      type="text"
                      label="Url"
                    />
                    <ErrorMessage name="url" component={ErrorMsg} />
                  </div>
                </Box>
                <Box style={{ paddingBottom: "12px" }}>
                  <div>
                    <Field
                      as={TextField}
                      color="secondary"
                      multiline
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="text"
                      label="Description"
                      rows={3}
                    />
                    <ErrorMessage name="text" component={ErrorMsg} />
                  </div>
                </Box>
                <Button variant="contained" color="secondary" type="submit">
                  Submit
                </Button>
              </Form>
            </Formik>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default AddBookmark;
