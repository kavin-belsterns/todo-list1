import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";

interface TodoItem {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
}

interface TodoCardProps {
  todo: TodoItem;
  onAction: (action: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onAction }) => {
  // Define the actions in a JSON format
  const actions = [
    { label: "Edit", color: "primary", action: "edit" },
    { label: "Delete", color: "secondary", action: "delete" },
    { label: todo.isDone ? "Undo" : "Mark as Done", color: todo.isDone ? "inherit" : "success", action: "toggleDone" }
  ];

  return (
    <Grid size={{ xs: 12, sm: 8, md: 8, lg: 8 }}>
      <Card
        sx={{
          backgroundColor: todo.isDone ? "#e0e0e0" : "white",
          display: "block",
          margin: "0 auto", // Center card horizontally
          maxWidth: "100%", // Make the card responsive
        }}
      >
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between" alignContent="center">
            {/* Title and Description */}
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: todo.isDone ? "line-through" : "none",
                }}
              >
                {todo.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: todo.isDone ? "line-through" : "none",
                }}
              >
                {todo.description}
              </Typography>
            </Grid>

            {/* Single Button for Multiple Actions */}
            <Grid size={{ xs: 6 }} container justifyContent="flex-end" spacing={1}>
              {actions.map((action) => (
                <Grid key={action.action}>
                  <Button
                    onClick={() => onAction(action.action)}
                    color={action.color as "primary" | "secondary" | "inherit" | "success"}
                    size="small"
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TodoCard;


