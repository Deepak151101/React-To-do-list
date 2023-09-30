import React, { useEffect, useState } from "react";
import Todo from "./Todo";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  TextField,
} from "@material-ui/core";
import "./App.css";
import db from "./firebase";
import firebase from "firebase";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState(""); // State to capture the deadline input

  useEffect(() => {
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            todo: doc.data().todo,
            deadline: doc.data().deadline, // Retrieve the deadline from Firestore
          }))
        );
      });
  }, []);


  // Notification
  useEffect(() => {
    // Request notification permission when the app is initialized
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    });
  }, []);
  


  const addToDo = (event) => {
    event.preventDefault();

    db.collection("todos").add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      deadline: deadline, // Store the deadline in Firestore
    });

    setTodos([...todos, { todo: input, deadline: deadline }]);
    setInput("");
    setDeadline(""); // Clear the deadline input
  };

  return (
    <div className="App">
      <h1>ToDo App</h1>
      <form>
        <FormControl>
          <InputLabel className="input-label">✅ Write a ToDo</InputLabel>
          <Input
            className="task-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </FormControl>
        <TextField
          className="date-input"
          label="Deadline"
          type="datetime-local"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          className="add-to-do-btn"
          variant="contained"
          color="primary"
          type="submit"
          onClick={addToDo}
          disabled={!input}
        >
          Add ToDo
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
