const mongoose = require("mongoose");

//Schéma mongoose
const taskSchema = new mongoose.Schema({
    description: String,
    faite: Boolean,
    creePar: Number
});
const Task = mongoose.model('tasks', taskSchema);


const UserSchema = new mongoose.Schema({
    _id: Number,
    email: String,
    username: String,
    password: String,
    token: String
});
const User = mongoose.model('users', UserSchema);

module.exports = { Task, User };