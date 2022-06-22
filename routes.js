module.exports = (app) => {
    const App = require("./app.controller.js");
  
    app.post("/create", App.create);
  
    app.get("/get-all", App.findAll);
  
    app.get("/task/:taskId", App.findOne);
  
    app.put("/task/:taskId", App.update);
  
    app.delete("/task/:taskId", App.delete);
  };
  