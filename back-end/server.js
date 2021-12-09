const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);
console.log('Connexion au port 3000 ok ! Bienvenu sur Piiquante');

server.listen(process.env.PORT || 3000);