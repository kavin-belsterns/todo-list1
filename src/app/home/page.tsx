"use client";

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
import axios from 'axios'
import { Menu as MenuIcon, Home as HomeIcon, Person as PersonIcon,Logout as LogoutIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Grid2 as Grid } from "@mui/material";
import Link from "next/link";
import TodoForm from "../Component/TodoForm";
import DeleteConfirmationDialog from "../Component/DeleteConfirmation";
import TodoCard from "../Component/Todocard";
import { signOut } from "next-auth/react"; // Import the signOut function from NextAuth

interface TodoItem {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
}

interface TodoState {
  title: string;
  description: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoData, setTodoData] = useState<TodoState>({ title: "", description: "" });
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<TodoItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  
    useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  

  //For get all the datum in first
  
  useEffect(() => {
    axios.get('/api/todos').then((response) => {
      console.log(response.data); 
      setTodos(response.data.todos);
    }).catch(error => {
      console.error("Error fetching todos:", error);
    });
  },[]);
  


  const isPageActive = (path: string) => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpen = (todo?: TodoItem) => {
    if (todo) {
      setIsEditing(true);
      setCurrentTodo(todo);
      setTodoData({ title: todo.title, description: todo.description });
    } else {
      setIsEditing(false);
      setTodoData({ title: "", description: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTodoData({ title: "", description: "" });
    setCurrentTodo(null);
  };

  const handleSubmit = () => {
    const newTodoData: TodoState = {
      title: todoData.title,
      description: todoData.description,
    };

//for editing the data

    if (isEditing && currentTodo) {
      axios.patch(`/api/todos`, { 
        id: currentTodo.id, 
        title: newTodoData.title, 
        description: newTodoData.description,
        isDone: currentTodo.isDone 
    })
    .then(response => {
      console.log(response.data); 
      fetchTodos(); 
    })
    .catch(error => {
      console.error("Error updating todo:", error);
    });
    } 
    
    //for adding the data
    else {
      const newTodoData:TodoState = {
        title: todoData.title,
        description: todoData.description,
       
      };
      axios.post('/api/todos', newTodoData)
      .then(response => {
        setTodos([...todos, response.data]);
      })
      .then(() => {
        fetchTodos();})
      .catch(error => {
        console.error("Error adding todo:", error);
      });
    
    }
    handleClose();
  };

  //after added or edited the data the data will be refresh
  const fetchTodos = () => {
    axios.get('/api/todos')
      .then((response) => {
        setTodos(response.data.todos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);



  // update status of the item 
  const handleMarkAsDone = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);
    
    if (todoToUpdate) {
      const updatedStatus = !todoToUpdate.isDone;
  
      axios.patch(`/api/todos`, {
        id: todoId,
        isDone: updatedStatus,
        title: todoToUpdate.title,       
        description: todoToUpdate.description 
      })
      .then(response => {
        console.log(response.data); 
        const updatedTodos = todos.map((todo) =>
          todo.id === todoId ? { ...todo, isDone: updatedStatus } : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error("Error updating todo:", error);
      });
    }
  };

  const handleDeleteDialogOpen = (todo: TodoItem) => {
    setCurrentTodo(todo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentTodo(null);
  };

  const handleDelete = () => {
    if (currentTodo) {

      axios.delete(`/api/todos`, { data: { id: currentTodo.id } })
        .then(response => {
          console.log(response.data); 
          
          setTodos(todos.filter((todo) => todo.id !== currentTodo.id));
        })
        .then(() => {
          fetchTodos();})
        .catch(error => {
          console.error("Error deleting todo:", error);
        });
    }
    handleDeleteDialogClose(); 
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login", // Redirect to the login page after signing out
    });
  };

  const handleTodoAction = (action: string, todo: TodoItem) => {
    switch (action) {
      case "edit":
        handleOpen(todo);
        break;
      case "delete":
        handleDeleteDialogOpen(todo);
        break;
      case "toggleDone":
        handleMarkAsDone(todo.id);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />

    {/* App Bar - Visible only on desktop and adjusted for the sidebar width */}
{!isMobile && (
  <AppBar
    position="absolute"
    color="primary"
    sx={{
      width: `calc(100% - 240px)`, // Adjust width excluding the sidebar
      marginLeft: "240px", // Move the AppBar to the right of the sidebar
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Toolbar>
      <Typography variant="h6" noWrap>
        Todo List
      </Typography>
    </Toolbar>
  </AppBar>
)}

      {/* App Bar - Only visible on mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Todo List
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer for mobile and desktop */}
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
          <ListItem  sx={{ 
    "&:hover": { 
      backgroundColor: "#e0e0e0", 
      cursor: "pointer", 
    } 
  }}  onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon />
                </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
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
        <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
          <Button onClick={() => handleOpen()} variant="contained" color="primary">
            Add Todo
          </Button>
        </Grid>

        <Grid container spacing={3} justifyContent="center" sx={{ marginTop: "20px" }}>
  {Array.isArray(todos) && todos.map((todo) => (
    <TodoCard key={todo.id} todo={todo} onAction={(action) => handleTodoAction(action, todo)} />
  ))}
</Grid>


        {/* TodoForm Component */}
        <TodoForm
          open={open}
          title={todoData.title}
          description={todoData.description}
          isEditing={isEditing}
          handleClose={handleClose}
          handleTitleChange={(e) => setTodoData({ ...todoData, title: e.target.value })}
          handleDescriptionChange={(e) => setTodoData({ ...todoData, description: e.target.value })}
          handleSubmit={handleSubmit}
        />

        {/* DeleteConfirmationDialog Component */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          todoTitle={currentTodo ? currentTodo.title : ""}
          handleClose={handleDeleteDialogClose}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default TodoPage;


