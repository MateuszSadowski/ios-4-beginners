const express = require("express")
const http = require ("http")
const fs = require("fs")
const path = require("path")
const fileUpload = require("express-fileupload")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const PORT = 8000;
const app = express();

var dir =  process.cwd();

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

app.use(express.static(dir)); //current working directory
app.use(express.static(__dirname)); //module directory
app.use(fileUpload());
app.get("/", function(req, res) {
    res.redirect("lib/template.html"); 
   });
app.get("/files", function(req, res) {
    currentDir = dir;
    var query = req.query.path || "";
    if (query) currentDir = path.join(dir, query);
    var data = [];
    fs.readdir(currentDir, function(err, files)
    {
        console.log("browsing ", currentDir);

        if(err)
            console.error(err);

        files.forEach(function(file) {
            var isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();
            if(isDirectory)
                data.push({Name: file, IsDirectory: true, Path: path.join(query, file)});
            else
                data.push({Name: file, IsDirectory: false, Path: path.join(query, file)});
        })

        res.json(data);
    })
})
app.post("/upload", function(req, res) {
    if (!req.files)
      return res.status(400).send("No files were uploaded.");
   
    checkAuthorization();

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let savePath = currentDir + '/' + sampleFile.name;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(savePath, function(err) {
      if (err)
        return res.status(500).send(err);
   
      res.send("File uploaded!");
    });
  });

var server = http.createServer(app);
server.listen(PORT);

// function checkAuthorization() {
//     $(document).load(dir + "/lib/login.html");
// }