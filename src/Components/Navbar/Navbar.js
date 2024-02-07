import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { toggleTheme } from "../../store/themeSlice";


const drawerWidth = 240;

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    // Open the logout confirmation dialog
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    // Close the logout confirmation dialog
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
      // Close the logout confirmation dialog after successful logout
      setOpenLogoutDialog(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("authUser"));

  //   if (storedUser) {
  //     setUser(storedUser);
  //   }

  //   const unsubscribe = onAuthStateChanged(auth, (authUser) => {
  //     setUser(authUser);

  //     // Save user to local storage
  //     localStorage.setItem("authUser", JSON.stringify(authUser));
  //   });

  //   return () => {
  //     localStorage.removeItem("authUser");
  //     unsubscribe();
  //   };
  // }, [auth]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isLoggedIn = auth.currentUser !== null;
  const darkMode = useSelector(state => state.theme.darkMode);
  const dispatch = useDispatch();

  const themeToggleIcon = darkMode ? <Brightness7Icon /> : <Brightness4Icon />;

  if (loading) {
    return null;
  }

  const navItems = isLoggedIn
    ? [
        { label: "Generate Password", path: "/passwordgenerator" },
        { label: "Manage Passwords", path: "/managepasswords" },
        { label: "Profile", path: "/profile" },
      ]
    : [
        { label: "Signin", path: "/" },
        { label: "Signup", path: "/signup" },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Password Generator
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={item.onClick}
              sx={{
                textAlign: "center",
                "&:hover": {
                  bgcolor: "secondary.main",
                },
                textDecoration: "none",

                bgcolor:
                  location.pathname === item.path
                    ? "secondary.main"
                    : "inherit",
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isLoggedIn && (
          <Button
            component={NavLink}
            onClick={handleLogout}
            color="inherit"
            sx={{
              bgcolor: "red",
              "&:hover": {
                bgcolor: "#b23b3b",
              },
              width: "100%",
              height: "7vh",
              borderRadius: "0px",
            }}
            startIcon={<LogoutOutlinedIcon />}
          >
            Logout
          </Button>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar  sx={{ bgcolor: darkMode ? '#222' : 'secondary.main' }} component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}
          >
            Password Generator
          </Typography>
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {themeToggleIcon}
          </IconButton>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.path}
                onClick={item.onClick}
                color="inherit"
                sx={{
                  bgcolor:
                    location.pathname === item.path ? "#BF40BF" : "inherit",
                  margin: "10px",
                }}
              >
                {item.label}
              </Button>
            ))}
            {isLoggedIn && (
              <Button
                component={NavLink}
                onClick={handleLogout}
                color="inherit"
                sx={{
                  bgcolor: "red",
                  "&:hover": {
                    bgcolor: "#b23b3b",
                  },
                }}
                startIcon={<LogoutOutlinedIcon />}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
  authenticatedUser: PropTypes.object,
};

export default DrawerAppBar;
