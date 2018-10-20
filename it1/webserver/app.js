// @ts-check

const http = require('http');
const port = 3000;

const { Pool, Client } = require('pg');
const connectionString = 'postgresql://audun:123@localhost:5432/bibliotek';

const pool = new Pool({
  connectionString: connectionString,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
})

const client = new Client({
  connectionString: connectionString,
})
client.connect();

client.query('SELECT * from bok', (err, res) => {
  console.log(err, res);
  client.end();
})


const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello Node.js Server!');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
})