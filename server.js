let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let uuid =  require('uuid');

let jsonParser = bp.json();

let app = express();

app.use(express.static('public'));;
app.use(morgan('dev'));

let blogPosts = [
    {
        id: uuid.v4(),
        title: "Save the world",
        content: "This is your world, please save it",
        author: "John Doe",
        publishDate: new Date("May 8, 2008, 11:32:26")

    },
    {
        id: uuid.v4(),
        title: "Dirty Deeds Done Dirt Cheap",
        content: "Dirty deeds and they're done dirt cheap",
        author: "Funny Valentine",
        publishDate: new Date("September 25, 1890, 12:00:00")

    },
    {
        id: uuid.v4(),
        title: "Tusk ACT 4",
        content: "Tusk ACT4 is the highest evolution of Tusk, accessed only when Johnny uses the Golden Spin.",
        author: "Johnny Joestar",
        publishDate: new Date("January 19, 1891, 10:25:19")

    },
    
]