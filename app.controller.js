
const App = require("./app.model.js");
const Joi = require("joi");

// Create and Save a new Message
exports.create = async (req, res) => {
 const payload = req.body.tasks;

 const schema = Joi.object({
    description: Joi.string().min(5).max(25).required(),
    faite: Joi.boolean().required(),
    creePar: Joi.number().required(),

  });
  

    const value = new App.Task({
    description: req.body.tasks.description,
    faite: req.body.tasks.faite,
    creePar: req.body.tasks.creePar
    
  });

  /*const {result, error} = schema.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }*/

 
  const { data, error } = schema.validate(payload);
  if (error) res.status(400).send({ erreur: error.details[0].message });

  else{
    value
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message.",
      });
    });
  }
 
  
};


// Retrieve all messages from the database.
exports.findAll = async (req, res) => {
    App.Task.find()
    .then((data) => {
      res.send(data);
      console.log
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages.",
      });
    });
}; 


// Find a single message with a taskId
exports.findOne = (req, res) => {
  App.Task.findById(req.params.taskId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Message not found with id " + req.params.taskId,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Message not found with id " + req.params.taskId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving message with id " + req.params.taskId,
      });
    });
};

// Update a message identified by the taskId in the request
exports.update = (req, res) => {
  App.Task.findByIdAndUpdate(
    req.params.taskId,
    {
        description: req.body.tasks.description,
        faite: req.body.tasks.faite,
        creePar: req.body.tasks.creePar
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Task not found with id " + req.params.taskId,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.taskId,
        });
      }
      return res.status(500).send({
        message: "Error updating Task with id " + req.params.taskId,
      });
    });
};

// Delete a message with the specified taskId in the request
exports.delete = (req, res) => {
  App.Task.findByIdAndRemove(req.params.taskId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Task not found with id " + req.params.taskId,
        });
      }
      res.send({ message: "Task deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.taskId,
        });
      }
      return res.status(500).send({
        message: "Could not delete Task with id " + req.params.taskId,
      });
    });
};
