import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Main = () => {
  const [userData, setUserData] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const userId = jwt_decode(localStorage.getItem("token"))._id;
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //http request to update the email
    axios
      .put(`http://localhost:8080/api/users/${userId}`, { email: newEmail })
      .then((response) => {
        console.log("Email updated successfully!");
        setUpdateSuccess(true);
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating email:", error);
      });
  };

  const handleDeleteUser = () => {
    // HTTP request to delete the user
    axios
      .delete(`http://localhost:8080/api/users/${userId}`)
      .then(() => {
        // If deletion is successful, clear the token and reload the page
        localStorage.removeItem("token");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const defaultTheme = createTheme();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Home
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
  <Grid item xs={12}>
    <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center', textDecoration: 'underline' }}>Profile</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h6">First Name:</Typography>
  </Grid>
  <Grid item xs={6}>
    <Typography variant="body1">{userData ? userData.firstName : ''}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h6">Last Name:</Typography>
  </Grid>
  <Grid item xs={6}>
    <Typography variant="body1">{userData ? userData.lastName : ''}</Typography>
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h6">Email:</Typography>
  </Grid>
  <Grid item xs={6}>
    <Typography variant="body1">{userData ? userData.email : ''}</Typography>
  </Grid>
</Grid>
            {updateSuccess && (
              <Typography variant="success">
                Email updated successfully!
              </Typography>
            )}
            <Typography component="h1" variant="h5" sx={{textDecoration: 'underline', margin: '16px 0px'}}>
              Change Email
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
            </Box>
            <Button
  variant="outlined"
  color="secondary"
  onClick={handleDeleteUser}
  sx={{ mt: 2 }}
>
  Delete User
</Button>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Main;
