var express = require('express');
var app = express();
var db = require('./models');
var bodyParser = require('body-parser');
var Hashids = require("hashids"),
    hashids = new Hashids("this is my salt");



app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}))


app.get("/", function(req,res) {
  res.render("index");
})

app.get("/links/:hash", function(req,res) {
  //db.link.find
  res.render("links/show",{taco: req.headers.host + "/"+req.params.hash})
})


app.post("/links", function(req,res) {

  db.link.create({url:req.body.q}).then(function(data){
    var shortened = hashids.encode(data.id);
    data.hash = shortened;
    data.save().then(function(){
      //res.render('links/show', {taco: data.hash})
      res.redirect('/links/'+data.hash)

    })
  })

})

app.get("/:hash", function(req,res){
  db.link.find({where: {hash: req.params.hash}}).then(function(taco){
    if(!taco){
      res.send("could not find url");
    }else{
      res.redirect('http://'+taco.url)
    }
  })
})




// somehow important, try and figure out why
// request.headers.host























app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000")
})
