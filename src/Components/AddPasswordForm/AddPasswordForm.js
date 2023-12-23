import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import zxcvbn from "zxcvbn";
import {  AES } from 'crypto-js';



const AddEntryForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    username: "",
    password: "",
    comments: "",
    showPassword: false,
  });

  const [requiredFieldsError, setRequiredFieldsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleTogglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const passwordStrength = zxcvbn(formData.password);

  const handleSave = async () => {
    // Check if required fields are filled
    if (!formData.title || !formData.username || !formData.password) {
      setRequiredFieldsError(true);
      return;
    }
    try {
      // Get the currently signed-in user
      setIsLoading(true);
      const user = auth.currentUser;

      // Check if the user is signed in
      if (user) {
        const encryptedPassword = AES.encrypt(formData.password, 'your-secret-key').toString();
    
        // Save data to Firestore
        const userRef = collection(db, "entries");
        const userInfo = {
          userId: user.uid,
          title: formData.title,
          category: formData.category,
          username: formData.username,
          password: encryptedPassword,
          comments: formData.comments,
        };

        await addDoc(userRef, userInfo);

        // Redirect user after saving
        navigate("/managepasswords");
      }
    } catch (error) {
      console.error("Error saving data to Firestore:", error.message);
    } finally {
      setIsLoading(false);
    }
    // Implement save logic here
    console.log("Form Data:", formData);
    // Redirect user after saving
    navigate("/managepasswords");
  };

  return (
    <Container>
      <Grid marginTop="10%" container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Add Entry
            </Typography>
            <TextField
              required
              color="secondary"
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleInputChange("title")}
              error={requiredFieldsError && !formData.title}
              helperText={
                requiredFieldsError && !formData.title && "Title is required"
              }
            />
            <TextField
              color="secondary"
              label="Category"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.category}
              onChange={handleInputChange("category")}
            />
            <TextField
              required
              color="secondary"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleInputChange("username")}
              error={requiredFieldsError && !formData.username}
              helperText={
                requiredFieldsError &&
                !formData.username &&
                "Username is required"
              }
            />
            <TextField
              required
              color="secondary"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
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
              color={passwordStrength.score === 4 ? "success" : "error"}
            />
            <Typography variant="caption" color="textSecondary" mt={1}>
              {passwordStrength.feedback.suggestions.join(" ")}
            </Typography>
            <TextField
              color="secondary"
              label="Comments"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.comments}
              onChange={handleInputChange("comments")}
            />
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Button
                disabled={isLoading}
                variant="contained"
                color="secondary"
                onClick={handleSave}
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

export default AddEntryForm;
