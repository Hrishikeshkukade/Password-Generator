import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Container,
  CircularProgress,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  newName: Yup.string().required("New Name is required"),
  newEmail: Yup.string().email("Invalid email").required("New Email is required"),
});

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // Fetch the user's current display name
          await user.reload();
          setNewName(user.displayName || "");

          // Fetch the user's current email
          setNewEmail(user.email || "");
        } else {
          console.error("No user is currently signed in.");
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
        toast.error("Error fetching user information:" + error.message);
      } finally {
        // Set loading to false once the details are fetched (or failed to fetch)
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const setInitialValues = (initialValues) => {
    setNewName(initialValues.newName);
    setNewEmail(initialValues.newEmail);
  };

  const handleUpdateProfile = async (values) => {
    const user = auth.currentUser;

    try {
      setLoading(true);

      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);

        // Update the user's document with the new name and email
        await updateDoc(userDocRef, {
          displayName: values.newName,
          email: values.newEmail,
        });

        // Redirect to the manage passwords page
        // navigate("/managepasswords");
      } else {
        console.error("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error updating profile details:", error.message);
      toast.error("Error updating profile details:" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box mt={10}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Update Profile
            </Typography>
            <Formik
              initialValues={{ newName: "", newEmail: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleUpdateProfile(values)}
            >
              <Form>
                <Field
                  type="text"
                  id="newName"
                  name="newName"
                  label="New Name"
                  as={TextField}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />
                <ErrorMessage name="newName" component="div" />

                <Field
                  type="text"
                  id="newEmail"
                  name="newEmail"
                  label="New Email"
                  as={TextField}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />
                <ErrorMessage name="newEmail" component="div" />

                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                  >
                    Update
                  </Button>
                </Box>
              </Form>
            </Formik>
          </Paper>
        )}
      </Box>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default UpdateProfile;



