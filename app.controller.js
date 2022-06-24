
const App = require("./app.model.js");
const bcrypt = require('bcryptjs');
const Joi = require("joi");

// Create and Save a new Message
exports.create = async (req, res) => {
 const payload = req.body.tasks;

//validation avec Joi
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

exports.register = async (req, res) => {
  let _id = 1
  console.log(req.body.users)
  const payload = req.body.users;
 //validation avec Joi
 const schema = Joi.object({
  _id: Joi.allow(),
  email: Joi.string().max(255).email().required(),
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});
   
 
     const value = new App.User({
     email: req.body.users.email,
     username: req.body.users.username,
     password: req.body.users.password
     
   });
 
   /*const {result, error} = schema.validate(payload);
     if (error) {
         throw new Error(error.details[0].message);
     }*/
 
  
   const { data, error } = schema.validate(payload);

   if (error) res.status(400).send({ erreur: error.details[0].message });

   const user = await App.User.findOne({email: payload.email});
     if(user){
      throw new Error("Un compte existe déja");
     }

   else{
        let id = _id++;
        const salt = await bcrypt.genSalt(10);
        let { password } = payload;
        passwordHashed = await bcrypt.hash(password, salt);
        payload.password = passwordHashed;

        const user = new App.User({...payload, _id : id});
        await user.save();

        delete payload.password;
        res.status(201).send({...payload, _id : id});
        
   } 
 };