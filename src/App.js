import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import SignIn from "./Components/Signin/Signin";
import Signup from "./Components/Signup/Signup";
import PasswordGenerator from "./Components/PasswordGenerator/PasswordGenerator";
import useAuth from "./api/useAuth";
import Profile from "./Components/Profile/Profile";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import ManagePasswords from "./Components/ManagePasswords/ManagePasswords";
import AddPasswordForm from "./Components/AddPasswordForm/AddPasswordForm";
import PasswordDetails from "./Components/PasswordDetails/PasswordDetails";
import EditPasswordForm from "./Components/EditPasswordForm.js/EditPasswordForm";

function App() {
  const user = useAuth();
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    // Check the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      }
    });

    return () => {
      unsubscribe(); // Clean up the listener
    };
  }, []);
  const ProtectedRoute = ({ element }) => {
    if (authenticatedUser) {
      return element;
    } else {
      // Redirect to the sign-in page or any other route as needed
      return <Navigate to="/" />;
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/fp" element={<ForgotPassword />} />
        {user && (
          <Route path="/passwordgenerator" element={<PasswordGenerator />} />
        )}
        {user && (
          <Route
            path="/managepasswords"
            element={<ProtectedRoute element={<ManagePasswords />} />}
          />
        )}
        {user && (
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
        )}
        {user && (
          <Route
            path="/addpasswordform"
            element={<ProtectedRoute element={<AddPasswordForm />} />}
          />
        )}
        {user && (
          <Route
            path="/passworddetails/:passwordId"
            element={<ProtectedRoute element={<PasswordDetails />} />}
          />
        )}
        {user && (
          <Route
            path="/editpasswordform/:passwordId"
            element={<ProtectedRoute element={<EditPasswordForm />} />}
          />
        )}
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
