/*
PermissionsManager.js

WARNING: This file can be easily circumvented by someone with JS knowledge,
         and should not be considered a substitue for a back-end solution.

For help, contact the author: Derek Howard <howardder@missouri.edu>
(c) 2015 The Curators of the University of Missouri
*/


var PermissionsManager = function() {
  this.rules = [];
}

/* 
PermissionsManager.addElementRule(Object) - Blocks users with certain roles from seeing certain elements:
  
  (PermissionsManager instance).addElementRule({
	  block: ['(USER ROLE YOU WANT TO BLOCK)'],
	  from: ['(jQuery selectors you want to block - must be hidden with CSS first)'],
    	  pages: [/regex to match the window.location.pathname/], (optional, if not given, it will run on every page)
	  where: 'everywhere/exam (optional, defaults to everywhere)'
  });
  
*/
PermissionsManager.prototype.addRule = function(rule) {
  rule.where = rule.where || 'everywhere';
  this.rules.push(rule);
  if (rule.from) $(rule.from.join(',')).hide();
}

PermissionsManager.prototype.enforce = function(data) {

  var self = this;
  var contextOkay = false;
  var locationOkay = false;
  var i = 0;
  var h = 0;

  console.log(data);
  for (h = 0; h < self.rules.length; h += 1) {
    console.log('Enforcing rule ' + (h + 1));
    var rule = self.rules[h]
      //The following line looks to see if the rule goes into effect everywhere, or if not,
      //it checks to see if it is an exam by looking for the text "exam" or "final" on the page.
    var contextOkay = (rule.where === 'everywhere') ? true : (/(exam|final)/i.test(document.documentElement.textContent)) ? true : false;
    if (rule.where === 'exam') {
    	rule.pages = rule.pages || [];
    	rule.pages.push(/quizzes/);
    }
    //check if the rule applies, and if so remove the elements from the DOM
    if (typeof rule.pages === 'object' && rule.pages.length) {
      locationOkay = false;
      console.log('Checking URL....');
      for (i = 0; i < rule.pages.length; i += 1) {
        if (!locationOkay) locationOkay = rule.pages[i].test(window.location.pathname);
      }
    } else {
      locationOkay = true;
    }
    console.log('Context is ' + contextOkay + ' and location is ' + locationOkay);
    //is this a rule we should enforce?
    if ((rule.block.indexOf(data[0] ? data[0].role : 'everyone') >= 0) && contextOkay && locationOkay) {
      console.log('Disallowed. Blocking.');
      if (rule.from) {
        $(rule.from.join(',')).remove();
      }
      if (rule.custom) {
        rule.custom(data);
      }
    } else {
      console.log('Allowed. Fixing.');
      if (rule.from) $(rule.from.join(',')).show();
    }
    //iterate to the next rule
  }
};

PermissionsManager.prototype.start = function() {
  var self = this;
  var pathArray = window.location.pathname.split('/');
  //get the permissions of the current user
  if (localStorage.permissions) {
    console.log('Permissions found. Enforcing.');
    this.enforce(JSON.parse(localStorage.permissions));
    $('body').css({visibility: 'visible'});
  }
  if (pathArray[2]) { $.getJSON('/api/v1/courses/' + pathArray[2] + '/enrollments?user_id=self', function(data) {
      localStorage.permissions = JSON.stringify(data);
      self.enforce(data);
      $('body').css({visibility: 'visible'});
    });
  }
}

/*************************/
/*      MU K12 Rules     */
/*************************/

//The instance of the PermissionsManager we can use
var blocker = new PermissionsManager();

//add SpeedGrader link
blocker.addRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  pages: [/assignments/],
  where: 'everywhere',
  custom: function () {
    var pathArray = window.location.pathname.split('/');
    //see if we already made the link 
    if (!$('#assignment-speedgrader-link').length) {
      $('#sidebar_content ul').append('<li id="assignment-speedgrader-link"><a target="_blank" href="/courses/' + pathArray[2] + '/gradebook/speed_grader?assignment_id=' + pathArray[4] + '" class="icon-speed-grader">SpeedGrader™</a></li>');
    }  
  }
});
//prevent BR_Teachers/BR_Coordinators from seeing exam questions
blocker.addRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['#right-side'],
  where: 'exam'
});
//prevent BR_Teachers/BR_Coordinators from seeing the Settings sub menu
blocker.addRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['.settings'],
  where: 'everywhere'
});
//prevent BR_Teachers/BR_Coordinators from accessing the Settings page via URL
blocker.addRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['#wrapper'],
  pages: [/.settings/],
  where: 'everywhere'
});
//prevent BR_Teachers/BR_Coordinators from accessing rubric on SpeedGrader
blocker.addRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['#right_side #rubric_assessments_list_and_edit_button_holder .button-container'],
  pages: [/speed/],
  where: 'everywhere'
});


blocker.start();
