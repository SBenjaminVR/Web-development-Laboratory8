
let newPost = {
    id: "",
    title: "",
    content: "",
    author: "",
    publishDate: ""
}

function fetchBlogPosts() {
    $.ajax({
        url: "http://localhost:8080/blog-posts",
        method: "GET",
        dataType: "json",
        success: function(responseJSON) {
            console.log(responseJSON);
            for (let i = 0; i < responseJSON.length; i++) {
                $('#blogPosts').append(`<li><h2>${responseJSON[i].title}</h2><h4>Posted on: ${responseJSON[i].publishDate}</h4><p>${responseJSON[i].content}</p><p>This post was created by: ${responseJSON[i].author}</p></li>`)
            }
        },
        error: function (err) {
            console.log("There has been an error");
            $('#blogPosts').html('<h3>There has been an error loading the posts</h3>');
        }
    });
}

function post() {
    $.ajax({
        url: "http://localhost:8080/blog-posts",
        method: "POST",
        data: JSON.stringify(newPost),
        contentType: "application/json",
        dataType: "json",
        success: function (responseJSON) {
            console.log(responseJSON);
            $('#errorMessage').html(``);
            $('#blogPosts').html(``);
            $('#successfulMessage').html(`<b>The post has been successfully added to the end of the list</b>`);
            $('#postAuthor').val('');
            $('#postTitle').val('');
            $('#postContent').val('');
            fetchBlogPosts();
        },
        error: function (err) {
            console.log(err.responseJSON.code);
            if (err.responseJSON.code == 406) {
                $('#errorMessage').html(`<b>You are missing one of the fields in the form</b>`);
                $('#successfulMessage').html(``);
            }
            else {
                console.log("There has been an error");
                $('#blogPosts').html('<h3>There has been an error loading the posts</h3>');
            }
        }
    });
}

function verifyEmptyValues() {
    if ($('#postAuthor').val() == "") 
        newPost.author = undefined;
    else 
        newPost.author = $('#postAuthor').val()
    if ($('#postTitle').val() == "") 
        newPost.title = undefined;
    else 
        newPost.title = $('#postTitle').val()
    if ($('#postContent').val() == "") 
        newPost.content = undefined;
    else 
        newPost.content = $('#postContent').val()
}

function watchForms() {
    $('#postButton').on('click', (event) => {
        event.preventDefault();
        verifyEmptyValues();
        newPost.publishDate = new Date();
        post()

    })
}

fetchBlogPosts();
watchForms();