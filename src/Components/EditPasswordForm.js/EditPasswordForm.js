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
  IconButton,
  InputAdornment,
  LinearProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import zxcvbn from "zxcvbn";
import { enc, AES } from "crypto-js/core";
import { ToastContainer, toast } from "react-toastify";

const EditPasswordForm = () => {
  const { passwordId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    username: "",
    password: "",
    showPassword: false,
    // Add other fields as needed
  });
  const [isLoading, setIsLoading] = useState(false);
  const [requiredFieldsError, setRequiredFieldsError] = useState(false);
  const navigate = useNavigate();
  const passwordStrength = zxcvbn(formData.password);

  useEffect(() => {
    const fetchPasswordDetails = async () => {
      try {
        const passwordDocRef = doc(db, "entries", passwordId);
        const passwordDocSnapshot = await getDoc(passwordDocRef);

        if (passwordDocSnapshot.exists()) {
          const details = passwordDocSnapshot.data();
          const decryptedPassword = AES.decrypt( details.password,'your-secret-key').toString(enc.Utf8);
          setFormData({...details,password: decryptedPassword});
        } else {
          toast.error("Password details not found");
        }
      } catch (error) {
        toast.error("Error fetching password details:");
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
    if (!formData.title ||!formData.category || !formData.username || !formData.password) {
      setRequiredFieldsError(true);
      return;
    }
    try {
      setIsLoading(true);
      const encryptedPassword = AES.encrypt(formData.password, 'your-secret-key').toString();
      const updatedFormData = {
        ...formData,
        password: encryptedPassword,
      };
      const passwordDocRef = doc(db, "entries", passwordId);
      
      await updateDoc(passwordDocRef, updatedFormData);
      // Redirect to the manage passwords page
      navigate("/managepasswords");
    } catch (error) {
      toast.error("Error updating password details:");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
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
             
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  error={requiredFieldsError && !formData.title}
              helperText={
                requiredFieldsError && !formData.title && "Title is required"
              }
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
                  error={requiredFieldsError && !formData.category}
                  helperText={
                    requiredFieldsError &&
                    !formData.category &&
                    "Category is required"
                  }
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
                  error={requiredFieldsError && !formData.username}
                  helperText={
                    requiredFieldsError &&
                    !formData.username &&
                    "Username is required"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={formData.showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={requiredFieldsError && !formData.password}
                  helperText={
                    requiredFieldsError &&
                    !formData.password &&
                    "Password is required"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="secondary"
                          onClick={handleTogglePasswordVisibility}
                        >
                          {formData.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  
                />
                <LinearProgress
              variant="determinate"
              value={(passwordStrength.score / 4) * 100}
              sx={{ height: 5, marginTop: 2 }}
              color={
                passwordStrength.score === 4 ? "success" : "error"
              }
            />
            <Typography variant="caption" color="textSecondary" mt={1}>
              {passwordStrength.feedback.suggestions}
            </Typography>
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

export default EditPasswordForm;
