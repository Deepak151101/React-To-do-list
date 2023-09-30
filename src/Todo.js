import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Modal,
} from "@material-ui/core";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "./Todo.css";
import db from "./firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, isBefore } from "date-fns"; // Import date-fns functions

const useStyles = makeStyles((themes) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: themes.palette.background.paper,
    border: "2px solid #000",
    boxShadow: themes.shadows[5],
    padding: themes.spacing(2, 4, 3),
  },
}));

function Todo(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(props.todo.todo);
  const [completed, setCompleted] = useState(false);

  const handleDeleteClick = () => {
    db.collection("todos").doc(props.todo.id).delete();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const updateTodo = () => {
    db.collection("todos")
      .doc(props.todo.id)
      .set(
        {
          todo: input,
        },
        { merge: true }
      );

    setOpen(false);
  };

  const handleCompletedTask = () => {
    setCompleted(!completed);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      updateTodo();
    }
  };

  useEffect(() => {
    // Check if the deadline has passed
    if (props.todo.deadline) {
      const currentTime = new Date();
      const deadlineTime = new Date(props.todo.deadline);

      if (isBefore(currentTime, deadlineTime)) {
        // The deadline is in the future
        const timeUntilDeadline = deadlineTime - currentTime;

        // Set a timer to trigger the notification when the deadline is reached
        const timer = setTimeout(() => {
          // Check if the tab is focused before showing the notification
          if (!document.hidden) {
            // Send a notification
            new Notification("Task Deadline Reached", {
              body: `The deadline for "${input}" has been reached.`,
            });
          }
        }, timeUntilDeadline);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [props.todo.deadline, input]);

  return (
    <>
      <Modal
        open={open}
        onClose={(e) => setOpen(false)}
        className="todo_modal"
      >
        <div className={classes.paper} id="todo_modal_box">
          <h1>Edit Todo</h1>
          <input
            placeholder={props.todo.todo}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={updateTodo}
            disabled={!input}
          >
            Update Todo
          </Button>
        </div>
      </Modal>

      <List className={`todo_list ${completed ? "completed" : ""}`}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <TaskAltIcon
                className={`task-icon ${completed ? "completed" : ""}`}
                onClick={handleCompletedTask}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={input}
            secondary={
              props.todo.deadline
                ? `Deadline: ${format(
                    new Date(props.todo.deadline),
                    "yyyy-MM-dd HH:mm"
                  )}`
                : "No Deadline"
            }
            className={completed ? "completed-task" : ""}
          />

          <Button
            className="edit-icon"
            onClick={handleOpen}
            variant="contained"
            color="primary"
            type="submit"
          >
            Edit
          </Button>
          <DeleteIcon onClick={handleDeleteClick} className="delete-icon" />
        </ListItem>
      </List>
    </>
  );
}

export default Todo;
