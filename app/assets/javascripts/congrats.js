$(function() {
	var numberOfStars = 200;
	
	for (var i = 0; i < numberOfStars; i++) {
	  $('.congrats').append('<div class="blob fa fa-star ' + i + '"></div>');
	}	

	animateText();
	
	animateBlobs();
});

$('.congrats').click(function() {
	reset();
	
	animateText();
	
	animateBlobs();
});

function reset() {
	$.each($('.blob'), function(i) {
		TweenMax.set($(this), { x: 0, y: 0, opacity: 1 });
	});
	
	TweenMax.set($('h1'), { scale: 1, opacity: 1, rotation: 0 });
}

function animateText() {
		TweenMax.from($('h1'), 0.8, {
		scale: 0.4,
		opacity: 0,
		rotation: 15,
		ease: Back.easeOut.config(4),
	});
}
	
function animateBlobs() {
	
	var xSeed = getRandomArbitrary(350, 380);
	var ySeed = getRandomArbitrary(120, 170);
	
	$.each($('.blob'), function(i) {
		var $blob = $(this);
		var speed = getRandomArbitrary(1, 5);
		var rotation = getRandomArbitrary(5, 100);
		var scale = getRandomArbitrary(0.8, 1.5);
		var x = getRandomArbitrary(-xSeed, xSeed);
		var y = getRandomArbitrary(-ySeed, ySeed);

		TweenMax.to($blob, speed, {
			x: x,
			y: y,
			ease: Power1.easeOut,
			opacity: 0,
			rotation: rotation,
			scale: scale,
			onStartParams: [$blob],
			onStart: function($element) {
				$element.css('display', 'block');
			},
			onCompleteParams: [$blob],
			onComplete: function($element) {
				$element.css('display', 'none');
			}
		});
	});
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}