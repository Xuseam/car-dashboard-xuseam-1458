var Log = (function() {
	'use strict';

	// Publicly accessible methods defined
  return {
    init: init
  };

  function init() {
  	var currentRequestPayloadSetter = Api.setUserPayload;
    Api.setUserPayload = function(payload) {
      currentRequestPayloadSetter.call(Api, payload);
      logUserPayload(payload);
    };

    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function(payload) {
      currentResponsePayloadSetter.call(Api, payload);
      logWatsonPayload(payload);
    };
  }

  function logUserPayload(payload) {
  	Common.displayRawMessage({type: 'Conversation', sent: true, json: payload});
  }

  function logWatsonPayload(payload) {
  	Common.displayRawMessage({type: 'Conversation', sent: false, json: payload});
  }

}());