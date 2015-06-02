/***********************************/
/*          CYCLE FITNESS          */
/*      (c) 2015 Derek Howard      */
/*    one global, lints cleanly    */
/***********************************/

/*jslint browser:true*/
/*global atob, btoa*/

//initialize the site
var Derek = (function () {
    'use strict';
    Derek = {};
    
    var navActive = false;
    
    Derek.showModal = function (html) {
        var modal = document.createElement('div'),
            overlay = document.createElement('div'),
            close = function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
                document.getElementById('content').style.webkitFilter = '';
            };
            
        modal.id = 'modal';
        overlay.id = 'overlay';
        modal.innerHTML = html;
        overlay.onclick = close;
        document.getElementById('content').style.webkitFilter = 'blur(10px)';
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        document.getElementById('modal').innerHTML = html;
        document.getElementById('overlay').onclick = close;
    };
    
    Derek.toggleNav = function () {
        navActive = !navActive;
        document.getElementsByTagName('nav')[0].className = (navActive) ? 'visible' : 'desktop';
        document.getElementById('social').className = (navActive) ? '' : 'desktop';
    };
    
    document.getElementById('mail').onclick = function () {
        window.location.href = atob('bWFpbHRvOmRlcmVrQGhvd2RlcmVrLmNvbQ==');
    };
    
    document.getElementById('top').onclick = function () {
        window.scrollTo(0, 0);
    };
    
    return Derek;
    
}());

