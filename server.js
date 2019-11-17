let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let uuid =  require('uuid');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let { BlogPosts } = require('./blog-post-model');
let { DATABASE_URL, PORT } = require('./config');

let jsonParser = bp.json();

let app = express();

app.use(express.static('public'));;
app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

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
    BlogPosts.getAll()
        .then(posts => {
            return res.status(200).json(posts);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
})

app.get('/blog-post', (req, res, next) => {
    if (req.query.author == undefined) {
        res.statusMessage = "Author param is missing"
        return res.status(406).json({
            code: 406,
            message: "Author param is missing"
        })
    }
    BlogPosts.get(req.query.author)
        .then(posts => {
            if (posts.length < 1) {
                res.statusMessage = "Author doesn't exist";
                return res.status(404).json({
                    code: 404,
                    message: "Author doesn't exist"
                });
            }
            return res.status(200).json(posts);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
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
    BlogPosts.post(newPost)
        .then(post => {
            return res.status(201).json(post);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })

});

app.delete('/blog-posts/:id', (req, res, next) => {
    BlogPosts.delete(req.params.id)
        .then(post => {
            if (post.deletedCount == 0) {
                res.statusMessage = "ID was not found";
                return res.status(404).json({
                    code: 404,
                    message: "ID was not found"
                })
            }
            res.statusMessage = "Successfully deleted the post"
            return res.status(200).json({
                code: 200,
                message: "Succesfully deleted the post"
            })

        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
});

app.put('/blog-posts/:id', jsonParser, (req, res, next) => {
    if (req.body.id == undefined) {
        res.statusMessage = "ID param is missing in the body";
        res.status(406).json({
            code: 406,
            message: "ID param is missing in the body"
        })
    }
    if (req.body.id != req.params.id) {
        res.statusMessage = "The IDs do not match";
        res.status(409).json({
            code: 409,
            message: "The IDs do not match"
        });
    }
    BlogPosts.find(req.body.id)
        .then(post => {
            if (post != null) {
                if (req.body.title != undefined)
                    post.title = req.body.title;
                if (req.body.content != undefined)
                    post.content = req.body.content;
                if (req.body.author != undefined)
                    post.author = req.body.author;
                if (req.body.publishDate != undefined)
                    post.publishDate = req.body.publishDate;

                BlogPosts.put(req.body.id, post.title, post.content, post.author, post.publishDate)
                    .then(updatedPost => {
                        res.statusMessage = "Successfully updated the post";
                        return res.status(202).json(updatedPost);
                    })  
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB";
                        return res.status(500).json({
                            message: "Something went wrong with the DB",
                            status: 500
                        })
                    })      
            }
            else {
                res.statusMessage = "ID was not found";
                return res.status(404).json({
                    code: 404,
                    message: "ID was not found"
                })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL)
    .catch(err => {
        console.log(err);
    });

module.exports = { app, runServer, closeServer };