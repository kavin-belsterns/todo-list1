

"use client"
import { useState, useEffect } from "react";
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
  Button,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import axios from 'axios';
import { Menu as MenuIcon, Home as HomeIcon, Person as PersonIcon, Logout as LogoutIcon, AdminPanelSettings as AdminIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Grid2 as Grid } from "@mui/material";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import the signOut function from NextAuth

const TodoPage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const { data: session, status } = useSession(); // Use useSession to get session data

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isPageActive = (path: string) => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login", // Redirect to the login page after signing out
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen || !isMobile} // Automatically open for desktop
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <List>
          {/* Home Link */}
          <ListItem
            component={Link}
            href="/home"
            sx={{
              marginTop: "60px",
              backgroundColor: isPageActive("/home") ? "#f0f0f0" : "transparent",
              "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" },
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Profile Link */}
          <ListItem
            component={Link}
            href="/profile"
            sx={{
              backgroundColor: isPageActive("/profile") ? "#f0f0f0" : "transparent",
              "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" },
            }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          

       
            <ListItem
              sx={{ "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" } }}
              onClick={handleSignOut}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>

        </List>
      </Drawer>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "20px", backgroundColor: "#efefef", minHeight: "100vh" }}>
       <Typography sx={{textAlign:"center"}}>Admin Page</Typography>
        <Grid container justifyContent="center">
        </Grid>
      </main>
    </div>
  );
};

export default TodoPage;
