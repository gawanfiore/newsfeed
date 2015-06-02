(function(window, document, undefined) {
  var SearchModel = {};

  var SEARCH_URL = '/search';
  var STATUS_OK = 200;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code
        if(request.responseText.length <= 0) {
          request.responseText = "[]";
        }
        var respMedia = JSON.parse(request.responseText);
        callback(null, respMedia);
      } else { //Bad response code
        callback(request.responseText, null);
      }
    });
    var url = SEARCH_URL + "?query=" + encodeURIComponent(query);
    //setup POST request
    request.open('GET', url);
    request.setRequestHeader('Content-type', 'application/json');
    //make request
    request.send();
  };

  window.SearchModel = SearchModel;
})(this, this.document);
