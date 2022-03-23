const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');

server.use(cors());

server.get('/api/', function (req, res) {
    res.json({ "message": "Hello World!" });
});

http.listen(3001, function(){
    console.log('Servidor rodando em: http://localhost:3001/api/');
});