/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Add IBM_ZhangJing Weather Company Start
// const express = require('express');
// const app = express();
var express = require('express');
var app = express();
var request = require('request');
var cfenv = require('cfenv');

//Security - helmet
var helmet = require('helmet');
var ninetyDaysInMilliseconds = 7776000000;


    app.use(express.static(__dirname + '/public'));
    // set the HTTP Strict Transport Security (HSTS) header for 90 days
    app.use(helmet.hsts({
        maxAge: ninetyDaysInMilliseconds,
        includeSubdomains: true,
        force: true
    }));
    // Prevent Cross-site scripting (XSS) attacks
    app.use(helmet.xssFilter());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var weather_host = "https://3e08f2fa-d2b1-43a2-a696-7f7787176707:KEhiaTahFO@twcservice.mybluemix.net";
// var weather_host = appEnv.services["weatherinsights"]
//     ? appEnv.services["weatherinsights"][0].credentials.url // Weather credentials passed in
//     : ""; // or copy your credentials url here for standalone

function weatherAPI(path, qs, done) {
    var url = weather_host + path;
    console.log(url, qs);
    request({
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        qs: qs
    }, function(err, req, data) {
        if (err) {
            done(err);
        } else {
            if (req.statusCode >= 200 && req.statusCode < 400) {
                try {
                    done(null, JSON.parse(data));
                } catch(e) {
                    console.log(e);
                    done(e);
                }
            } else {
                console.log(err);
                done({ message: req.statusCode, data: data });
            }
        }
    });
}

app.get('/api/forecast/daily', function(req, res) {
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");
    weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/daily/10day.json", {
        units: req.query.units || "m",
        language: req.query.language || "en"
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err).status(400);
        } else {
            console.log("10 days Forecast");
            res.json(result);
        }
    });
});

app.get('/api/forecast/hourly', function(req, res) {
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");
    weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/observations.json", {
        units: req.query.units || "m",
        language: req.query.language || "en"
    }, function(err, result) {
        if (err) {
            res.send(err).status(400);
        } else {
            console.log("24 hours Forecast");
            res.json(result);
        }
    });
});

app.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url);
});
// Add IBM_ZhangJing Weather Company End

// Bootstrap application settings
require('./config/express')(app);

// Configure the Watson services
require('./routes/conversation')(app);
require('./routes/speech-to-text')(app);
require('./routes/text-to-speech')(app);

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
