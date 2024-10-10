

"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useMediaQuery,
  CircularProgress,
  Box,
} from "@mui/material";
import { Menu as MenuIcon, Home as HomeIcon, Person as PersonIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut from NextAuth
import LoginIcon from '@mui/icons-material/Login';
import SignupIcon from '@mui/icons-material/PersonAdd';
interface UserProfile {
  email: string;
  name: string | null;
}

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession(); // Use useSession to get session data

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Fetch profile data from the backend API if user is authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        try {
          const response = await fetch("/api/profile");
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          const data = await response.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If no session, just stop loading
      }
    };

    fetchProfile();
  }, [session]);

  const isPageActive = (path: string) => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Sign out function with redirect to the login page
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login", // Redirect to the login page after signing out
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar - Adjusted for desktop to leave space for the sidebar */}
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? "100%" : `calc(100% - 240px)`,
          marginLeft: isMobile ? 0 : "240px",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Todo List
          </Typography>

          
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for mobile and desktop */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen || !isMobile}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <List>
          <ListItem
            component={Link}
            href="/home"
            sx={{
              marginTop: "60px",
              backgroundColor: isPageActive("/home") ? "#f0f0f0" : "transparent","&:hover": { 
                backgroundColor: "#e0e0e0", 
                cursor: "pointer", 
              } 
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            component={Link}
            href="/profile"
            sx={{
              backgroundColor: isPageActive("/profile") ? "#f0f0f0" : "transparent","&:hover": { 
                backgroundColor: "#e0e0e0", 
                cursor: "pointer", 
              } 
            }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          

          {/* Sign Out button in the drawer, if the user is signed in */}
          {session ? (
            <ListItem sx={{ 
              "&:hover": { 
                backgroundColor: "#e0e0e0", 
                cursor: "pointer", 
              } 
            }} onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          ) : (
        <>
          <ListItem
            component={Link}
            href="/register"
            sx={{
              backgroundColor: isPageActive("/profile") ? "#f0f0f0" : "transparent","&:hover": { 
                backgroundColor: "#e0e0e0", 
                cursor: "pointer", 
              } 
            }}
          >
            <ListItemIcon>
            <SignupIcon />
            </ListItemIcon>
            <ListItemText primary="SignUp" />
          </ListItem>
          <ListItem
            component={Link}
            href="/login"
            sx={{
              backgroundColor: isPageActive("/profile") ? "#f0f0f0" : "transparent","&:hover": { 
                backgroundColor: "#e0e0e0", 
                cursor: "pointer", 
              } 
            }}
          >
            <ListItemIcon>
            <LoginIcon />            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </>
      )}
        </List>
      </Drawer>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: "20px",
          backgroundColor: "#efefef",
          minHeight: "100vh",
          marginTop: isMobile ? "64px" : "64px",
        }}
      >
        <Typography variant="h3" textAlign="center">
          Profile Page!
        </Typography>

        {/* Loading spinner */}
        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center" mt={4}>
            {error}
          </Typography>
        ) : (
          <Box textAlign="center" mt={4}>
            <Typography variant="h5">Email: {profile?.email}</Typography>
            <Typography variant="h6">Username: {profile?.name || "No name provided"}</Typography>
          </Box>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
