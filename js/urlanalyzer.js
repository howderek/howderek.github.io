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