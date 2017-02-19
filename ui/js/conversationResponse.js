/*
 * Copyright © 2016 I.B.M. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* The Intents module contains a list of the possible intents that might be returned by the API */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ConversationResponse$" }] */
/* global Animations: true, Api: true, Panel: true */

var ConversationResponse = (function () {
  'use strict';
  var responseFunctions;
  var isCancelTrigged = false;

  return {
    init: init,
    responseHandler: responseHandler
  };

  function init() {
    setupResponseFunctions();
    setupResponseHandling();
  }

  function setupResponseFunctions() {
      responseFunctions = {
          turn_on: {
              mode: function(value, context) { Status.mode(value, context); },
              time: function(value, context) { Status.time(value, context); },
              temperature: function(value, context) { Status.temperature(value, context) },
              direction: function(value, context) { Status.direction(value, context) },
              volume_level: function(value, context) { Status.volume_level(value, context) },
              func: function() { Status.turn_on(); }
          },

          turn_off: function() { Status.init();　Status.turn_off(); },
          reserve: {
              mode: function(value, context) { Status.mode(value, context); },
              time: function(value, context) { Status.time(value, context); },
              temperature: function(value, context) { Status.temperature(value, context) },
              direction: function(value, context) { Status.direction(value, context) },
              volume_level: function(value, context) { Status.volume_level(value, context) },
              func: function() { Status.turn_on(); Status.reserve(); }
          },

          reserve_off: function() { Status.reserve_off(); },
          control: {
              mode: function(value, context) { Status.mode(value, context); },
              time: function(value, context) { Status.time(value, context); },
              temperature: function(value, context) { Status.temperature(value, context) },
              direction: function(value, context) { Status.direction(value, context) },
              volume_level: function(value, context) { Status.volume_level(value, context) },
              negative: function() {isCancelTrigged = false;},
              positive: function() {
                isCancelTrigged = false;
                Status.init();
              }
          },
          cancel: function() {isCancelTrigged = true;}
      };
  }

  // Create a callback when a new Watson response is received to handle Watson's response
  function setupResponseHandling() {
    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function (payload) {
      currentResponsePayloadSetter.call(Api, payload);
      responseHandler(payload);
    };
  }

  // Called when a Watson response is received, manages the behavior of the app based
  // on the user intent that was determined by Watson
  function responseHandler(data) {
    if (data && data.intents && data.entities && !data.output.error) {
      // Check if message is handled by retrieve and rank and there is no message set
      if (data.context.callRetrieveAndRank && !data.output.text) {
        // TODO add EIR link
        data.output.text = ['I am not able to answer that. You can try asking the'
          + ' <a href="https://conversation-enhanced.mybluemix.net/" target="_blank">Enhanced Information Retrieval App</a>'];
        Api.setWatsonPayload(data);
        return;
      }

      var primaryIntent = data.intents[0];
      if (primaryIntent) {
        handleBasicCase(primaryIntent, data.entities, data.context);
      }
    }
  }

  // Handles the case where there is valid intent and entities
  function handleBasicCase(primaryIntent, entities, context) {

      switch (primaryIntent.intent) {
          case 'cancel':
              break;
          default:
              break;
      }

      callResponseFunction(primaryIntent, entities, context);
  }

  // Calls the appropriate response function based on the given intent and entity returned by Watson
 function callResponseFunction(primaryIntent, entities, context) {
     var intent = responseFunctions[primaryIntent.intent];
     if (typeof intent === 'function') {
         intent();
     } else if (intent) {
         if (typeof intent.func === 'function') {
             intent.func();
         }
         entities.forEach(function(currentEntity) {
             var entityType = intent[currentEntity.entity];
             if (typeof entityType === 'function') {
                 entityType(currentEntity.value, context);
             }
         })
     }
 }
}());
