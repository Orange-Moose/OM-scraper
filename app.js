import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });


/*========================
EXPRESS
========================*/
const app = express();


// for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


//Start the app
app.listen(3000, () => console.log(`Server running on port 3000`));