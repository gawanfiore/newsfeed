var request = require('request');
var STATUS_OK = 200;

var FLICKR_URL = 'https://api.flickr.com/services/rest/';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';


/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
  var params = {
    api_key: FLICKR_API_KEY,
    text: query,
    method: 'flickr.photos.search',
    format: 'json',
    media: 'photos',
    sort: 'relevance',
    nojsoncallback: 1
  };
  
  request.get({
    url: FLICKR_URL,
    qs: params
  }, function (error, response, body) {
    if (error) { //error
      callback(error);
    } else if (response.statusCode != 200) { //no error but bad status
      callback(new Exception('Received bad status code: ' + response.statusCode));
    } else { //all good!
    	var respPhotos = JSON.parse(body);
      var photos = parseRespPhotos(respPhotos);
      callback(null, photos);
    }
  });
};

/* Parse the Flickr API response */
function parseRespPhotos(respPhotos) {
	var photos = respPhotos.photos.photo
	parsedPhotos = []
	for(var i = 0; i < photos.length; i++) {
		var photo = photos[i];
		var photoSource = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg';
		var parsedPhoto = {title: photo.title, source: photoSource};
		parsedPhotos.push(parsedPhoto);
	}
	return parsedPhotos;
}


