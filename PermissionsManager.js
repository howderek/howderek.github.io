/*
PermissionsManager.js

WARNING: This file can be easily circumvented by someone with JS knowledge,
         and should not be considered a substitue for a back-end solution.

For help, contact the author: Derek Howard <howardder@missouri.edu>
(c) 2015 The Curators of the University of Missouri
*/


var PermissionsManager = function() {
  this.elemBlockRules = [];
  this.pageBlockRules = [];
}

/* 
PermissionsManager.addElementRule(Object) - Blocks users with certain roles from seeing certain elements:
  
  (PermissionsManager instance).addElementRule({
	  block: ['(USER ROLE YOU WANT TO BLOCK)'],
	  from: ['(jQuery selectors you want to block - must be hidden with CSS first)'],
    pages: [/regex to match the window.location.pathname/],
	  where: 'everywhere/exam (optional, defaults to everywhere)'
  });
  
*/
PermissionsManager.prototype.addRule = function(rule) {
  rule.where = rule.where || 'everywhere';
  this.elemBlockRules.push(rule);
  $(rule.from.join(',')).hide();
}

/*
PermissionsManager.addPageRule(Object) - Blocks users with certain roles from seeing certain URLs

  (PermissionsManager instance).addPageRule({
	  block: ['(USER ROLE YOU WANT TO BLOCK)'],
	  
  });
  
*/

PermissionsManager.prototype.enforce = function() {
  var self = this;
  var pathArray = window.location.pathname.split('/');
  //get the permissions of the current user
  $.getJSON('/api/v1/courses/' + pathArray[2] + '/enrollments?user_id=self', function(data) {
      //loop through the rules
      for (var h = 0; h < self.elemBlockRules.length; h += 1) {
        var rule = self.elemBlockRules[h];
        //The following line looks to see if the rule goes into effect everywhere, or if not,
        //it checks to see if it is an exam by looking for the text "exam" or "final" on the page.
        var contextOkay = (rule.where === 'everywhere') ? true : (/(exam|final)/i.test(document.documentElement.textContent)) ? true : false;
        //check if the rule applies, and if so remove the elements from the DOM
        if (rule.pages) {
          for (var i = 0; i < rules.pages.length; i += 1) {
            if (rule.pages[i].test(window.location.pathname)) {
              contextOkay = true;
            }
          }
        }
      if (rule.block.indexOf(data[0].role) >= 0 && contextOkay) {
        for (var i = 0; i < rule.from.length; i += 1) {
          $(rule.from[i]).remove();
        }
        if (rule.custom) {
          rule.custom();
        }
      } else {
        for (var i = 0; i < rule.from.length; i += 1) {
          $(rule.from[i]).show();
        }
      }
      }
    });
    //end of after JSON function
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
  from: ['body'],
  pages: [/.settings/],
});

blocker.enforce();