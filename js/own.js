// todo play sounds

String.prototype.padded = function () {

	var foo = this;
	if (foo.length == 1) foo = '0' + foo;
	return foo;

};

var meetingTimer = (function () {

	var currentTime
			, lastTime
			, remainingTime
			, passedTime
			, timerID
			, $minutes = $('span.minutes')
			, $seconds = $('span.seconds')
			, $seperator = $('span.seperator')
			, $buttonStart = $('input.control.start')
			, $buttonPause = $('input.control.pause')
			, $buttonStop = $('input.control.stop')
			, seperatorVisibility = true
			, lastSeconds
			, NINETY_MINUTES = 5400000
			, TICKRATE = 100
			, keymap = [{}]
			;


	// private
	var updateTimer = function () {

		currentTime = new Date();
		passedTime = currentTime - lastTime;
		remainingTime = new Date(remainingTime - passedTime);

		if (remainingTime < 0) {
			stop();
		}

		else {

			var currentSeconds = remainingTime.getUTCSeconds();
			if (currentSeconds != lastSeconds) updateClock();
			lastSeconds = currentSeconds;

			//noinspection MagicNumberJS
			if (Math.round((remainingTime.getMilliseconds()) / 1000) ^ seperatorVisibility) {
				$seperator.toggleClass('invisible');
				seperatorVisibility = !seperatorVisibility;
			}
			lastTime = currentTime;
		}
	};

	var updateClock = function () {
		//noinspection MagicNumberJS
		$minutes.text((remainingTime.getUTCMinutes()+(remainingTime.getUTCHours()*60)).toString().padded());
		$seconds.text(remainingTime.getUTCSeconds().toString().padded());
	};

	var init = function () {

		// build keymap

		keymap[27] = {};
		keymap[27]['function'] = 'stop';
		keymap[32] = {};
		keymap[32]['function'] = 'startOrPause';
		keymap[48] = {};
		keymap[48]['function'] = 'addTime';
		keymap[48]['value'] = 10;

		for (i = 1; i <= 9; i++) {
			keymap[48+i] = {};
			keymap[48+i]['function'] = 'addTime';
			keymap[48+i]['value'] = i;
		}


		$(document).bind('keydown', function (e) {
			//check if key is in the map and then call resp function
			if (keymap[e.keyCode]) {
				var shift = e.shiftKey;
				var value = keymap[e.keyCode]['value'];
				value -= (value*shift*2);
				meetingTimer[keymap[e.keyCode]['function']](value);
			}
		});

		var $timeButtons = document.querySelectorAll('input.addTime');

		for (var i = 0; i < $timeButtons.length; i++) {
			var me = $timeButtons[i];
			var time = parseInt(me.dataset.value);
			// i got this from the internet.
			me.onclick = function (i) {
				return function () {
					addTime(i)
				}
			}(time);
		}

		$buttonStart.click(function () {start()});
		$buttonStop.click(function () {stop()});
		$buttonPause.click(function () {pause()});

		remainingTime = new Date(0);
		updateClock();
	};

	var start = function () {

		lastTime = new Date();
		if (!timerID && remainingTime > 0) {
			timerID = setInterval(updateTimer, TICKRATE);
			$buttonStart.addClass('hide');
			$buttonPause.removeClass('hide');
		}


	};

	var startOrPause = function () {

		if (timerID) pause();
		else start();

	};

	var addTime = function (minutes) {
		remainingTime.setMinutes(remainingTime.getUTCMinutes() + minutes);
		if (remainingTime < 0) stop();
		else if (remainingTime > NINETY_MINUTES) remainingTime = new Date (NINETY_MINUTES);
		updateClock();
	};

	var stop = function () {
		clearTimeout(timerID);

		timerID = 0;
		remainingTime = new Date(0);

		updateClock();
		$seperator.removeClass('invisible');
		$buttonStart.removeClass('hide');
		$buttonPause.addClass('hide');

	};

	var pause = function () {
		clearTimeout(timerID);
		timerID = 0;
		updateClock();
		$seperator.removeClass('invisible');
		$buttonStart.removeClass('hide');
		$buttonPause.addClass('hide');
	};

	// public
	return {

		foo: keymap,

		init: function () {
			init()
		}

		, startOrPause: function () {startOrPause()}

		, start: function () {
			start()
		}
		, addTime: function (minutes) {
			addTime(minutes)
		}
		, stop: function () {
			stop()
		}


	};

})();


$(document).ready(function () {

	meetingTimer.init();

});



