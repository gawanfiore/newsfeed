var request = require('request');
var STATUS_OK = 200;

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
  var params = {
    client_id: SC_CLIENT_ID,
    q: query
  };

  request.get({
    url: SC_URL,
    qs: params
  }, function (error, response, body) {
    if (error) { //error
      callback(error);
    } else if (response.statusCode != 200) { //no error but bad status
      callback(new Exception('Received bad status code: ' + response.statusCode));
    } else { //all good!
    	var respTracks = JSON.parse(body);
      var tracks = parseRespTracks(respTracks);
      callback(null, tracks);
    }
  });
};

/* Parse the Soundcloud API response */
function parseRespTracks(respTracks) {
	parsedTracks = [];
	for(var i = 0; i < respTracks.length; i++) {
		var track = respTracks[i];
		var parsedTrack = {title: track.title, source: SC_EMBED_URL + track.id};
		parsedTracks.push(parsedTrack);
	}
	return parsedTracks;
}