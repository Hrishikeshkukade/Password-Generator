import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // Update the state with user information
          setUserInfo({
            name: user.displayName,
            email: user.email,
          });
        } else {
          toast.error("No user is currently signed in.");
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
        toast.error("Error fetching user information:");
      } finally {
        // Set loading to false once the details are fetched (or failed to fetch)
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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
              Hello, {userInfo?.name || "Guest"}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Email: {userInfo?.email || "No email available"}
            </Typography>
          
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

export default Profile;
