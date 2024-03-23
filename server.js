const sqlite3 = require('sqlite3');
const app = require('./app');

//start server
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//connect to the DB
let db = new sqlite3.Database('./db.sqlite', err => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB connected!');
  }
});