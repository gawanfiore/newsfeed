(function(window, document, undefined) {
  var PostModel = {};

  var POSTS_URL= '/posts';
  var STATUS_OK = 200;

  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = function(callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code
        if(request.responseText.length <= 0) {
          request.responseText = "[]";
        }
        var posts = JSON.parse(request.responseText);
        callback(null, posts);
      } else { //Bad response code
        callback(request.responseText, null);
      }
    });
    //setup POST request
    request.open('GET', POSTS_URL);
    request.setRequestHeader('Content-type', 'application/json');
    //make request
    request.send();
  };

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = function(post, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code
        var newPost = JSON.parse(request.responseText);
        callback(null, newPost);
      } else { //Bad response code
        callback(request.responseText, post);
      }
    });
    //setup POST request
    request.open('POST', POSTS_URL);
    request.setRequestHeader('Content-type', 'application/json');
    //make request
    request.send(JSON.stringify(post));
  };

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = function(post_id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code
        callback(null);
      } else { //Bad response code
        callback(request.responseText);
      }
    });
    //setup POST request
    var url = POSTS_URL + '/remove';
    request.open('POST', url);
    request.setRequestHeader('Content-type', 'application/json');
    //make request
    request.send(JSON.stringify({id: post_id}));
  };

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = function(post_id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code
        var post = JSON.parse(request.responseText);
        callback(null, post);
      } else { //Bad response code
        callback(request.responseText);
      }
    });
    //setup POST request
    var url = POSTS_URL + "/upvote";
    request.open('POST', url);
    request.setRequestHeader('Content-type', 'application/json');
    //make request
    request.send(JSON.stringify({id: post_id}));
  };

  window.PostModel = PostModel;
})(this, this.document);
