var Favorite = (function() {
    'use strict';
    var ids = {
        year: 'now-year',
        month: 'now-month',
        day: 'now-day',
        time: 'now-time',
        temperature: 'favorite-temperature',
        volume_level: 'favorite-volume_level',
        direction: 'favorite-direction',
        location: 'location'
    };

    var _temperature;
    var _volume_level;
    var _direction;
    var _location;
    return {
        init: init,
        update: update,
        temperature: function() { return _temperature},
        direction: function() { return _direction},
        location: function() { return _location}
    }

    function init() {
    	_temperature = 25;
    	_volume_level = "弱め";
    	_direction = "下向き";
    	document.getElementById(ids.temperature).value = _temperature;
    	document.getElementById(ids.volume_level).value = _volume_level;
    	document.getElementById(ids.direction).value = _direction;
    	setInterval(updateTime, 1000);
    }

    function update() {
    	_temperature = document.getElementById(ids.temperature).value;
    	_volume_level = document.getElementById(ids.volume_level).value;
    	_direction = document.getElementById(ids.direction).value;
    	var select = document.getElementById(ids.location);
        _location = select.options[select.selectedIndex].value;
    }

    function updateTime() {
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        var t_str = hours + ":" + minutes + " ";

        document.getElementById(ids.year).innerHTML = year;
        document.getElementById(ids.month).innerHTML = month;
        document.getElementById(ids.day).innerHTML = day;
        document.getElementById(ids.time).innerHTML = t_str;
    }
}());