// Sidebar.tsx
"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { Home as HomeIcon, Person as PersonIcon, Logout as LogoutIcon } from "@mui/icons-material";

interface SidebarProps {
  drawerOpen: boolean;
  onDrawerToggle: () => void;
  onSignOut: () => void;
  currentPath: string;
  isMobile: boolean; // New prop to determine if the view is mobile
}

const Sidebar: React.FC<SidebarProps> = ({ drawerOpen, onDrawerToggle, onSignOut, currentPath, isMobile }) => {
  const isPageActive = (path: string) => currentPath === path;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"} // Use temporary for mobile, permanent for desktop
      open={isMobile ? drawerOpen : true} // Open based on the drawer state for mobile
      onClose={isMobile ? onDrawerToggle : undefined} // Only toggle for mobile
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
            backgroundColor: isPageActive("/home") ? "#f0f0f0" : "transparent",
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
            backgroundColor: isPageActive("/profile") ? "#f0f0f0" : "transparent",
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem sx={{ "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" } }} onClick={onSignOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
