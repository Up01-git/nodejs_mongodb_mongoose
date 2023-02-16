//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/employee", {useNewUrlParser: true});

const empSchema = {
  name: String,
  id: Number
};

const Emp = mongoose.model("employees", empSchema);

//JSON awesome Viewer
app.get("/employee", function(req, res) {
  Emp.find(function(err, foundEmp) {
    if (!err) {
      res.send(foundEmp);
    } else {
      res.send(err);
    }

  });
});

app.route("/employee/:empId")
.get(function(req, res) {
  Emp.findOne({id: req.params.empId}, function(err, foundEmp) {
    if (foundEmp) {
      res.send(foundEmp);
    } else {
      res.send("No employee found!");
    }
  });
})

.put(function(req, res) {
  Emp.updateOne(
    {id: req.params.empId},
    {name: req.params.name, id: req.params.id},
    {overwrite: true},
    function(err) {
      if(!err) {
        res.send("Successfully updated!");
      } else {
        res.send(err);
      }
    }
  );
})

.patch(function(req,res) {
  Emp.updateOne(
    {
      id: req.params.empId
    },
    {$set: req.body},
    function(err) {
      if(!err) {
        res.send("Successfully updated!");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res) {
  Emp.deleteOne(
    {id: req.params.empId},
    function(err) {
      if (!err) {
        res.send("Successfully deleted!");
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/employee", function(req, res) {
  console.log(req.body.name);
  console.log(req.body.id);

  const newEmp = new Emp ({
    name: req.body.name,
    id: req.body.id
  });
  newEmp.save(function(err) {
    if (!err) {
      res.send("Successfully added new article!");
    } else {
      res.send(err);
    }
  });
});

app.delete("/employee", function(req,res) {
  Emp.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
