import * as Yup from "yup";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { darken } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleSignin from "../GoogleSignin/GoogleSignin";

const defaultTheme = createTheme();

export default function SignIn() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      showPassword: false,
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (!values.email) {
        formik.setFieldError("email", "Please fill in this field");
      }

      if (!values.password) {
        formik.setFieldError("password", "Please fill in this field");
      }

      if (!values.email || !values.password) {
        console.log("Please fill in all fields");
        return;
      }
      if (values.password.length < 6) {
        console.log("Password must be at least 6 characters long");

        formik.setFieldError(
          "password",
          "Password must be at least 6 characters long"
        );
        return;
      }
      try {
        setIsLoading(true);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;

        console.log("User signed in successfully:", user);

        navigate("/passwordgenerator");
      } catch (error) {
        console.error("Error");
        if (error.code === "auth/user-not-found") {
          toast.error("User is not registered");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network Problem");
        } else if (error.code === "auth/invalid-login-credentials") {
          toast.error("Incorrect Email or Password");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Wrong password");
        } else {
          toast.error("Error signing in");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    // Toggle the value of showPassword
    formik.setFieldValue("showPassword", !formik.values.showPassword);
  };



 

  return (
    <ThemeProvider theme={darkMode}>
      <Container component="main" maxWidth="xs" sx={{ marginTop: "10%" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              color="secondary"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={formik.values.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              color="secondary"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="secondary"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {formik.values.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: darken(defaultTheme.palette.secondary.main, 0.2),
                },
              }}
            >
              {isLoading ? (
                <CircularProgress color="secondary" size={25} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  to="/fp"
                  component={NavLink}
                  variant="body2"
                  underline="none"
                  color="secondary"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  component={NavLink}
                  to="/signup"
                  variant="body2"
                  underline="none"
                  color="secondary"
                  sx={{
                    "@media (max-width: 320px)": {
                      marginLeft: "40px",
                    },
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
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
          theme={darkMode ? "dark" : "light"}
        />
      </Container>
      <p>OR</p>
     <GoogleSignin />
    </ThemeProvider>
  );
}
