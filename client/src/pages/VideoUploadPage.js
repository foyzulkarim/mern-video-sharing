import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useFormik } from "formik";
import * as yup from "yup";

import axios from "axios";

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "left",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// We only validate the title field for now. The video file is validated separately here and also in the backend.
const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export default function VideoUploadPage() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // axios post the values to the backend
  const postToServer = async (values) => {
    const { title } = values;
    // `videoFile` is the name of the input field in the form. If you change the name of the input field in the form, you need to change it here as well.
    const videoFile = values.videoFile;

    // We are creating a FormData object here. This is required for the backend to handle the file upload. We are only sending two fields here. One is the title and the other is the video file. You can add more fields if you want.
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/videos/upload",
        formData,
        {
          headers: {
            // We are setting the content type to multipart/form-data here. This is required for the backend to handle the file upload.
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        }
      );
      setAlertType("success");
      setUploadResponse(response.data.message);
      console.log(response);
    } catch (error) {
      console.log(error);
      setAlertType("error");
      setUploadResponse(error.response.data.error.message);
    }
  };

  // formik object creation and configuration is happening here. We are using the `initialErrors` property to set the initial error for the video file field. This is required because we are not validating the video file field in the formik validationSchema. We are validating the video file field separately here and also in the backend. So we need to set the initial error for the video file field here.
  const formik = useFormik({
    initialErrors: {
      videoFile: "Video file is required",
    },
    initialValues: {
      title: "title1", // hardcoded sample value for title
      videoFile: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await postToServer(values);
    },
    // We are validating the video file field separately here and also in the backend. So we need to set the initial error for the video file field here. We are also validating the video file size and type here.
    validate: (values) => {
      const errors = {};
      if (!values.videoFile) {
        errors.videoFile = "Video file is required";
      }
      // check videoFile size
      if (values.videoFile?.size > MAX_FILE_SIZE) {
        errors.videoFile = "Video file size should be less than 100MB";
      }

      // check videoFile type, must be .mp4 or .mkv
      // special note: in macos, .mkv file is not treated as the same way it is being treated in ubuntu.
      if (
        values.videoFile?.type !== "video/mp4" &&
        values.videoFile?.type !== "video/x-matroska"
      ) {
        errors.videoFile = "Video file type should be .mp4 or .mkv";
      }

      return errors;
    },
  });

  return (
    <>
      <Helmet>
        <title> Video upload</title>
      </Helmet>

      <>
        <Container>
          <StyledContent>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Upload video
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <label htmlFor="video">
                  <input
                    style={{ display: "none" }}
                    name="video"
                    accept="video/*"
                    id="video"
                    type="file"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("videoFile", file);
                    }}
                  />
                  <Button
                    color="secondary"
                    variant="contained"
                    component="span"
                  >
                    Upload video
                  </Button>
                </label>
                {/* video file name display here */}
                <TextField
                  value={formik.values.videoFile?.name}
                  error={Boolean(formik.errors?.videoFile)}
                  helperText={formik.errors?.videoFile}
                />
                <TextField
                  id="title"
                  name="title"
                  label="Video title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <LoadingButton
                  //fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Upload
                </LoadingButton>
              </Stack>
            </form>
            <Stack>
              <Snackbar
                open={uploadResponse}
                autoHideDuration={5000}
                onClose={() => {
                  setUploadResponse(null);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={() => {
                    setUploadResponse(null);
                  }}
                  severity={alertType}
                >
                  {uploadResponse}
                </Alert>
              </Snackbar>
            </Stack>
          </StyledContent>
        </Container>
      </>
    </>
  );
}
