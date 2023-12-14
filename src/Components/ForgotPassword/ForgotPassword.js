import * as Yup from "yup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { darken } from "@mui/material/styles";
import { auth } from "../../firebase";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setLoading(true);
        await sendPasswordResetEmail(auth, values.email);
        toast.success("Password reset email sent successfully");
        // You might want to show a success message or redirect the user to a confirmation page
      } catch (error) {
        toast.error("Error sending password reset email:");
        formik.setFieldError("email", error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
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
            Forgot Password
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: darken(defaultTheme.palette.secondary.main, 0.2),
                },
              }}
            >
              {loading ? (
                <CircularProgress size={25} color="secondary" />
              ) : (
                "Send Email"
              )}
            </Button>
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
        theme="light"
      />
      </Container>
    </ThemeProvider>
  );
}
