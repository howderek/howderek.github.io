konami = new Konami()
	konami.code = function() {
		notify('You are an epic person.',5000);
		}

konami.load()

function notify(msg,duration) {
	d = 5000
	d = duration
	document.getElementById('notifytext').innerHTML = '<p style="font-size:2em">' + msg + "</p>"
	
	$('#footer-container').animate({
			height: '2.5em'}, 500, function() {
		$('#notifytext').fadeIn();
		$('#notifytext').delay(d).fadeOut( function() { 
			$('#footer-container').animate({height: '-1px'},250 );
			});
		
	});
}

function fadeTool(fin,fout) {
	$(fout).fadeOut('slow' ,function() {
		$(fin).fadeIn('slow');
	});

}

function makeVisible(divID) {
	document.getElementById(divID).style.display = "block";
}

$(function(){
	$("#jquery-test").html("jQuery is loaded");
});

$("#fly").click(function () {
	$("#flytext").fadeIn("slow");
});

$(function(){
	
	
	$(".iframe").fancybox({
		'width' : 1000,
		'height' : 1200
	});
	// Accordion
	$("#accordion").accordion({ header: "h3" });

	// Tabs
	$('#tabs').tabs();


	// Dialog			
	$('#dialog').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Cool": function() { 
				$(this).dialog("close"); 
			}, 
		}
	});
	
	// Dialog Link
	$('#about').click(function(){
		$('#dialog').dialog('open');
		return false;
	});

	// Datepicker
	$('#datepicker').datepicker({
		inline: true
	});
	
	// Slider
	$('#slider').slider({
		range: true,
		values: [17, 67]
	});
	
	// Progressbar
	$("#progressbar").progressbar({
		value: 20 
	});
	
	//hover states on the static widgets
	$('#dialog_link, ul#icons li').hover(
		function() { $(this).addClass('ui-state-hover'); }, 
		function() { $(this).removeClass('ui-state-hover'); }
	);
	
});
