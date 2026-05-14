const express = require('express');
const app = express();
const http = require('http')
const PORT = 3000;
var httpServer = http.createServer(function(req, res){
    res.writeHead(200,'Content-Type','text/html');
    res.end("<h1>Voici votre premier teste sur le node</h1><br><p>Inspirer bien votre inspiration pour que cela marche bien !</p>")
})
app.use(express.json());
app.listen(PORT, function(){
    console.log("Message envoyer dans le port de http://localhost:3000");
}
);