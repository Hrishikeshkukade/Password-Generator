import * as Yup from "yup";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { darken } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { CircularProgress, Grid, Link } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";


const defaultTheme = createTheme();

export default function Signup() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useSelector(state => state.theme.darkMode);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      showPassword: false,
    },
    validationSchema: validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (!values.name) {
        formik.setFieldError("name", "Please fill in this field");
      }

      if (!values.email) {
        formik.setFieldError("email", "Please fill in this field");
      }

      if (!values.password) {
        formik.setFieldError("password", "Please fill in this field");
      }

      if (!values.email || !values.password || !values.name) {
        console.log("Please fill in all fields");
        return;
      }
      if (values.password.length < 6) {
        console.log("Password must be at least 6 characters long");
        // Optionally, you can set an error state or display an error message
        formik.setFieldError(
          "password",
          "Password must be at least 6 characters long"
        );
        return;
      }

      try {
        setIsLoading(true);
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,

          values.email,
          values.password
        );
        const user = userCredential.user;
        updateProfile(user, {
          displayName: values.name,
        })
          .then(() => {
            // Profile Updated
          })
          .catch((error) => {
            // An error occurred
          });
        navigate("/passwordgenerator");
        // Store additional user data in Firestore

        const userRef = collection(db, "users");
        const newUser = {
          name: values.name,
          email: values.email,
          password: values.password,
          userId: user.uid,
        };

        await addDoc(userRef, newUser);
        toast.success("User signed up successfully!");
      } catch (error) {
        console.error("Error signing up:", error.message);

        if (error.code === "auth/email-already-in-use") {
          toast.error("User with this email already exists.");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network Problem");
        }
         else {
          toast.error("Error signing up. Please try again.");
        }
      } finally {
        setIsLoading(false);
        resetForm();
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    // Toggle the value of showPassword
    formik.setFieldValue('showPassword', !formik.values.showPassword);
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
            Sign up
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
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              color="secondary"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
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
              type={formik.values.showPassword ? 'text' : 'password'}
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
              fullWidth
              disabled={isLoading}
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
                "Sign Up"
              )}
            </Button>
            <Grid item>
              <Link
                component={NavLink}
                to="/"
                variant="body2"
                underline="none"
                color="secondary"
                sx={{
                  "@media (max-width: 280px)": {
                    marginLeft: "20px", // Adjust the font size as needed
                  },
                }}
              >
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
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
    </ThemeProvider>
  );
}
