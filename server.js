const express = require('express')
const http = require ('http')
const fs = require('fs')
const path = require('path')


const PORT = 8000;
const app = express();

var dir =  process.cwd();

app.use(express.static(dir)); //current working directory
app.use(express.static(__dirname)); //module directory
app.get('/', function(req, res) {
    res.redirect('lib/template.html'); 
   });
app.get('/files', function(req, res) {
    currentDir = dir;
    var query = req.query.path || '';
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

var server = http.createServer(app);
server.listen(PORT);