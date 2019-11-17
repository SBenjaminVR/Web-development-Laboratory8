let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let blogPostSchema = mongoose.Schema({
    id: {type: String},
    title: {type: String}, 
    content: {type: String},
    author: {type: String},
    publishDate: {type: Date}
})

let Blog = mongoose.model('benjamin-blog-post', blogPostSchema);

let BlogPosts = {
    post: function(newPost) {
        return Blog.create(newPost)
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getAll: function() {
        return Blog.find()
            .then(posts => {
                return posts
            })
            .catch(err => {
                throw Error(err);
            })
    },
    get: function(authorNanme) {
        return Blog.find({ author: authorNanme })
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            })
    },
    delete: function(idToDelete) {
        return Blog.deleteOne({ id: idToDelete })
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            })
    },
    put: function (idToUpdate, newTitle, newContent, newAuthor, newDate) {
        return Blog.findOneAndUpdate({ id: idToUpdate }, { $set: { title: newTitle, content: newContent, author: newAuthor, publishDate: newDate } }, { new: true })
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            })
    },
    find: function(idToFind) {
        return Blog.findOne({ id: idToFind })
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            })
    }

}

module.exports = { BlogPosts };