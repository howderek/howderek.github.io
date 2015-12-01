// JavaScript Document

//Object that is responsible for managing what users with different roles can see.
//Please note that this is not secure, and ideally we would have a backend solution.
function PermissionsManager = function () {
    this.elemBlockRules = [];
    this.pageBlockRules = [];
}

PermissionsManager.prototype.addElementRule = function (rule) {
    this.elemBlockRules.push(rule);
}

PermissionsManager.prototype.addPageRule = function (rule) {
    this.pageBlockRules.push(rule);
}

PermissionsManager.prototype.enforce = function (rule) {
    this.elemBlockRules.push(rule);
    $.getJSON("api/v1/accounts/self/roles", function (data) {
        console.log(data.role);
    }
}
//THE LIVE SERVER AND DEV SERVER JS FILES ARE DIFFERENT; (THEY SHOULD BE THE SAME, MINUS THE LINK FOR WHERE CSS IS STORED.)
$(document).ready(function () {
    if ($("body").attr("class").match(/\bcontext-course_(.[0-9]*)/)) { //check to see if it is a course
        //CREATE 60 PERCENT ON EXAMS REMINDER
        var achieve60PercentExams = '<div class="alert">Remember: If your course has exams, you <u>must</u> achieve a combined average of 60% on the exams or you will receive a failing grade for the course (no matter your final percentage or grade in the class).</div>';
        $('table#grades_summary').before(achieve60PercentExams);
        $('table#grades_summary').after(achieve60PercentExams);
        
        /******************************************************************
        Hides the course code from the breadcrumb and the upper left-hand corner menu item
        and replaces it with the course name. This way, users don't see an "ugly code" in their course, and course code is in small lettering and italics. Ask Krista if you have any questions! ~KG
        *********************************************************************/
        //insert course ID into variable
        var courseID = $("body").attr("class").match(/\bcontext-course_(.[0-9]*)/)[1];
        //alert(courseID);
        $.getJSON("/api/v1/courses/" + courseID, "include[]=term", function (data) {
            //alert(data.name);
            //alert(data.term.name);
            $("h2.recent-activity-header").html("<h3>Recent activity in " + data.name + ":</h3>");
            $("h1#section-tabs-header").html(data.name + '<br /><span id="section-tabs-header-subtitle">(' + data.course_code + ')<br /><em>' + data.term.name + '</em></span></span>');
            //$("div.h1#section-tabs-header").html(data.name + '<br /><span id="section-tabs-header-subtitle"><em>' + data.term.name + '</em></span>');
            $("#breadcrumbs ul li:nth-child(2) a span.ellipsible").html(data.name);
            $('#section-tabs-header-subtitle.ellipsis').remove();
            //alert('modifying modules title...');
            //if(data.account_id===20){//if account id=20 or belongs to quick import
            //$('a.modules').html('Submit my Work');
            //}//end if account id
        }); //end get jSON
        /***********END CUSTOMIZE UPPER LEFT CORNER JS*************/
        /******************************************************************
        This part of the javascript injects an course-id-specific header link to a css file in the 
        path of [domain]/css/courseID/courseID.css. This allows you to customize each course separately, rather
        than at the sub-account only level.  Ask Krista if you have any questions! ~KG
        *********************************************************************/
        var courseID = $("body").attr("class").match(/\bcontext-course_(.[0-9]*)/)[1]; //put course ID into variable
        //alert(courseID);
        //alert("creating css link...");
        //load css file into head of document
        var doc = document; // shortcut
        var cssId = 'myCss'; // you could encode the css path itself to generate id..
        if (!doc.getElementById(cssId)) {
            var head = doc.getElementsByTagName('head')[0];
            var link = doc.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://mk12dev.missouri.edu/css/courses/' + courseID + '/styles.css';
            link.media = 'all';
            head.appendChild(link);
        }
        //alert(link.href);*/
        /***********END ADD COURSE-SPECIFIC CSS JS*************/
        /***********************
        This next section lifts the 150-page cap on the content editor so you can insert any page 
        that has been created in your course, like it should be! :-)
        ************************/
        if (
            ($("body").attr("class").match(/edit/)) || ($("body").attr("class").match(/no-touch/))) { //if editing a page or assignment
            $.getJSON("/api/v1/courses/" + courseID + "/pages?sort=title&order=asc&page=4&per_page=50", function (data) {
                //alert(data.length);
                if (data.length > 0) { //if there is more than 150 pages in the course
                    $.getJSON("/api/v1/courses/" + courseID + "/pages?sort=title&order=asc&page=1&per_page=100", function (data) {
                        var wikilist = '';
                        if (data.length > 0) { //if course has more than 0 pages
                            //alert(data.length + "still db script");
                            //var count = 1;
                            $.each(data, function (i, page) {
                                wikilist += '<li title="Click to insert a link to this page"><a href="/courses/' + courseID + '/wiki/' + page.url + '" role="button">' + page.title + '</a></li>';
                                //count++;
                            }); //end each
                            if (data.length == 100) { //if data length is exactly 100, add button...cannot add another json query without other type of programming
                                wikilist += '<button onclick="showMorePages(' + courseID + ')" id="btnShow100">Show 100 More</button>';
                            } else {
                                wikilist += "--end of list--";
                            } //end if data.length ==100
                            $('#pages_tab_panel ul.wiki_pages.page_list').html(wikilist);
                        }; //end if data.length >0
                    }); //end get jSON pages API 0-100*/
                } //end if data.length course has more than 150pages
            }); //end get jSON pages API 4th 150-200*/
        } //end if in edit mode
        /***********END 150-PAGE CAP JS*************/
    } //end check if it is a course
}); //end on document ready
//FUNCTION FOR 150 PAGE CUSOMIZATION BUTTON CALL
function showMorePages(courseID) {
    $.getJSON("/api/v1/courses/" + courseID + "/pages?sort=title&order=asc&page=2&per_page=100", function (data) {
        //alert('running function');
        $("#btnShow100").remove();
        var wikilist = '';
        if (data.length > 0) { //if course has more than 0 pages
            //alert(data.length);
            //var count=101;
            $.each(data, function (i, page) {
                wikilist += '<li title="Click to insert a link to this page"><a href="/courses/' + courseID + '/wiki/' + page.url + '" role="button">' + page.title + '</a></li>';
                //count++;
            }); //end each
            if (data.length == 100) { //if data length is exactly 100, add button...cannot add another json query without other type of programming
                wikilist += '<button onclick="showMorePages(' + courseID + ')" id="btnShow100">Show More Pages</button>';
            } else {
                wikilist += "--end of list--";
            } //end if data.length ==100
            $('#pages_tab_panel ul.wiki_pages.page_list').append(wikilist);
        }; //end if data.length >0
    }); //end get jSON pages API 0-100*/
} //end function
