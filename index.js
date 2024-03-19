const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Set Up A Schema for my application
const todoSchema = new mongoose.Schema({
  todoTitle: {
    type: String,
    required: [true, "TodoTitle is required"],
    trim: true,
  },
  todoContent: {
    type: String,
    required: [true, "TodoTitle is required"],
    trim: true,
  },
});

// Set up a model for my application
const TodoModel = mongoose.model("TodoModel", todoSchema);

let connectionString = process.env.CONNECTION_STRING;

// Set up middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

let todoArray = [];

// Creating Todo
app.post("/", (req, res) => {
  const { title, content } = req.body;
  todoArray.push({ title, content });
  console.log("Todo Array : ", todoArray);
  res.redirect("/");
});

// Retrieving all available Todo's
app.get("/", (req, res) => {
  res.render("index", { todoArray });
});

// Delete Todo
app.post("/deleteTodo/:id", (req, res) => {
  console.log("Delete ID : ", req.params.id);
  let index = req.params.id;
  todoArray.splice(index, 1);

  res.redirect("/");
});

// Connecting to database
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(connectionString);
    if (connect) {
      console.log("Database Conected Successfully");
    }else{
      console.log("Error Occured while trying to connect to the database ")
    }
  } catch (error) {
    console.log("Error Conecting to database : ", error);
  }
};

connectDb()
// Edit Todo
app.post("/editTodo/:id", (req, res) => {
  const id = req.params.id;
  console.log("Edit ID : ", id);

  todoArray.filter((todo, index) => {
    if (index == id) {
      // res.render("edit", { todo, id });
      console.log("Received TODO : ", todo);
      res.render("edit", { todo, id });
    }
  });
});

// Update Todo
app.post("/updateTodo/:id", (req, res) => {
  const { title, content } = req.body;
  console.log("Title : ", title, "Content : ", content);
  if (!title || !content) {
    console.log("All fields are required");
  }

  const id = req.params.id;
  console.log("Update ID : ", id);

  todoArray.filter((todo, index) => {
    if (index == id) {
      todo.title = title;
      todo.content = content;
    }
  });
  res.redirect("/");
});

// Listening to the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port  " + port);
});
