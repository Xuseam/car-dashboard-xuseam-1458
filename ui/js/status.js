var Status = (function() {
	'use strict';
    var ids = {
        power: 'power',
        reserve: 'reserve',
        reserve_mode: 'reserve_mode',
        reserve_time: 'reserve_time',
        reserve_temperature: 'reserve_temperature',
        reserve_volume_level: 'reserve_volume_level',
        reserve_direction: 'reserve_direction',
        running_mode: 'running_mode',
        running_temperature: 'running_temperature',
        running_volume_level: 'running_volume_level',
        running_direction: 'running_direction'
    };
    // Publicly accessible methods defined
  return {
  	turn_on: turn_on,
  	turn_off: turn_off,
  	reserve: reserve,
  	reserve_off: reserve_off,
    mode: mode,
    time: time,
    temperature: temperature,
    direction: direction,
    volume_level: volume_level,
    init: defaultScreen
  };

  function turn_on() {
  	document.getElementById(ids.power).innerText = "オン";
  }

	function turn_off() {
  	document.getElementById(ids.power).innerText = "オフ";
  }

  function reserve() {
  	document.getElementById(ids.reserve).innerText = "オン";
  }

	function reserve_off() {
  	document.getElementById(ids.reserve).innerText = "オフ";
  }

  function mode(value, context) {
    setValue(context, ids.reserve_mode, ids.running_mode)(value);
  }

  function time(value, context) {
  	document.getElementById(ids.reserve_time).innerText = value;
  }

  function temperature(value, context) {
  	setValue(context, ids.reserve_temperature, ids.running_temperature)(value);
  }

  function direction(value, context) {
  	setValue(context, ids.reserve_direction, ids.running_direction)(value);
  }

  function volume_level(value, context) {
  	setValue(context, ids.reserve_volume_level, ids.running_volume_level)(value);
  }

  function defaultScreen() {
  	Object.keys(ids).map(function(id, index){
  		if(id != ids.power) {
  			document.getElementById(ids[id]).innerText = "";
  		}
  	});
  }

  function setValue(context, reserveIds, runningIds) {
  	if(context.timeline) {
  		return function(value) {document.getElementById(reserveIds).innerText = value;}
  	} else {
  		return function(value) {document.getElementById(runningIds).innerText = value;}
  	}
  }

})();