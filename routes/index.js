var soundcloud = require('../lib/soundcloud.js');
var youtube = require('../lib/youtube.js');
var flickr = require('../lib/flickr.js');
var Post = require('../models/post.js');

module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });

  /* Returns results from a search based on user's query. */
  app.get('/search', function(request, response) {
    var q = request.query.query;
    var results = [];
    var counter = 0;

    /* Takes the first media object of the returned results from each API
     * and appends it to an array of top results.
     */ 
    function handleResults(error, media, api) {
    	if(error) {
    		response.json(500, error);
    	} else {
    		if(media.length > 0) {
    			var first = media[0];
    			first.api = api;
    			results.push(first);
    		}
    		counter++;
    		if(counter == 3) {
    			response.json(200, results);
    		}
    	}
    }

    //make queries to each API
    soundcloud.search(q, function(error, tracks) {
    	handleResults(error, tracks, 'soundcloud');
    });
    youtube.search(q, function(error, videos) {
    	handleResults(error, videos, 'youtube');
    });
    flickr.search(q, function(error, photos) {
    	handleResults(error, photos, 'flickr');
    });

  });

  /* Gets all posts */
  app.get('/posts', function(request, response) {
  	Post.find(function(error, posts) {
			if (error) { throw error; }
			response.json(200, posts);
		});
  });

  /* Adds a post */
  app.post('/posts', function(request, response) {
  	var title = request.body.title;
  	var source = request.body.source;
  	var api = request.body.api;
  	//valid parameters present
  	if(!(title && source && api)) {
  		response.json(500, []);
  	}
  	//create post
		var newPost = new Post({
			title: title,
			source: source,
			api: api,
			upvotes: 0
		});
		//save post
		newPost.save(function(error) {
			if(error) { throw error; }
			response.json(200, newPost);
		});
  });

  /* Removes a post */
  app.post('/posts/remove', function(request, response) {
  	var id = request.body.id;
  	Post.findByIdAndRemove(id, function(error) {
			if (error) { throw error; }
			//successfully deleted the post
			response.json(200, null);
		});
  });

  /* Increments an upvote to a post */
  app.post('/posts/upvote', function(request, response) {
  	var id = request.body.id;
  	Post.findById(id, function(error, post) {
  		if(error) { throw error; }
  		//add upvote
  		post.upvotes += 1;
  		post.save(function(error) {
  			if(error) { throw error; }
  			response.json(200, post);
  		});
  	});
  });


};
