import React from "react";
import { auth, provider } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";


const GoogleSignin = () => {

  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log("User signed in with Google:", user);

      navigate("/passwordgenerator");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Error signing in with Google");
    }
  };



  return (
    <>
    <Button
      onClick={handleGoogleSignIn}
      color="primary"
      variant="contained"
      sx={{
        mt: 1,
        mb: 2,
        bgcolor: theme.palette.mode === "dark" ? "#131314" : "#FFFFFF",
        color: theme.palette.mode === "dark" ? "#E3E3E3" : "#1F1F1F",
        border: `1px solid ${
          theme.palette.mode === "dark" ? "#8E918F" : "#747775"
        }`,
        "&:hover": {
          bgcolor: theme.palette.mode === "dark" ? "#272728" : "#f1f1f1",
          borderColor: theme.palette.mode === "dark" ? "#8E918F" : "#747775",
        },
      }}
    >
      <Google sx={{marginRight: "10px"}}/>
      Sign In with Google
    </Button>
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
    theme={darkMode ? "dark" : "light"}
  />
  </>
  );
};

export default GoogleSignin;
