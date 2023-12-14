// PasswordDetails.js
import React, { useState, useEffect } from 'react';
import { Typography, Paper, Container, Box, CircularProgress, Fab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

import { Edit } from '@mui/icons-material';


const PasswordDetails = () => {
  const { passwordId } = useParams();
  const [passwordDetails, setPasswordDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswordDetails = async () => {
      try {
        // Reference to the specific password entry document
        const passwordDocRef = doc(db, 'entries', passwordId);
        
        // Get the document snapshot
        const passwordDocSnapshot = await getDoc(passwordDocRef);

        // Check if the document exists
        if (passwordDocSnapshot.exists()) {
          // Extract details from the document data
          const details = passwordDocSnapshot.data();
          setPasswordDetails(details);
        } else {
          // Handle the case where the document does not exist
          console.error('Password details not found');
        }
      } catch (error) {
        console.error('Error fetching password details:', error.message);
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

  return (
    <Container>
      <Paper  elevation={3} sx={{ padding: 3, marginTop: "10%" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress color='secondary'/>
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {passwordDetails?.title || 'Title Not Found'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Category: {passwordDetails?.category || 'Category Not Found'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Username: {passwordDetails?.username || 'Username Not Found'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Password: {passwordDetails?.password || 'Password Not Found'}
            </Typography>
            {/* Add other details as needed */}
          </>
        )}
          <Fab
          color='secondary' 
          size="small"
          style={{ position: 'fixed', bottom: 16, right: 16}}
          onClick={handleEditClick}
        >
          <Edit />
        </Fab>
      </Paper>
    </Container>
  );
};

export default PasswordDetails;

