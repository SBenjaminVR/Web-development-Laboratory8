
let newPost = {
    id: "",
    title: "",
    content: "",
    author: "",
    publishDate: ""
}

function cleanNewPost() {
    $('#postAuthor').val('');
    $('#postTitle').val('');
    $('#postContent').val('');
}

function cleanPage() {
    $('#errorMessage').html(``);
    $('#successfulMessage').html('');
    $('#blogPosts').html(``);
    $('#successfulDeleteMessage').html('');
    $('#errorMessageUpdate').html('');
    $('#deleteForm').html('');
    $('#updateForm').html('');
}

function createDeleteForm() {
    $('#deleteForm').append(`<legend>Delete a post</legend>`);
    $('#deleteForm').append(`<select class="custom-select" id="selectPostToDelete"></select>`);
    $('#deleteForm').append(`<input class="btn btn-primary" id="deleteButton" type="submit" value="Submit" />`);
    $('#selectPostToDelete').append(`<option value='0' selected>Open this select menu</option>`);
}

function createUpdateForm() {
    $('#updateForm').append(`<legend>Update a post (You can leave up to 2 fields empty)</legend>`);
    $('#updateForm').append(`<select class="custom-select" id="selectPostToUpdate"></select>`);
    $('#updateForm').append(`<div class="form-group">
                <label for="updateAuthor">New author's name</label>
                <input class="formElement form-control" id="updateAuthor" type="text" />
            </div>
            <div class="form-group">
                <label for="updateTitle">New title</label>
            <input class="formElement form-control" id="updateTitle" type="text" />
            </div>
            <div class="form-group">
                <label for="updateContent">New content</label>
            <textarea class="formElement form-control" id="updateContent" rows="3" type="text"></textarea>
            </div>`);
    $('#updateForm').append(`<input class="btn btn-primary" id="updateButton" type="submit" value="Submit" />`);
    $('#selectPostToUpdate').append(`<option value='0'selected>Open this select menu</option>`);
}

function fetchBlogPosts() {
    $.ajax({
        url: "http://localhost:8080/blog-posts",
        method: "GET",
        dataType: "json",
        success: function (responseJSON) {
            console.log(responseJSON);
            createDeleteForm();
            createUpdateForm();
            for (let i = 0; i < responseJSON.length; i++) {
                $('#blogPosts').append(`<li class="border border-primary"><h2>${responseJSON[i].title}</h2><h5>Posted on: ${responseJSON[i].publishDate}</h5><p>${responseJSON[i].content}</p><p>This post was created by: ${responseJSON[i].author}</p></li>`);
                $('#selectPostToDelete').append(`<option value="${responseJSON[i].id}">${responseJSON[i].title}</option>`)
                $('#selectPostToUpdate').append(`<option value="${responseJSON[i].id}">${responseJSON[i].title}</option>`)
            }
        },
        error: function (err) {
            console.log("There has been an error");
            $('#deleteForm').html('');
            $('#blogPosts').html('<h3>There has been an error loading the posts</h3>');
        }
    });
}

function updatePost(postID) {
    let updateUrl = "http://localhost:8080/blog-posts/" + postID;
    newPost.id = postID;
    $.ajax({
        url: updateUrl,
        method: "PUT",
        data: JSON.stringify(newPost),
        contentType: "application/json",
        dataType: "json",
        success: function (responseJSON) {
            cleanPage();
            $('#successfulDeleteMessage').html('<h3>Succesfully updated the post</h3>');
            fetchBlogPosts();
        },
        error: function (err) {
            console.log(err.responseJSON.code);

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
            cleanPage();
            $('#successfulMessage').html(`<b>The post has been successfully added to the end of the list</b>`);
            cleanNewPost();
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

function deletePost(postID) {
    let deleteUrl = 'http://localhost:8080/blog-posts/' + postID;
    $.ajax({
        url: deleteUrl,
        method: "DELETE",
        dataType: "json",
        success: function (responseJSON) {
            cleanPage();
            fetchBlogPosts();
            $('#successfulDeleteMessage').html('<h3>Succesfully deleted the post</h3>');

        },
        error: function (err) {
            console.log(err);
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

function verifyEmptyValuesUpdate() {
    if ($('#updateAuthor').val() == "")
        newPost.author = undefined;
    else
        newPost.author = $('#updateAuthor').val()
    if ($('#updateTitle').val() == "")
        newPost.title = undefined;
    else
        newPost.title = $('#updateTitle').val()
    if ($('#updateContent').val() == "")
        newPost.content = undefined;
    else
        newPost.content = $('#updateContent').val()

    if (newPost.content == undefined && newPost.author == undefined && newPost.title == undefined) {
        return false;
    }
    return true;
}

function watchForms() {
    $('#postButton').on('click', (event) => {
        event.preventDefault();
        verifyEmptyValues();
        newPost.publishDate = new Date();
        post()

    })
    $('#cancelButton').on('click', (event) => {
        event.preventDefault();
        cleanNewPost();
    })
    $('#deleteForm').on('click', 'input', (event) => {
        event.preventDefault();
        deletePost($('#selectPostToDelete').val());
    })
    $('#updateForm').on('click', '#updateButton', (event) => {
        event.preventDefault();
        $('#errorMessageUpdate').html('');
        if ($('#selectPostToUpdate').val() == 0) {
            $('#errorMessageUpdate').append(`<h3>Please select a post</h3>`)
        }
        else {
            if (verifyEmptyValuesUpdate())
                updatePost($('#selectPostToUpdate').val());
            else {
                $('#errorMessageUpdate').append(`<h3>You didn't edit any field</h3>`);
            }
        }
    })
}

fetchBlogPosts();
watchForms();