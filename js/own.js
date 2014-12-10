// todo play sounds
// todo allow 99 minutes
//

String.prototype.padded = function () {

	var foo = this;
	if (foo.length == 1) foo = '0' + foo;
	return foo;

};

var meetingTimer = (function () {

	// private

	var currentTime
			, lastTime
			, remainingTime
			, passedTime
			, timerID
			, tickrate = 100
			, $minutes = $('span.minutes')
			, $seconds = $('span.seconds')
			, $seperator = $('span.seperator')
			, seperatorVisibility = true
			, lastSeconds
			;

	var updateTimer = function () {

		currentTime = new Date();
		passedTime = currentTime - lastTime;
		remainingTime = new Date(remainingTime - passedTime);

		if (remainingTime < 0) {
			stop();
			stop();
		}

		else {

			var currentSeconds = remainingTime.getSeconds();
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
		$minutes.text(remainingTime.getMinutes().toString().padded());
		$seconds.text(remainingTime.getSeconds().toString().padded());
	};

	var init = function () {

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

		document.querySelector('input.control.start').onclick = function () {
			start()
		};
		document.querySelector('input.control.stop').onclick = function () {
			stop()
		};

		document.querySelector('input.control.pause').onclick = function () {
			pause()
		};

		remainingTime = new Date(0);
		remainingTime.setMinutes(remainingTime.getMinutes() + 10);
		start();
	};

	var start = function () {

		lastTime = new Date();
		if (!timerID) {
			timerID = setInterval(updateTimer, tickrate);
		}


	};

	var addTime = function (minutes) {
		remainingTime.setMinutes(remainingTime.getMinutes() + minutes);
		if (remainingTime < 0) stop();
		else updateClock();
	};

	var stop = function () {
		clearTimeout(timerID);
		timerID = 0;

		remainingTime = new Date(0);
		updateClock();

		$seperator.classList.remove('invisible');
	};

	var pause = function () {
		clearTimeout(timerID);
		timerID = 0;
		updateClock();
		$seperator.classList.remove('invisible');
	};

	// public
	return {

		init: function () {
			init()
		}

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



