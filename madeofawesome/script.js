var times = 0;
$(document).ready(function () {
	unicorn1();
});

function unicorn1() {
	$("#unicorn").animate({left: "1600px"}, 6000, function() {
	document.getElementById("unicorn").style.left = "-1000px"
	unicorn2();
});
}

function unicorn2() {
	$("#unicorn").animate({left: "1600px"}, 6000, function() {
	document.getElementById("unicorn").style.left = "-1000px"
	unicorn1();
});
}

function unicornClicked() {
	times++;
	if (times == 1) {
		document.getElementById("unicornText").innerHTML = "You're a unicorn clicker.";
		alert('Yeah, I know you thought you got away with it. But you didn\'t. \n\nYou we\'re probably like "I bet a sick-minded unicorn clicker like me would get away with abusing unicorns in such a horrific fashion as clicking. It\'s not like it will do anything" \n\nIt did.');
	}
	if (times == 2) {
		alert('Really.\n\nAnyways, the fact that you are on this site is cool because that means you know me personally, or you just try the konami code on every site. So either way you\'re cool');
		document.getElementById("unicornText").innerHTML = "I can't believe you.";
	}
	if (times > 2) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> Are you proud of yourself?";
	}
	if (times >= 10) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> Just stop.";
	}
	if (times >= 20) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> You need therapy for your addiction.";
	}
	if (times >= 50) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> I just feel sorry for you now.";
	}
	if (times >= 100) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> You're truly just wasting your life away on this unicorn now.";
	}
	if (times >= 500) {
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> Come on, man. Is your job THAT bad?";
	}
	if (times == 1000) {
		alert(" Stop now, or I'll make you stop.")
		document.getElementById("unicornText").innerHTML = "You've clicked a unicorn " +  times + " times. <br/> DON'T DO IT";
	}
	if (times > 1000) {
		document.location = "http://www.google.com";
	}
}
	
