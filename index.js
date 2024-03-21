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

// Database Queries
// When creatung to database you make use of .create({})
// When YOY'RE TRYING TO RETRIEVE ALl Data from databse you use .find({})
// When YOY'RE TRYING TO RETRIEVE Single Data from databse you use .findOne({})
// When YOY'RE TRYING TO Delete Single Data from databse you use .findOneAndDelete || findByIdAndDelete({id})
// When YOY'RE TRYING TO Update Single Data from databse you use .findOneAndUpdate || findByIdAndUpdate({id})
// When YOY'RE TRYING TO Delete all Data from databse you use .deleteAll({})

// Creating Todo
app.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return console.log("All fields are required");
  }

  try {
    const todo = await TodoModel.create({
      todoTitle: title,
      todoContent: content,
    });

    if (todo) {
      console.log("Todo Created Successfully");
    } else {
      console.log("Error Creating Todo");
    }
  } catch (error) {
    console.log("Internal Server Error, Error Creating Todo", error);
  }
  res.redirect("/");
});

// Retrieving all available Todo's
app.get("/", async (req, res) => {
  try {
    const AllavailableTodo = await TodoModel.find({});
    if (AllavailableTodo) {
      console.log("Todo fetched Successfully", AllavailableTodo);
      res.render("index", { todoArray: AllavailableTodo });
    } else {
      console.log("Error retrieving Todo's");
    }
  } catch (error) {
    console.log("Server Error, Error fetching all todo's", error);
  }
});

// Delete Todo
app.post("/deleteTodo/:id", async (req, res) => {
  console.log("Delete ID : ", req.params.id);
  let id = req.params.id;
  try {
    const deleteTodo = await TodoModel.findByIdAndDelete(id);
    if (deleteTodo) {
      console.log("Todo deleted successfully");
    }else{
      console.log("Error deleting todo")
    }
  } catch (error) {
    console.log("Server Error, Error Deleting Todo", error);
  }

  res.redirect("/");
});

// Connecting to database
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(connectionString);
    if (connect) {
      console.log("Database Conected Successfully");
    } else {
      console.log("Error Occured while trying to connect to the database");
    }
  } catch (error) {
    console.log("Error Conecting to database : ", error);
  }
};

connectDb();
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
