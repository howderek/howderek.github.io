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
  $(rule.from.join(',')).hide();
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
    //check if the rule applies, and if so remove the elements from the DOM
    if (rule.pages) {
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
        rule.custom();
      }
    } else {
      console.log('Allowed. Fixing.');
      $(rule.from.join(',')).fadeIn();
    }
    //iterate to the next rule
  }
};

PermissionsManager.prototype.start = function() {
  var self = this;
  var pathArray = window.location.pathname.split('/');
  var contextOkay = false;
  var locationOkay = false;
  var i = 0;
  var h = 0;
  //get the permissions of the current user
  if (!localStorage.permissions && pathArray[2]) {
    console.log('Need to make permissions request...carrying on.');
    $.getJSON('/api/v1/courses/' + pathArray[2] + '/enrollments?user_id=self', function(data) {
      localStorage.permissions = JSON.stringify(data);
      self.enforce(data);
      $('body').show();
    });
    //end of after JSON function
  } else {
    console.log('Permissions found. Enforcing.');
    this.enforce(JSON.parse(localStorage.permissions));
    $('body').show();
  }
}

/*************************/
/*      MU K12 Rules     */
/*************************/

//The instance of the PermissionsManager we can use
var blocker = new PermissionsManager();

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

blocker.start();