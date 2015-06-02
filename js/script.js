//script.js (c) 2013 Derek Howard
//Handles user interaction with howderek.com
/*jslint browser:true*/
/*global $, console*/

//URLTools- a tiny js library for accessing parts of the url
function urlAnalyze(url) {
	if (url == undefined) {var url = document.location.toString();}
	url = url.replace(/\%20/g," ");
	//seperates the parts of the url
	var parts = url.split("?");
	//splits into sperate key=values
	if (parts[1] == undefined) {return 1;}
	var keyValues = parts[1].split("&");
	var key = function () {}
	keyValues.forEach(function (keyValue) {
		var keyAndValue = keyValue.split("=");
		eval("key." + keyAndValue[0] + " = \"" + keyAndValue[1] + "\"" );
	});
	return key;
}

$.stellar();

var faceClickCount = 0,
	urlKeys = urlAnalyze();


function notify(text) {
    'use strict';
    $('#notify').html(text).fadeIn(1000, function () {
        setTimeout(function () {$('#notify').fadeOut(1000); }, ((text.length * 50) + 500));
    });
}

if (urlKeys['notify']) {
	notify(urlKeys['notify']);
}

$('#showcase1').hover(function() { $('#desc').html('WordEngine is a fun little tool to unscramble words, find anagrams, fill in missing letters, and give some basic stats about words.'); });
$('#showcase2').hover(function() { $('#desc').html('diediedie is a powerful and elegant die roller that is capable of rolling any number of any kind of dice and performing operations on them.'); });