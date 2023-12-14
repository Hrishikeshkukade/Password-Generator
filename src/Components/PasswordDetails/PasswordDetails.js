import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Container,
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {  doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { Edit, FileCopy as FileCopyIcon } from "@mui/icons-material";

const PasswordDetails = () => {
  const { passwordId } = useParams();
  const [passwordDetails, setPasswordDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [copyField, setCopyField] = useState(""); // To track which field to copy
  const navigate = useNavigate();
  const mobileDevice = useMediaQuery("(max-width: 820px)");



  useEffect(() => {
    const fetchPasswordDetails = async () => {
      try {
        // Reference to the specific password entry document
        const passwordDocRef = doc(db, "entries", passwordId);

        // Get the document snapshot
        const passwordDocSnapshot = await getDoc(passwordDocRef);

        // Check if the document exists
        if (passwordDocSnapshot.exists()) {
          // Extract details from the document data
          const details = passwordDocSnapshot.data();
          setPasswordDetails(details);
        } else {
          // Handle the case where the document does not exist
          console.error("Password details not found");
        }
      } catch (error) {
        console.error("Error fetching password details:", error.message);
      } finally {
        // Set loading to false once the details are fetched (or failed to fetch)
        setLoading(false);
      }
    };

    // Fetch password details when the component mounts
    fetchPasswordDetails();
  }, [passwordId]);

  const handleEditClick = () => {
    // Redirect to the edit page with the passwordId
    navigate(`/editpasswordform/${passwordId}`);
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Paper  elevation={3} sx={{ padding: 3, marginTop: mobileDevice ? "20%" :  "12%" }}>
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
          <>
            <Typography variant="h4" gutterBottom>
              {passwordDetails?.title || "Title Not Found"}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Category: {passwordDetails?.category || "Category Not Found"}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Username: {passwordDetails?.username || "Username Not Found"}{" "}
              <IconButton
                color="secondary"
                size="small"
                onClick={() => {
                  handleCopy(passwordDetails?.username || "");
                  setCopyField("username");
                }}
              >
                <FileCopyIcon />
              </IconButton>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Password: {passwordDetails?.password || "Password Not Found"}{" "}
              <IconButton
                color="secondary"
                size="small"
                onClick={() => {
                  handleCopy(passwordDetails?.password || "");
                  setCopyField("password");
                }}
              >
                <FileCopyIcon />
              </IconButton>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Comments: {passwordDetails?.comments || "Comments Not Found"}
            </Typography>
            {/* Add other details as needed */}
          </>
        )}
        <Fab
          color="secondary"
          size="small"
          style={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleEditClick}
        >
          <Edit />
        </Fab>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`Copied ${copyField.charAt(0).toUpperCase() + copyField.slice(1)}`}
      />
    </Container>
  );
};

export default PasswordDetails;

