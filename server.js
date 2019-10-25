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
        title: "Tusk ACT 3",
        content: "By shooting himself with a Spin-imbued fingernail with aureal rotation, Johnny is able to suck his body into the hole it creates.",
        author: "Johnny Joestar",
        publishDate: new Date("January 19, 1891, 9:22:12")
    },
    {
        id: uuid.v4(),
        title: "Tusk ACT 4",
        content: "Tusk ACT4 is the highest evolution of Tusk, accessed only when Johnny uses the Golden Spin.",
        author: "Johnny Joestar",
        publishDate: new Date("January 19, 1891, 10:25:19")
    }
];

app.get('/blog-posts', (req, res, next) => {
    return res.status(200).json(blogPosts);
})

app.get('/blog-post', (req, res, next) => {
    if (req.query.author == undefined) {
        res.statusMessage = "Author param is missing"
        return res.status(406).json({
            code: 406,
            message: "Author param is missing"
        })
    }
    let authorPosts = []
    for (let i = 0; i < blogPosts.length; i++) {
        if (req.query.author ==  blogPosts[i].author) {
            authorPosts.push(blogPosts[i]);
        }
    }
    if (authorPosts.length < 1) {
        res.statusMessage = "Author doesn't exist";
        return res.status(404).json({
            code: 404,
            message: "Author doesn't exist"
        });
    }
    return res.status(200).json(authorPosts);
});

app.post('/blog-posts', jsonParser, (req, res, next) => {
    if (req.body.title == undefined || req.body.content == undefined || req.body.author == undefined || req.body.publishDate == undefined) {
        res.statusMessage = "Missing field in the post";
        return res.status(406).json({
            code: 406,
            message: "Missing field in the post"
        });
    }
    let newPost = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate)
    }
    blogPosts.push(newPost);
    return res.status(201).json(newPost);

});

app.delete('/blog-posts/:id', (req, res, next) => {
    for (let i = 0; i < blogPosts.length; i++) {
        if (req.params.id == blogPosts[i].id) {
            blogPosts.splice(i, 1);
            res.statusMessage = "Successfully deleted the post"
            return res.status(200).json({
                code: 200,
                message: "Succesfully deleted the post"
            })
        }
    }
    res.statusMessage = "ID was not found";
    return res.status(404).json({
        code: 404,
        message: "ID was not found"
    })
});

app.listen('8080', () => {
    console.log("App running on localhost:8080");
});
