(function(window, document, undefined) {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error, posts) {
      // Error checking
      if(error) {
        Util.displayErrMsg(error);
        return;
      }
      //render each post
      posts.forEach(function(post) {
        NewsfeedView.renderPost($newsfeed, post, false);
      });

      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry({
          columnWidth: '.post',
          itemSelector: '.post'
        });
      });
    });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
    //Handlebars setup and rendering of template with post data
    if($newsfeed == null || post == null) { return; }
    var $postTemplate = $('#newsfeed-post-template');
    var renderPost = Handlebars.compile($postTemplate.html());
    var newHTML = renderPost(post);
    var $post = $(newHTML);
    $newsfeed.prepend($post);
    // Attach event listeners to remove and upvote buttons
    NewsfeedView.attachEventListeners($newsfeed, $post, post._id);

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  NewsfeedView.attachEventListeners = function($newsfeed, $post, id) {
    var $uvBtn = $post.find('.actions .upvote');
    var $rmBtn = $post.find('.actions .remove');
    
    //attach event listener for upvote button
    $uvBtn.on('click', function() {
      PostModel.upvote(id, function(error, posts) {
        if(!error) {
          var $uvCount = $uvBtn.find('.upvote-count');
          var count = parseInt($uvCount.html(), 10);
          if(count != NaN) {
            var newCount = count + 1
            $uvCount.html(newCount);
          }
        } else {
          var $error = $('.error');
          $error.html(error);
        }
      });
    });
    //attach event listener for remove button
    $rmBtn.on('click', function() {
      PostModel.remove(id, function(error) {
        if(!error) {
          $newsfeed.masonry('remove', $post);
          $newsfeed.masonry();
        } else {
          var $error = $('.error');
          $error.html(error);
        }
      });
    });
  }

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
