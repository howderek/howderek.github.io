

console.log("Load started");


(function($) {
  
  //Object that is responsible for managing what users with different roles can see.
  //Please note that this is not secure, and ideally we would have a backend solution.
  //Ask Derek Howard <howardder@missouri.edu> if you have any questions.
  ;var PermissionsManager = function () {
    this.elemBlockRules = [];
    this.pageBlockRules = [];
  }
  
  /*
  AddElementRule(Object) - Blocks users with certain roles from seeing certain elements
  usage:
  (PermissionsManager instance).addElementRule({
  	block: ['(USER ROLE YOU WANT TO BLOCK)'],
  	from: ['(jQuery selectors you want to block - must be hidden with CSS first)'],
  	when: 'everywhere/exam (optional, defaults to everywhere)'
  });*/
  PermissionsManager.prototype.addElementRule = function (rule) {
      this.elemBlockRules.push(rule);
  }
  
  PermissionsManager.prototype.addPageRule = function (rule) {
  	rule.when = rule.when || 'everywhere';
    this.pageBlockRules.push(rule);
  }
  
  PermissionsManager.prototype.enforce = function () {
  	console.log('Enforcing permissions.');
      $.getJSON("api/v1/accounts/self/roles", function (data) {
        console.log(data.role);
        //The following line is a bit complex, but what it does is it looks to see if the rule goes into
        //effect everywhere, or if not, it checks to see if it is an exam by looking for an access code.
        var contextOkay = (this.when === 'everywhere') ? true : ($('.control-label:contains("Access Code")').length) ? true : false;
        if (this.block.indexOf(data.role) > -1 && contextOkay) {
        	for (var i = 0;i < this.from.length; i += 1) {
        		$(this.from[i]).remove();
      	}
      }
    });
  }
  
  var blocker = new PermissionsManager();
  blocker.addElementRule({
  	block: ['BR_Teacher', 'BR_Coordinator'],
  	from: ['.page-access-list'],
  	when: 'exam'
  })
  blocker.enforce();
  
  
  
  console.log("Function Firing");
  $(document).ready(function() {
    console.log("Document Ready Firing");
    var user_id = null;
    var course_id = null;
    var quiz_id = null;
    
    try {
      user_id = ENV.current_user_id;
      course_id = ENV.COURSE_ID;
      quiz_id = ENV.QUIZ.id;
    }
    catch (ex) {
      console.log("Missing data");
      user_id = null;
      course_id = null;
      quiz_id = null;
    }
    
    var details_wrapper = $("div#quiz_details_wrapper");
    if (details_wrapper && (user_id != null) && (course_id != null) && (quiz_id != null)) {
      console.log("Found #quiz_details_wrapper, fetching results");
      var m = $.get("https://mk12dev.missouri.edu/lee_test/results/" + user_id + "/" + course_id + "/" + quiz_id)
      .done(function(d, s) {
        console.log("Query returned successfully!");  
	$("div.quiz-submission > div.alert").remove();
	$("div.quiz-submission > h4").remove();
	$("div.quiz-submission")
          .append("<h4>Your Strengths (Items correct)</h4>")
          .append("<table class=\"table table-bordered ic-Table ic-Table--hover-row ic-Table--striped correct\"><thead><tr><td>Lesson</td><td>Topic</td><td>Objective</td><td>Standard</td></tr></thead><tbody></tbody></table>")
          .append("<hr/>")
          .append("<h4>Your Areas for Improvement (Items incorrect)</h4>")
          .append("<table class=\"table table-bordered ic-Table ic-Table--hover-row ic-Table--striped incorrect\"><thead><tr><td>Lesson</td><td>Topic</td><td>Objective</td><td>Standard</td></tr></thead><tbody></tbody></table>");
        var results = d;
        
	for (var key in d.correct) {
	  var correctTable = $("div.quiz-submission > table.correct tbody");
	  if (! $.isEmptyObject(d.correct[key].question_details)) {
            correctTable
	      .append($("<tr>")
		.append($("<td>")
                  .text(d.correct[key].question_details['lesson']))
		.append($("<td>")
              	  .text(d.correct[key].question_details['topic']))
              	.append($("<td>")
                  .text(d.correct[key].question_details['objective']))
                .append($("<td>")
                  .text(d.correct[key].question_details['standard']))
	      );
          }
          else {
	    console.log("::", d.correct[key].question_details);
	  }
	}
	
        for (var key in d.incorrect) {
	  var incorrectTable = $("div.quiz-submission > table.incorrect tbody");
	  if (! $.isEmptyObject(d.incorrect[key].question_details)) {
            incorrectTable
	      .append($("<tr>")
		.append($("<td>")
                  .text(d.incorrect[key].question_details['lesson']))
		.append($("<td>")
              	  .text(d.incorrect[key].question_details['topic']))
              	.append($("<td>")
                  .text(d.incorrect[key].question_details['objective']))
                .append($("<td>")
                  .text(d.incorrect[key].question_details['standard']))
              );
          }
          else {
	    console.log("::", d.incorrect[key].question_details);
	  }
	}
      })
      .always(function() {
        console.log("Finished the query");
      })
      .error(function(d, s) {
        console.log("Error");
        console.log(s);
      });
    }
    else {
      console.log("No query needed.");
    }
  });
})(jQuery);
console.log("Script Load Finished");
