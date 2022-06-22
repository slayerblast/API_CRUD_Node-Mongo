const mongoose = require("mongoose");

//Schéma mongoose
const taskSchema = new mongoose.Schema({
    description: String,
    faite: Boolean,
    creePar: Number
});
const Task = mongoose.model('tasks', taskSchema);

module.exports = { Task };