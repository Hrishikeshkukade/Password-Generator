import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditPasswordForm = () => {
  const { passwordId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    username: "",
    password: "",
    // Add other fields as needed
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswordDetails = async () => {
      try {
        const passwordDocRef = doc(db, "entries", passwordId);
        const passwordDocSnapshot = await getDoc(passwordDocRef);

        if (passwordDocSnapshot.exists()) {
          const details = passwordDocSnapshot.data();
          setFormData(details);
        } else {
          console.error("Password details not found");
        }
      } catch (error) {
        console.error("Error fetching password details:", error.message);
      }
    };

    fetchPasswordDetails();
  }, [passwordId]);

  const handleInputChange = (field) => (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const passwordDocRef = doc(db, "entries", passwordId);
      await updateDoc(passwordDocRef, formData);
      // Redirect to the manage passwords page
      navigate("/managepasswords");
    } catch (error) {
      console.error("Error updating password details:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Grid marginTop="10%" container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, marginTop: "10%" }}>
            <Typography variant="h4" gutterBottom>
              Update Information
            </Typography>
            <Grid container spacing={2}>
              {/* Add other input fields as needed */}
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Category"
                  variant="outlined"
                  value={formData.category}
                  onChange={handleInputChange("category")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                />
              </Grid>
              {/* Add other input fields as needed */}
            </Grid>
            <Box mt={4}>
              <Button
                disabled={isLoading}
                variant="contained"
                color="secondary"
                onClick={handleUpdate}
              >
                {isLoading ? (
                  <CircularProgress color="secondary" size={25} />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditPasswordForm;
