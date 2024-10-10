import React from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box
} from "@mui/material";

interface TodoFormProps {
  open: boolean;
  title: string;
  description: string;
  isEditing: boolean;
  handleClose: () => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({
  open,
  title,
  description,
  isEditing,
  handleClose,
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditing ? "Update Todo" : "Add Todo"}</DialogTitle>
      <DialogContent>
        <TextField
          // label="Title"
          value={title}
          placeholder="Title"
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          // label="Description"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions sx={{paddingBottom:"20px"}}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginLeft: '8px' }}>
            {isEditing ? "Update Todo" : "Add Todo"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TodoForm;
