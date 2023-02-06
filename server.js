// 1. Create a new file called `server.js` and using Node's `http` module create a web server that responds with a status 200 and a greeting when it receives a GET request on the path `/api` (e.g. `{ message: "Hello! }`)
// 2. Add a GET `/api/books` endpoint that responds with a status 200 and a JSON object, that has a key of `books` with a value of the array of books from the `./data/books.json` file.
//Add a GET /api/authors endpoint that responds with a status 200 and a JSON object, that has a key of authors with a value of the array of authors from the ./data/authors.json file.
// 5. Add a POST `/api/books` endpoint that accepts a book object on the body of the request and adds the book to the `./data/books.json` file. The endpoint should respond with the newly created book object. Additional considerations:

//    - How could you ensure that the `bookId` that is created is unique?
//    - What status code should the server respond with?

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

    const urlIsBookId = /\/api\/books\/\d+$/.test(url);
    
    if (urlIsBookId && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;

      fs.readFile(`${__dirname}/data/books.json`, 'utf8')
      .then((data)=> {
        const books = JSON.parse(data)
        const bookId = url.substring(11);

        const hasSameId = books.some((book) => book.bookId === bookId)
        if (!hasSameId) {
            throw new Error('No existing book.');
        }

        // Iterate through books for more accuracy.
        const book = books[bookId - 1];
        const body = JSON.stringify({book})
        response.write(body)
        response.end();
      })
      .catch((err) => {
        response.statusCode = 404;
        response.write(JSON.stringify('Your requested book does not exist.'));
        response.end();
      });
    }

    if (url === '/api/books' && method === 'POST') {
        let body = '';
        let books = ''
        request.on('data', (packet) => {
            body += packet.toString();
        });
        request.on('end', () => {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 201;
            const newBook = JSON.parse(body)

            fs.readFile(`${__dirname}/data/books.json`, 'utf8')
            .then((data)=> {
                books = JSON.parse(data)
                const hasSameId = books.some((book) => book.bookId === newBook.bookId)
                if (!hasSameId) {
                    books.push(newBook)
                }
                
                return fs.writeFile(`${__dirname}/data/newbooks.json`, JSON.stringify(books), () => {})
            })
            .then(() => {
                const body = JSON.stringify({books})
                response.write(body)
                response.end()
            })
        });
    }

    const urlIsBookAuthor = /\/api\/books\/\d+\/author/.test(url);
    
    if (urlIsBookAuthor && method === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = 200;
      let book = {};

      fs.readFile(`${__dirname}/data/books.json`, 'utf8')
      .then((data)=> {
        const books = JSON.parse(data)
        const bookId = url.slice(11, -7);
        // Iterate through books for more accuracy.
        book = books[bookId - 1];

        return fs.readFile(`${__dirname}/data/authors.json`, 'utf8');
      })
      .then((data)=> {
        const authors = JSON.parse(data)
        const author = authors[book.authorId - 1];
  
        const body = JSON.stringify({author})
        response.write(body)
        response.end();
      })
    }
});
  
server.listen(9090, (err) => {
  if (err) console.log(err);
  else console.log('Server listening on port: 9090');
});

//   req.on('end', () => {
//     const newPet = JSON.parse(body);
//     fs.readFile(`${__dirname}/data/pets.json`).then((petData) => {
//       const pets = JSON.parse(petData);
//       const newPets = [...pets, newPet];
//       return fs.writeFile(`${__dirname}/data/pets.json`, JSON.stringify(newPets, null, 2));
//     }).then(() => {
//       response.writeHead(201,{'Content-Type': 'application/json'} );
//       response.end(JSON.stringify({ newPet }));
//     })
//   })
