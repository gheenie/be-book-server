// 1. Create a new file called `server.js` and using Node's `http` module create a web server that responds with a status 200 and a greeting when it receives a GET request on the path `/api` (e.g. `{ message: "Hello! }`)
// 2. Add a GET `/api/books` endpoint that responds with a status 200 and a JSON object, that has a key of `books` with a value of the array of books from the `./data/books.json` file.
//Add a GET /api/authors endpoint that responds with a status 200 and a JSON object, that has a key of authors with a value of the array of authors from the ./data/authors.json file.

const http = require('http')
const fs = require('fs/promises')

const server = http.createServer((request, response) => {
    const { method, url } = request;

    if (url === '/api' && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;
      response.write(JSON.stringify({ msg: 'Hello!' }));
      response.end();
    }

    if (url === '/api/books' && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;
      fs.readFile(`${__dirname}/data/books.json`, 'utf8')
      .then((data)=> {
          const books = JSON.parse(data)
          const body = JSON.stringify({books})
          response.write(body)
          response.end();
      })
    }

    if (url === '/api/authors' && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;

      fs.readFile(`${__dirname}/data/authors.json`, 'utf8')
      .then((data)=> {
          const authors = JSON.parse(data)
          const body = JSON.stringify({authors})
          response.write(body)
          response.end();
      })
    }

    const urlIsBookId = /\/api\/books\//.test(url);

    if (urlIsBookId && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;

      fs.readFile(`${__dirname}/data/books.json`, 'utf8')
      .then((data)=> {
        const books = JSON.parse(data)
        const bookId = url.substring(11);
        // Iterate through books for more accuracy.
        const book = books[bookId - 1];
        const body = JSON.stringify({book})
        response.write(body)
        response.end();
      })
    }
});
  
  server.listen(9090, (err) => {
    if (err) console.log(err);
    else console.log('Server listening on port: 9090');
  });