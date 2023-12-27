import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  Fab,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, where, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer } from "react-toastify";

const ManagePasswords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTitleAndCategory = async () => {
      try {
        if (user) {
          // Query the Firestore collection for entries
          const entriesQuery = query(
            collection(db, "entries"),
            where("userId", "==", user.uid)
          );

          // Get the documents that match the query
          const querySnapshot = await getDocs(entriesQuery);

          // Extract title and category data from the documents
          const titleAndCategoryData = [];
          querySnapshot.forEach((doc) => {
            titleAndCategoryData.push({
              id: doc.id,
              title: doc.data().title,
              category: doc.data().category,
            });
          });

          // Update the state with the title and category data
          setInfo(titleAndCategoryData);
        }
      } catch (error) {
        toast.error("Error fetching data:");
      } finally {
        // Set loading to false once the details are fetched (or failed to fetch)
        setLoading(false);
      }
    };
    fetchTitleAndCategory();
  }, [user]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;

    // If "Without Category" is selected, set the selected category to an empty string
    const newSelectedCategory =
      selectedValue === "without category" ? "all" : selectedValue;
    setSelectedCategory(newSelectedCategory);
    console.log("clicked");
  };

  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
  };

  const handleAddEntry = () => {
    // Implement logic to navigate to the Add Entry page
    navigate("/addpasswordform");
    console.log("Add Entry clicked");
  };

  const handlePasswordDetails = (passwordId) => {
    navigate(`/passworddetails/${passwordId}`);
  };

  const handleDelete = (passwordId) => {
    const passwordToDelete = info.find((info) => info.id === passwordId);
    setSelectedPassword(passwordToDelete);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingId(selectedPassword.id);
      await deleteDoc(doc(db, "entries", selectedPassword.id));
      setInfo((prevInfo) =>
        prevInfo.filter((info) => info.id !== selectedPassword.id)
      );
    } catch (error) {
      console.error("Error deleting password:", error.message);
    } finally {
      setDeletingId(null);
      setSelectedPassword(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedPassword(null);
    setOpenDeleteDialog(false);
  };

  const filteredInfo = info.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedCategory === "all") {
      return matchesSearch;
    }

    if (selectedCategory === "without category") {
      return matchesSearch && !item.category;
    }

    return matchesSearch && item.category === selectedCategory;
  });

  const sortedInfo = [...filteredInfo].sort((a, b) => {
    const aValue = sortBy === "title" ? a.title : a.category;
    const bValue = sortBy === "title" ? b.title : b.category;

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  return (
    <Container>
      <Grid container spacing={3} marginTop={10} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Manage Passwords
            </Typography>
            <TextField
              color="secondary"
              label="Search"
              autoComplete="false"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <TextField
              color="secondary"
              select
              label="Sort By"
              variant="outlined"
              margin="normal"
              value={sortBy}
              onChange={handleSortChange}
              sx={{ width: "50%" }}
            >
              {/* <option value="title">Title</option>
              <option value="category">Category</option> */}
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </TextField>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : sortedInfo.length === 0 ? (
              <Typography variant="subtitle1" color="textSecondary">
                No password added.
              </Typography>
            ) : (
              sortedInfo.map((info) => (
                <Paper
                  key={info.id}
                  elevation={3}
                  sx={{ padding: 3, marginTop: 2, cursor: "pointer" }}
                  onClick={() => handlePasswordDetails(info.id)}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography variant="h6">{info.title}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {info.category}
                      </Typography>
                    </div>
                    <IconButton
                      edge="end"
                      color="secondary"
                      onClick={(e) => {
                        // Avoid triggering Paper's click event
                        e.stopPropagation();
                        handleDelete(info.id);
                      }}
                    >
                      {deletingId === info.id ? (
                        <CircularProgress size={24} color="secondary" />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </Paper>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab color="secondary" onClick={handleAddEntry}>
          <AddIcon />
        </Fab>
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the password entry for{" "}
            {selectedPassword && selectedPassword.title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
export default ManagePasswords;
