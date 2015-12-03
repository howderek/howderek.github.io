var PermissionsManager = function () {
  this.elemBlockRules = [];
  this.pageBlockRules = [];
}

/*
AddElementRule(Object) - Blocks users with certain roles from seeing certain elements
usage:
(PermissionsManager instance).addElementRule({
	block: ['(USER ROLE YOU WANT TO BLOCK)'],
	from: ['(jQuery selectors you want to block - must be hidden with CSS first)'],
	where: 'everywhere/exam (optional, defaults to everywhere)'
});*/
PermissionsManager.prototype.addElementRule = function (rule) {
  rule.where = rule.where || 'everywhere';
  this.elemBlockRules.push(rule);
}

/*
AddPageRule(Object) - Blocks users with certain roles from seeing certain elements
usage:
(PermissionsManager instance).addPageRule({
	block: ['(USER ROLE YOU WANT TO BLOCK)'],
	from: [/regex to match the window.location.pathname/],
});*/
PermissionsManager.prototype.addPageRule = function (rule) {
  this.pageBlockRules.push(rule);
}

PermissionsManager.prototype.enforce = function () {
  var self = this;
  var pathArray = window.location.pathname.split('/');
  //get the permissions of the current user
  $.getJSON('/api/v1/courses/' + pathArray[2] + '/enrollments?user_id=self', function (data) {
    console.log(data[0].role);
    console.log(self);
    //The following line looks to see if the rule goes into effect everywhere, or if not,
    // it checks to see if it is an exam by looking for an access code.

    for (var h = 0; h < self.elemBlockRules.length; h += 1) {
      var rule = self.elemBlockRules[h];
      var contextOkay = (rule.where === 'everywhere') ? true : (/(exam|final)/i.test(document.documentElement.textContent)) ? true : false;
      if (rule.block.indexOf(data[0].role) >= 0 && contextOkay) {
        for (var i = 0; i < rule.from.length; i += 1) {
          $(rule.from[i]).remove();
        }
      }
    }
    for (var h = 0; h < self.pageBlockRules.length; h += 1) {
      var rule = self.pageBlockRules[h];
      if (rule.block.indexOf(data[0].role) >= 0) {
        for (var i = 0; i < rule.from.length; i += 1) {
          if (rule.from[i].test(window.location.pathname)) {
            document.write("You don't have permission to view this page.");
          }
        }
      }
    }
  });
}


/*************************/
/*      MU K12 Rules     */
/*************************/
var blocker = new PermissionsManager();
blocker.addElementRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['#right-side'],
  where: 'exam'
});
blocker.addElementRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: ['.settings'],
  where: 'everywhere'
});
blocker.addPageRule({
  block: ['BR_Teacher', 'BR_Coordinator'],
  from: [/.settings/],
});

blocker.enforce();
